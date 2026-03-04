# Gerador de Testes 🎓

Aplicação React que, dado um contexto (texto, artigo, capítulo de livro), gera automaticamente um **resumo em Markdown** e um **teste parametrizável** com saída em **JSON** compatível com Google Forms.

## ✨ Funcionalidades

- **Entrada de contexto**: cole qualquer texto educacional
- **Resumo em Markdown**: conteúdo resumido com os principais conceitos a serem reforçados
- **Teste parametrizável**:
  - Número de questões (1–20)
  - Formato: Múltipla Escolha, Verdadeiro/Falso, Dissertativa ou Misto
  - Complexidade: Fácil, Médio ou Difícil
- **Saída em JSON**: estrutura compatível para geração de Google Forms ou outras ferramentas
- **Copiar / Baixar JSON**: facilidade para integração com scripts externos

## 🚀 Como usar

### Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- Chave de API do [OpenAI](https://platform.openai.com/api-keys)

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`.

### Build para produção

```bash
npm run build
npm run preview
```

## 📋 Formato do JSON gerado

```json
{
  "title": "Título do Teste",
  "description": "Breve descrição do tema",
  "format": "multiple_choice",
  "complexity": "medium",
  "questions": [
    {
      "type": "multiple_choice",
      "question": "Enunciado da questão?",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correct_answer": "Opção A",
      "explanation": "Explicação da resposta correta"
    }
  ]
}
```

Este JSON pode ser usado como entrada para um script que cria formulários no Google Forms via a [Google Forms API](https://developers.google.com/forms/api).

## 🛠️ Tecnologias

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [react-markdown](https://github.com/remarkjs/react-markdown) para renderização do resumo
- [OpenAI API](https://platform.openai.com/) (modelo `gpt-4o-mini`)
