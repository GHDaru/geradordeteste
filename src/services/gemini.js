import { buildPrompt } from './prompt'

/**
 * Calls the Google Gemini API to generate test content from a given context.
 * @param {string} apiKey - Gemini API key
 * @param {string} context - The educational context to process
 * @param {Object} params - Test parameters (numQuestions, format, complexity)
 * @returns {Promise<{summary: string, test: Object}>}
 */
export async function generateTestContent(apiKey, context, params) {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  'Você é um assistente educacional especializado em criar resumos e testes. Sempre responda com JSON válido conforme solicitado.\n\n' +
                  buildPrompt(context, params),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Erro na API: ${response.status}`)
  }

  const data = await response.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!content) {
    throw new Error('Resposta vazia da API.')
  }

  try {
    const parsed = JSON.parse(content)
    return {
      summary: parsed.summary || '',
      test: parsed.test || parsed,
    }
  } catch {
    const start = content.indexOf('{')
    const end = content.lastIndexOf('}')
    if (start !== -1 && end !== -1 && end > start) {
      const parsed = JSON.parse(content.slice(start, end + 1))
      return {
        summary: parsed.summary || '',
        test: parsed.test || parsed,
      }
    }
    throw new Error('Não foi possível interpretar a resposta da API.')
  }
}
