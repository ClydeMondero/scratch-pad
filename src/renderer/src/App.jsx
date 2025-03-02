import { useEffect, useMemo, useRef } from 'react'
import { useCodeMirror } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { createTheme } from '@uiw/codemirror-themes'
import { tags as t } from '@lezer/highlight'
import { vim } from '@replit/codemirror-vim'
import { lineNumbersRelative } from '@uiw/codemirror-extensions-line-numbers-relative'

const extensions = [
  markdown({ base: markdownLanguage, codeLanguages: languages }),
  vim(),
  lineNumbersRelative
]

const myCatppuccinTheme = createTheme({
  theme: 'dark', // Catppuccin is typically a dark theme
  settings: {
    background: '#1e1e2e', // Base
    backgroundImage: '',
    foreground: '#CAD3F5', // Text
    caret: '#F4DBD6', // Rosewater
    selection: '#F4DBD633', // Transparent Rosewater
    selectionMatch: '#F4DBD633',
    lineHighlight: '#2a2d3b', // Overlay0
    gutterBackground: '#1e1e2e', // Base
    gutterForeground: '#A5ADCB' // Subtext1
  },
  styles: []
})

function App() {
  const editorRef = useRef(null)
  const ipcRenderer = window.electron.ipcRenderer

  const { setContainer } = useCodeMirror({
    container: editorRef.current,
    extensions,
    value: '',
    theme: myCatppuccinTheme
  })

  useEffect(() => {
    // ipcRenderer.on('file-content', (event, data) => {
    //   if (editorRef.current) {
    //     editorRef.current.value = data
    //   }
    // })
    // ipcRenderer.once('request-editor-content', () => {
    //   if (editorRef.current) {
    //     ipcRenderer.send('response-editor-content', editorRef.current.value)
    //   }
    // })
    // return () => {
    //   ipcRenderer.removeAllListeners('file-content')
    // }
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current)
    }
  }, [editorRef.current])

  return (
    <div>
      <div
        className="text-lg"
        ref={editorRef} // Assign ref instead of state
        // className="min-h-dvh w-dvw bg-[#151520] text-white focus:outline-none resize-none"
      ></div>
    </div>
  )
}

export default App
