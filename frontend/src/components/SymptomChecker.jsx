import React, { useState, useContext, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

const SymptomChecker = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()

  const [symptoms, setSymptoms] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)   // { speciality, explanation, doctors }
  const [error, setError] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef(null)

  // Example symptoms chips
  const examples = [
    '😤 Persistent cough & fever',
    '🤕 Severe headache & dizziness',
    '🤢 Stomach pain & nausea',
    '🌿 Skin rash & itching',
    '👶 Child with high temperature',
    '💊 Irregular periods',
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!symptoms.trim() || symptoms.trim().length < 5) {
      setError('Please describe your symptoms in a bit more detail.')
      return
    }
    setError('')
    setLoading(true)
    setResult(null)

    try {
      const { data } = await axios.post(`${backendUrl}/api/ai/recommend-doctor`, {
        symptoms: symptoms.trim(),
      })

      if (data.success) {
        setResult(data)
      } else {
        setError(data.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Could not connect to AI service. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = (text) => {
    // Strip emoji prefix
    const cleaned = text.replace(/^[^\w]+/, '').trim()
    setSymptoms(cleaned)
    setResult(null)
    setError('')
    if (textareaRef.current) textareaRef.current.focus()
  }

  const handleReset = () => {
    setSymptoms('')
    setResult(null)
    setError('')
    if (textareaRef.current) textareaRef.current.focus()
  }

  return (
    <section className='w-full my-12'>
      {/* ── Section Header ── */}
      <div className='text-center mb-8'>
        <div className='inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 border border-indigo-100'>
          <span className='w-2 h-2 bg-indigo-500 rounded-full animate-pulse inline-block'></span>
          AI-Powered
        </div>
        <h2 className='text-3xl font-semibold text-gray-800'>Not sure which doctor to see?</h2>
        <p className='text-gray-500 mt-2 text-sm max-w-md mx-auto'>
          Describe your symptoms and our AI will instantly recommend the right specialist for you.
        </p>
      </div>

      {/* ── Main Card ── */}
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/60 overflow-hidden'>

          {/* Card Top Bar */}
          <div className='flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600'>
            <div className='w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-xl'>🩺</div>
            <div>
              <p className='text-white font-semibold text-sm'>Symptom Checker</p>
              <p className='text-indigo-100 text-xs'>Powered by Groq AI</p>
            </div>
            <span className='ml-auto bg-white/20 text-white text-xs px-3 py-1 rounded-full border border-white/30'>
              Free
            </span>
          </div>

          <div className='p-6'>
            {/* ── Input Form ── */}
            {!result && (
              <form onSubmit={handleSubmit}>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Describe your symptoms
                </label>
                <textarea
                  ref={textareaRef}
                  value={symptoms}
                  onChange={(e) => { setSymptoms(e.target.value); setError('') }}
                  placeholder="e.g., I've had a throbbing headache for 2 days, along with nausea and sensitivity to light..."
                  rows={4}
                  className='w-full resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all'
                />

                {/* Error */}
                {error && (
                  <p className='mt-2 text-xs text-red-500 flex items-center gap-1'>
                    <span>⚠️</span> {error}
                  </p>
                )}

                {/* Example chips */}
                <div className='mt-3'>
                  <p className='text-xs text-gray-400 mb-2'>Try an example:</p>
                  <div className='flex flex-wrap gap-2'>
                    {examples.map((ex, i) => (
                      <button
                        type='button'
                        key={i}
                        onClick={() => handleExampleClick(ex)}
                        className='text-xs bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 text-gray-600 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer'
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type='submit'
                  disabled={loading || !symptoms.trim()}
                  className='mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-medium py-3 rounded-xl transition-all duration-300 text-sm shadow-md shadow-indigo-200 disabled:shadow-none disabled:cursor-not-allowed'
                >
                  {loading ? (
                    <>
                      <svg className='animate-spin w-4 h-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                      </svg>
                      Analyzing symptoms…
                    </>
                  ) : (
                    <>✨ Find My Doctor</>
                  )}
                </button>
              </form>
            )}

            {/* ── Result ── */}
            {result && (
              <div className='animate-fadeIn'>
                {/* AI Recommendation Badge */}
                <div className='flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5'>
                  <div className='text-2xl mt-0.5'>🤖</div>
                  <div>
                    <p className='text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1'>AI Recommendation</p>
                    <p className='text-gray-800 font-semibold text-base'>{result.speciality}</p>
                    <p className='text-gray-500 text-sm mt-1'>{result.explanation}</p>
                  </div>
                </div>

                {/* Doctors List */}
                {result.doctors && result.doctors.length > 0 ? (
                  <>
                    <p className='text-sm font-medium text-gray-700 mb-3'>
                      Available {result.speciality}s ({result.doctors.length})
                    </p>
                    <div className='space-y-3 max-h-72 overflow-y-auto pr-1'>
                      {result.doctors.map((doc) => (
                        <div
                          key={doc._id}
                          onClick={() => navigate(`/appointment/${doc._id}`)}
                          className='flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/40 cursor-pointer transition-all duration-200 group'
                        >
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className='w-12 h-12 rounded-xl object-cover bg-blue-50 flex-shrink-0'
                          />
                          <div className='flex-1 min-w-0'>
                            <p className='font-medium text-gray-800 text-sm truncate'>{doc.name}</p>
                            <p className='text-xs text-gray-500'>{doc.speciality} · {doc.experience} exp</p>
                            <div className='flex items-center gap-1 mt-0.5'>
                              <span className='w-1.5 h-1.5 bg-green-500 rounded-full'></span>
                              <span className='text-xs text-green-600'>Available</span>
                            </div>
                          </div>
                          <div className='text-right flex-shrink-0'>
                            <p className='text-sm font-semibold text-gray-800'>${doc.fees}</p>
                            <p className='text-xs text-gray-400'>per visit</p>
                          </div>
                          <svg className='w-4 h-4 text-gray-300 group-hover:text-indigo-400 flex-shrink-0 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                          </svg>
                        </div>
                      ))}
                    </div>

                    {/* Browse All */}
                    <button
                      onClick={() => navigate(`/doctors/${result.speciality}`)}
                      className='mt-4 w-full text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium py-2 border border-indigo-100 hover:border-indigo-300 rounded-xl transition-all'
                    >
                      Browse all {result.speciality}s →
                    </button>
                  </>
                ) : (
                  <div className='text-center py-6'>
                    <p className='text-gray-400 text-sm'>No available {result.speciality}s right now.</p>
                    <button
                      onClick={() => navigate('/doctors')}
                      className='mt-3 text-indigo-600 text-sm font-medium hover:underline'
                    >
                      Browse all doctors →
                    </button>
                  </div>
                )}

                {/* Try Again */}
                <button
                  onClick={handleReset}
                  className='mt-4 w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-sm py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-all'
                >
                  ↩ Try different symptoms
                </button>

                {/* Disclaimer */}
                <p className='mt-3 text-center text-xs text-gray-400'>
                  ⚕️ This is not a medical diagnosis. Always consult a qualified physician.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* fade-in animation via inline style injection */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out both; }
      `}</style>
    </section>
  )
}

export default SymptomChecker
