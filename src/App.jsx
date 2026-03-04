import { useState } from 'react'
import ContextInput from './components/ContextInput'
import TestParameters from './components/TestParameters'
import MarkdownPreview from './components/MarkdownPreview'
import JsonOutput from './components/JsonOutput'
import ApiKeyInput from './components/ApiKeyInput'
import { generateTestContent as generateOpenAI } from './services/openai'
import { generateTestContent as generateGemini } from './services/gemini'
import './App.css'

const DEFAULT_PARAMS = {
  numQuestions: 5,
  format: 'multiple_choice',
  complexity: 'medium',
}

function App() {
  const [provider, setProvider] = useState(() => localStorage.getItem('ai_provider') || 'openai')
  const [apiKeys, setApiKeys] = useState(() => ({
    openai: localStorage.getItem('openai_api_key') || '',
    gemini: localStorage.getItem('gemini_api_key') || '',
  }))
  const [context, setContext] = useState('')
  const [params, setParams] = useState(DEFAULT_PARAMS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [markdownSummary, setMarkdownSummary] = useState('')
  const [testJson, setTestJson] = useState(null)
  const [activeTab, setActiveTab] = useState('summary')

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider)
    localStorage.setItem('ai_provider', newProvider)
  }

  const handleApiKeyChange = (key) => {
    setApiKeys((prev) => ({ ...prev, [provider]: key }))
    localStorage.setItem(`${provider}_api_key`, key)
  }

  const handleGenerate = async () => {
    if (!context.trim()) {
      setError('Por favor, insira um contexto.')
      return
    }
    const currentKey = apiKeys[provider]
    if (!currentKey.trim()) {
      setError(`Por favor, insira sua chave de API do ${provider === 'openai' ? 'OpenAI' : 'Gemini'}.`)
      return
    }
    setError('')
    setLoading(true)
    setMarkdownSummary('')
    setTestJson(null)
    try {
      const generate = provider === 'gemini' ? generateGemini : generateOpenAI
      const result = await generate(currentKey, context, params)
      setMarkdownSummary(result.summary)
      setTestJson(result.test)
      setActiveTab('summary')
    } catch (err) {
      setError(err.message || 'Erro ao gerar conteúdo. Verifique sua chave de API.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎓 Gerador de Testes</h1>
        <p>Insira um contexto e gere um resumo com questões parametrizáveis</p>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <ApiKeyInput
            provider={provider}
            apiKey={apiKeys[provider]}
            onProviderChange={handleProviderChange}
            onApiKeyChange={handleApiKeyChange}
          />
          <ContextInput context={context} onChange={setContext} />
          <TestParameters params={params} onChange={setParams} />
          <button
            className="btn-generate"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? '⏳ Gerando...' : '✨ Gerar Teste'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="right-panel">
          {(markdownSummary || testJson) ? (
            <>
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('summary')}
                >
                  📄 Resumo
                </button>
                <button
                  className={`tab ${activeTab === 'json' ? 'active' : ''}`}
                  onClick={() => setActiveTab('json')}
                >
                  📋 JSON (Google Forms)
                </button>
              </div>
              {activeTab === 'summary' && (
                <MarkdownPreview content={markdownSummary} />
              )}
              {activeTab === 'json' && (
                <JsonOutput data={testJson} />
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <p>Insira um contexto e configure os parâmetros do teste para começar.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
