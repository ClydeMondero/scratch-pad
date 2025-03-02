import { useState } from 'react'

function App() {
  const [editor, setEditor] = useState('')

  window.electron.ipcRenderer.on('file-content', (event, data) => {
    setEditor(data)
  })

  const handleChange = (e) => {
    setEditor(e.target.value)
  }

  return (
    <>
      <div className="flex gap-2">
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
