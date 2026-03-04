import './ContextInput.css'

function ContextInput({ context, onChange }) {
  return (
    <div className="card">
      <h2>📚 Contexto</h2>
      <textarea
        className="context-textarea"
        placeholder="Cole aqui o texto, artigo, capítulo de livro ou qualquer conteúdo que deseja transformar em teste..."
        value={context}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
      />
      <div className="context-info">
        {context.length > 0 && (
          <span>{context.length} caracteres · ~{Math.round(context.split(/\s+/).length)} palavras</span>
        )}
      </div>
    </div>
  )
}

export default ContextInput
