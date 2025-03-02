import { useEffect, useRef } from 'react'

function App() {
  const editorRef = useRef(null)
  const ipcRenderer = window.electron.ipcRenderer

  useEffect(() => {
    ipcRenderer.on('file-content', (event, data) => {
      if (editorRef.current) {
        editorRef.current.value = data
      }
    })

    ipcRenderer.once('request-editor-content', () => {
      if (editorRef.current) {
        ipcRenderer.send('response-editor-content', editorRef.current.value)
      }
    })

    return () => {
      ipcRenderer.removeAllListeners('file-content')
    }
  }, [])

  return (
    <div>
      <textarea
        ref={editorRef} // Assign ref instead of state
        className="min-h-dvh w-dvw bg-[#151520] text-white focus:outline-none resize-none"
      ></textarea>
    </div>
  )
}

export default App
