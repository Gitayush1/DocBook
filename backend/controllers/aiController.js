import Groq from "groq-sdk";
import doctorModel from "../models/doctorModel.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
const recommendDoctor = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.trim().length < 3) {
      return res.json({ success: false, message: "Please describe your symptoms." });
    }

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

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 150,
    });

    const rawText = chatCompletion.choices[0]?.message?.content?.trim() || "";

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

    const message = error.message || "AI service error. Please try again.";
    res.json({ success: false, message });
  }
};

export { recommendDoctor };
