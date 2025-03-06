import { useEffect, useRef, useState } from 'react'
import { useCodeMirror } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { createTheme } from '@uiw/codemirror-themes'
import { tags as t } from '@lezer/highlight'
import { vim } from '@replit/codemirror-vim'
import { lineNumbersRelative } from '@uiw/codemirror-extensions-line-numbers-relative'
import { marked } from 'marked'
import { EditorView } from '@codemirror/view'

function App() {
  const editorRef = useRef(null)
  const [isPreview, setIsPreview] = useState(false)
  const [text, setText] = useState('')

  // const ipcRenderer = window.electron.ipcRenderer

  const markdownExtensions = [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    vim(),
    lineNumbersRelative,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        setText(update.state.doc.toString())
      }
    })
  ]

  const textExtensions = [lineNumbersRelative, EditorView.editable.of(false)]

  const [extensions, setExtensions] = useState(markdownExtensions)

  function togglePreview() {
    setIsPreview(!isPreview)
  }

  const myCatppuccinTheme = createTheme({
    theme: 'dark', // Catppuccin is typically a dark theme
    settings: {
      background: '#1e1e2e', // Base
      backgroundImage: '',
      foreground: '#CAD3F5', // Text
      caret: '#F4DBD6', // Rosewater
      selection: '#F4DBD633', // Transparent Rosewater
      selectionMatch: '#F4DBD633',
      lineHighlight: '#232333', // Overlay0
      gutterBackground: '#1e1e2e', // Base
      gutterForeground: '#A5ADCB' // Subtext1
    },
    styles: []
  })

  const { setContainer, view } = useCodeMirror({
    container: editorRef.current,
    extensions: extensions,
    value: text,
    theme: myCatppuccinTheme
  })

  useEffect(() => {
    if (isPreview) {
      setExtensions(textExtensions)
    } else {
      setExtensions(markdownExtensions)
    }

    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'e') {
        event.preventDefault()
        togglePreview()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPreview])

  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current)
    }
  }, [editorRef.current])

  return (
    <div>
      {isPreview ? (
        <div
          className="text-lg text-white p-4"
          dangerouslySetInnerHTML={{ __html: marked(text) }}
        ></div>
      ) : (
        <div
          className="text-lg"
          ref={editorRef} // Assign ref instead of state
        ></div>
      )}
    </div>
  )
}

export default App
