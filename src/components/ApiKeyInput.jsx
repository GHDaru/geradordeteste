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

export const GEMINI_MODELS = [
  { id: 'gemini-3-flash', label: 'Gemini 3 Flash', rpm: 5, tpm: '250K', rpd: 20 },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite', rpm: 10, tpm: '250K', rpd: 20 },
  { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite', rpm: 15, tpm: '250K', rpd: 500 },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', rpm: 5, tpm: '250K', rpd: 20 },
]

export const OPENAI_MODELS = [
  { id: 'gpt-4o', label: 'GPT-4o', description: 'Mais capaz, multimodal' },
  { id: 'gpt-4o-mini', label: 'GPT-4o mini', description: 'Custo-benefício, rápido' },
  { id: 'gpt-4.1', label: 'GPT-4.1', description: 'Último modelo da série GPT-4' },
  { id: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Alto desempenho, contexto amplo' },
]

function ApiKeyInput({ provider, apiKey, model, onProviderChange, onApiKeyChange, onModelChange }) {
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

      {provider === 'gemini' && (
        <div className="model-selector">
          <label className="model-selector-label">Modelo Gemini</label>
          <table className="model-table">
            <thead>
              <tr>
                <th></th>
                <th>Modelo</th>
                <th>RPM</th>
                <th>TPM</th>
                <th>RPD</th>
              </tr>
            </thead>
            <tbody>
              {GEMINI_MODELS.map((m) => (
                <tr
                  key={m.id}
                  className={`model-row ${model === m.id ? 'selected' : ''}`}
                  onClick={() => onModelChange(m.id)}
                >
                  <td>
                    <input
                      type="radio"
                      name="gemini-model"
                      value={m.id}
                      checked={model === m.id}
                      onChange={() => onModelChange(m.id)}
                    />
                  </td>
                  <td className="model-name">{m.label}</td>
                  <td>{m.rpm}</td>
                  <td>{m.tpm}</td>
                  <td>{m.rpd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {provider === 'openai' && (
        <div className="model-selector">
          <label className="model-selector-label">Modelo GPT</label>
          <div className="openai-model-list">
            {OPENAI_MODELS.map((m) => (
              <label key={m.id} className={`openai-model-option ${model === m.id ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="openai-model"
                  value={m.id}
                  checked={model === m.id}
                  onChange={() => onModelChange(m.id)}
                />
                <span className="openai-model-name">{m.label}</span>
                <span className="openai-model-desc">{m.description}</span>
              </label>
            ))}
          </div>
        </div>
      )}

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
