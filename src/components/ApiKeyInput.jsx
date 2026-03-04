import './ApiKeyInput.css'

const PROVIDERS = [
  {
    id: 'openai',
    label: 'OpenAI',
    placeholder: 'sk-...',
    hint: 'Obter chave',
    hintUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    placeholder: 'AIza...',
    hint: 'Obter chave',
    hintUrl: 'https://aistudio.google.com/app/apikey',
  },
]

function ApiKeyInput({ provider, apiKey, onProviderChange, onApiKeyChange }) {
  const current = PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0]

  return (
    <div className="card">
      <h2>🔑 Chave de API</h2>
      <div className="provider-selector">
        {PROVIDERS.map((p) => (
          <label key={p.id} className={`provider-option ${provider === p.id ? 'selected' : ''}`}>
            <input
              type="radio"
              name="provider"
              value={p.id}
              checked={provider === p.id}
              onChange={() => onProviderChange(p.id)}
            />
            {p.label}
          </label>
        ))}
      </div>
      <input
        type="password"
        className="api-key-input"
        placeholder={current.placeholder}
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
        autoComplete="off"
      />
      <p className="api-key-hint">
        Sua chave é salva apenas no seu navegador.{' '}
        <a href={current.hintUrl} target="_blank" rel="noopener noreferrer">
          {current.hint}
        </a>
      </p>
    </div>
  )
}

export default ApiKeyInput
