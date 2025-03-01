function App() {
  //sample ipc
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div>
        <p>Hello, World</p>
        <button className="bg-slate-600 py-4 px-8 rounded-lg text-white" onClick={ipcHandle}>
          Ping
        </button>
      </div>
    </>
  )
}

export default App
