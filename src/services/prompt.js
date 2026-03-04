/**
 * Builds the prompt for generating test content.
 */
export function buildPrompt(context, params) {
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
