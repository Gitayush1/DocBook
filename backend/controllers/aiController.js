import { GoogleGenerativeAI } from "@google/generative-ai";
import doctorModel from "../models/doctorModel.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Exact speciality names used in the DB (must match doctorModel records)
const VALID_SPECIALITIES = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

// POST /api/ai/recommend-doctor
// Helper: call Gemini with one automatic retry on 429
const callWithRetry = async (model, prompt, retries = 1) => {
  try {
    return await model.generateContent(prompt);
  } catch (err) {
    const is429 = err?.status === 429 || err?.message?.includes("429");
    if (is429 && retries > 0) {
      // Extract wait time from error or default to 10 s
      const waitMatch = err.message?.match(/retry in ([\d.]+)s/i);
      const waitSec = waitMatch ? Math.ceil(parseFloat(waitMatch[1])) : 10;
      console.log(`Rate-limited – retrying in ${waitSec}s …`);
      await new Promise((r) => setTimeout(r, waitSec * 1000));
      return callWithRetry(model, prompt, retries - 1);
    }
    throw err; // re-throw if not 429 or out of retries
  }
};

const recommendDoctor = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.trim().length < 3) {
      return res.json({ success: false, message: "Please describe your symptoms." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a helpful medical triage assistant. Based on the patient's symptoms, determine the MOST appropriate medical speciality from the list below.

Available specialities:
- General physician
- Gynecologist
- Dermatologist
- Pediatricians
- Neurologist
- Gastroenterologist

Patient symptoms: "${symptoms}"

Rules:
1. Reply with ONLY the speciality name from the list above — nothing else.
2. If the symptoms are very general or unclear, reply with "General physician".
3. Do NOT diagnose any disease. Only recommend a speciality.
4. Also reply with a 1-sentence friendly explanation (separate it with |||).

Format your response EXACTLY like this:
<speciality name>|||<1-sentence explanation>

Example: Dermatologist|||Skin rashes and itching are best evaluated by a skin specialist.
    `.trim();

    const result = await callWithRetry(model, prompt);
    const rawText = result.response.text().trim();

    // Parse the response
    const parts = rawText.split("|||");
    const suggestedSpeciality = parts[0]?.trim();
    const explanation = parts[1]?.trim() || "Based on your symptoms, we recommend this specialist.";

    // Validate the returned speciality is one we support
    const matchedSpeciality = VALID_SPECIALITIES.find(
      (s) => s.toLowerCase() === suggestedSpeciality?.toLowerCase()
    ) || "General physician";

    // Fetch matching available doctors from DB
    const doctors = await doctorModel
      .find({ speciality: matchedSpeciality, available: true })
      .select("-password -email -slots_booked");

    return res.json({
      success: true,
      speciality: matchedSpeciality,
      explanation,
      doctors,
    });

  } catch (error) {
    console.error("AI recommendation error:", error);

    // User-friendly message for quota / rate-limit errors
    const is429 = error?.status === 429 || error?.message?.includes("429");
    const message = is429
      ? "Our AI service is temporarily at capacity. Please try again in a minute."
      : error.message;

    res.json({ success: false, message });
  }
};

export { recommendDoctor };
