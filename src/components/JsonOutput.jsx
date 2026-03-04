import { useState } from 'react'
import './JsonOutput.css'

function JsonOutput({ data }) {
  const [copied, setCopied] = useState(false)

  const jsonString = JSON.stringify(data, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'teste.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="json-card">
      <div className="json-header">
        <span>📋 JSON para Google Forms</span>
        <div className="json-actions">
          <button className="btn-action" onClick={handleCopy}>
            {copied ? '✅ Copiado!' : '📋 Copiar'}
          </button>
          <button className="btn-action" onClick={handleDownload}>
            💾 Baixar JSON
          </button>
        </div>
      </div>

      {data && (
        <div className="json-questions">
          <div className="json-meta">
            <strong>{data.title}</strong>
            <span className="json-badge">{data.questions?.length} questões</span>
            <span className="json-badge">{data.complexity}</span>
          </div>
          <div className="questions-list">
            {data.questions?.map((q, i) => (
              <div key={i} className="question-item">
                <div className="question-number">Q{i + 1}</div>
                <div className="question-content">
                  <p className="question-text">{q.question}</p>
                  {q.options && (
                    <ul className="question-options">
                      {q.options.map((opt, j) => (
                        <li
                          key={j}
                          className={opt === q.correct_answer ? 'correct' : ''}
                        >
                          {opt === q.correct_answer ? '✅ ' : ''}{opt}
                        </li>
                      ))}
                    </ul>
                  )}
                  {q.answer !== undefined && (
                    <p className="question-answer">
                      Resposta: <strong>{q.answer ? 'Verdadeiro' : 'Falso'}</strong>
                    </p>
                  )}
                  {q.explanation && (
                    <p className="question-explanation">💡 {q.explanation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <details className="json-raw">
        <summary>Ver JSON bruto</summary>
        <pre className="json-pre">{jsonString}</pre>
      </details>
    </div>
  )
}

export default JsonOutput
