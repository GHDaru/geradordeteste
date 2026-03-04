import './TestParameters.css'

const FORMAT_OPTIONS = [
  { value: 'multiple_choice', label: '🔵 Múltipla Escolha' },
  { value: 'true_false', label: '✅ Verdadeiro/Falso' },
  { value: 'open_ended', label: '✏️ Dissertativa' },
  { value: 'mixed', label: '🎲 Misto' },
]

const COMPLEXITY_OPTIONS = [
  { value: 'easy', label: '🟢 Fácil' },
  { value: 'medium', label: '🟡 Médio' },
  { value: 'hard', label: '🔴 Difícil' },
]

function TestParameters({ params, onChange }) {
  const update = (key, value) => onChange({ ...params, [key]: value })

  return (
    <div className="card">
      <h2>⚙️ Parâmetros do Teste</h2>

      <div className="param-group">
        <label className="param-label">
          Número de questões: <strong>{params.numQuestions}</strong>
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={params.numQuestions}
          onChange={(e) => update('numQuestions', Number(e.target.value))}
          className="param-slider"
        />
        <div className="slider-hints">
          <span>1</span>
          <span>10</span>
          <span>20</span>
        </div>
      </div>

      <div className="param-group">
        <label className="param-label">Formato</label>
        <div className="param-options">
          {FORMAT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`param-option ${params.format === opt.value ? 'selected' : ''}`}
              onClick={() => update('format', opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="param-group">
        <label className="param-label">Complexidade</label>
        <div className="param-options">
          {COMPLEXITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`param-option ${params.complexity === opt.value ? 'selected' : ''}`}
              onClick={() => update('complexity', opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestParameters
