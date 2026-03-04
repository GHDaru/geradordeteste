/**
 * Builds the prompt for generating test content.
 */
function buildPrompt(context, params) {
  const formatLabel = {
    multiple_choice: 'múltipla escolha (4 alternativas, apenas uma correta)',
    true_false: 'verdadeiro ou falso',
    open_ended: 'dissertativa (resposta aberta)',
    mixed: 'misto (combine múltipla escolha, verdadeiro/falso e dissertativa)',
  }[params.format]

  const complexityLabel = {
    easy: 'fácil (conceitos básicos, memorização)',
    medium: 'médio (compreensão e aplicação)',
    hard: 'difícil (análise, síntese e avaliação)',
  }[params.complexity]

  return `Você é um professor especialista. Analise o contexto abaixo e faça duas coisas:

1. Gere um resumo em Markdown (mínimo 200 palavras) dos principais conceitos que devem ser reforçados.
2. Gere ${params.numQuestions} questões de ${formatLabel}, com complexidade ${complexityLabel}, baseadas exclusivamente no contexto.

CONTEXTO:
---
${context}
---

Responda APENAS com um JSON válido no seguinte formato (sem markdown, sem blocos de código, sem texto extra):

{
  "summary": "# Resumo\\n\\nConteúdo em markdown aqui...",
  "test": {
    "title": "Título do Teste",
    "description": "Breve descrição do tema",
    "format": "${params.format}",
    "complexity": "${params.complexity}",
    "questions": [
      ${params.format === 'multiple_choice' ? `{
        "type": "multiple_choice",
        "question": "Enunciado da questão?",
        "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
        "correct_answer": "Opção A",
        "explanation": "Explicação da resposta correta"
      }` : params.format === 'true_false' ? `{
        "type": "true_false",
        "question": "Afirmação para julgar.",
        "answer": true,
        "explanation": "Explicação"
      }` : params.format === 'open_ended' ? `{
        "type": "open_ended",
        "question": "Pergunta dissertativa?",
        "suggested_answer": "Resposta esperada"
      }` : `{
        "type": "multiple_choice",
        "question": "Questão de múltipla escolha?",
        "options": ["A", "B", "C", "D"],
        "correct_answer": "A",
        "explanation": "Explicação"
      }`}
    ]
  }
}`
}

/**
 * Calls the OpenAI API to generate test content from a given context.
 * @param {string} apiKey - OpenAI API key
 * @param {string} context - The educational context to process
 * @param {Object} params - Test parameters (numQuestions, format, complexity)
 * @returns {Promise<{summary: string, test: Object}>}
 */
export async function generateTestContent(apiKey, context, params) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
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
