import './ApiKeyInput.css'

function ApiKeyInput({ apiKey, onChange }) {
  return (
    <div className="card">
      <h2>🔑 Chave de API OpenAI</h2>
      <input
        type="password"
        className="api-key-input"
        placeholder="sk-..."
        value={apiKey}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      <p className="api-key-hint">
        Sua chave é salva apenas no seu navegador.{' '}
        <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
          Obter chave
        </a>
      </p>
    </div>
  )
}

export default ApiKeyInput
