import { useState } from 'react'

function App() {
  const [editor, setEditor] = useState('')
  const ipcRenderer = window.electron.ipcRenderer

  ipcRenderer.on('file-content', (event, data) => {
    setEditor(data)
  })

  const handleChange = (e) => {
    setEditor(e.target.value)
  }

  return (
    <>
      <div>
        <textarea
          className="min-h-dvh w-dvw bg-[#151520] text-white focus:outline-none resize-none"
          value={editor}
          onChange={handleChange}
        ></textarea>
      </div>
    </>
  )
}

export default App
