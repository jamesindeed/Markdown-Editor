import React, { useState, useCallback } from 'react'
import './styles/app.css'
import Editor from './components/editor'
import Preview from './components/preview'

const App: React.FC = () => {
  const [doc, setDoc] = useState<string>('# Start Typing!\n')

  const handleDocChange = useCallback(newDoc => {
    setDoc(newDoc)
  }, [])

  return (
    <div className="app">
      <Editor onChange={handleDocChange} initialDoc={doc} />
      <Preview doc={doc} />
    </div>
  )
}
export default App
