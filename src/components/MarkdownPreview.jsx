import ReactMarkdown from 'react-markdown'
import './MarkdownPreview.css'

function MarkdownPreview({ content }) {
  return (
    <div className="markdown-card">
      <div className="markdown-header">
        <span>📄 Resumo do Conteúdo</span>
      </div>
      <div className="markdown-body">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}

export default MarkdownPreview
