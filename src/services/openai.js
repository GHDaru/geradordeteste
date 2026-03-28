import { buildPrompt } from './prompt'

export const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini'

/**
 * Calls the OpenAI API to generate test content from a given context.
 * @param {string} apiKey - OpenAI API key
 * @param {string} context - The educational context to process
 * @param {Object} params - Test parameters (numQuestions, format, complexity)
 * @param {string} [model] - OpenAI model ID to use
 * @returns {Promise<{summary: string, test: Object}>}
 */
export async function generateTestContent(apiKey, context, params, model = DEFAULT_OPENAI_MODEL) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'Você é um assistente educacional especializado em criar resumos e testes. Sempre responda com JSON válido conforme solicitado.',
        },
        {
          role: 'user',
          content: buildPrompt(context, params),
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Erro na API: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

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
    // Attempt to extract JSON from the response if it contains extra text
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
