import { useEffect, useRef, useState } from 'react'
import { useCodeMirror, basicSetup } from '@uiw/react-codemirror'
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
  const [isPreview, setIsPreview] = useState(true)
  const [isInitial, setIsInitial] = useState(true)

  const initialText = `# 📝 Scratch Pad – A No-Nonsense Notepad with Vim & Markdown

Ever needed a quick place to **jot down thoughts**, **fix up text**, or **edit markdown**?
Scratch Pad is your **lightweight, no-frills** text editor, blending the **simplicity of Notepad** with the **power of Vim**.

## ✨ Features
- ✅ **Fast & Minimal** – Just open it and start typing. No clutter. No distractions.
- ✅ **Vim Keybindings** – Because real editing starts with \`hjkl\`.
- ✅ **Markdown Preview** – Hit \`Ctrl + E\` to toggle preview mode.
- ✅ **Autosave? Nah.** – It's a scratch pad. You control when and what to save.
- ✅ **Dark Mode?** Of course.

## 🚀 How to Use
1. **Type freely** – Treat it like Notepad, but better.
2. **Need formatting?** Write in Markdown.
3. **Toggle between Preview mode and Edit Mode?** Press \`Ctrl + E\`.
4. **Exit like a pro?** \`:q!\` (just kidding, you can close it normally).

> Give it a spin and start editing like a boss! 🔥
`

  const [text, setText] = useState(initialText)

  // const ipcRenderer = window.electron.ipcRenderer

  const markdownExtensions = [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    vim(),
    lineNumbersRelative,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        setIsInitial(false)
        setText(update.state.doc.toString())
      }
    }),
    EditorView.lineWrapping
  ]

  const textExtensions = [lineNumbersRelative, EditorView.editable.of(false)]

  const [extensions, setExtensions] = useState(markdownExtensions)

  function togglePreview() {
    if (isInitial) {
      setText('')
    }

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
          className="text-lg text-white py-1 px-10"
          dangerouslySetInnerHTML={{ __html: marked(text) }}
        ></div>
      ) : (
        <div
          className={`text-lg `}
          ref={editorRef} // Assign ref instead of state
        ></div>
      )}
    </div>
  )
}

export default App
