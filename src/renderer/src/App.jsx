import { useEffect, useRef, useState } from 'react'
import { useCodeMirror, basicSetup } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { createTheme } from '@uiw/codemirror-themes'
import { tags as t } from '@lezer/highlight'
import { vim, Vim } from '@replit/codemirror-vim'
import { lineNumbersRelative } from '@uiw/codemirror-extensions-line-numbers-relative'
import { marked } from 'marked'
import { EditorView } from '@codemirror/view'
import {
  ReactDraw,
  circleTool,
  squareTool,
  selectTool,
  freeDrawTool,
  diamondTool,
  straightLineTool,
  textAreaTool,
  eraseTool,
  undoTool,
  redoTool,
  trashTool,
  duplicateTool,
  bringBackTool,
  bringForwardTool,
  ColorStyle,
  BackgroundStyle,
  LineWidthStyle,
  OpacityStyle,
  arrowTool,
  ClearAllButton,
  FontSizeStyle
} from '@jzohdi/react-draw'

function App() {
  const editorRef = useRef(null)
  const [isPreview, setIsPreview] = useState(true)
  const [isSketch, setIsSketch] = useState(true)
  const [isInitial, setIsInitial] = useState(true)

  const initialText = `# 📝 Scratch Pad – A No-Nonsense Notepad/Sketchpad with Vim & Markdown

Need a quick, **distraction-free** space to **jot down thoughts** or **tweak text**? Scratch Pad combines **Notepad’s simplicity** with **Vim’s power**—plus **Markdown support**!

## ✨ Features
- **Just type** – Open it and go. No setup, no fluff.
- **Vim Keybindings** – Navigate with \`hjkl\` like a pro.
- **Markdown Preview** – Hit \`Ctrl + E\` to toggle.
- **Sketch Mode** – Hit \`Ctrl + M\` to toggle between typing and drawing.

## 🚀 How to Use
1. **Start typing** – No need to configure anything.
2. **Use Markdown** for formatting (optional).
3. **Press \`Ctrl + E\`** to preview/edit.
4. **Press \`Ctrl + M\`** to type/draw.
5. **Exit like a pro?** \:q!\ (just kidding, you can close it normally).

> Scratch. Edit. Move on.
`

  const [text, setText] = useState(initialText)

  // const ipcRenderer = window.electron.ipcRenderer

  const markdownExtensions = [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    vim(),
    lineNumbersRelative,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        setText(update.state.doc.toString())
      }
    }),
    EditorView.lineWrapping
  ]

  const textExtensions = [lineNumbersRelative, EditorView.editable.of(false)]

  const [extensions, setExtensions] = useState(markdownExtensions)

  function togglePreview() {
    if (isInitial) {
      setIsInitial(false)
      setText('')
    }

    setIsPreview(!isPreview)
  }

  function toggleMode() {
    setIsSketch(!isSketch)
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

      if (event.ctrlKey && event.key === 'm') {
        event.preventDefault()
        toggleMode()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPreview, isSketch])

  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current)
    }
  }, [editorRef.current])

  useEffect(() => {
    if (Vim) {
      Vim.defineAction('toggle-preview', togglePreview)
      Vim.mapCommand('<C-e>', 'action', 'togglePreview', {})
      Vim.defineAction('toggle-mode', toggleMode)
      Vim.mapCommand('<C-m>', 'action', 'toggleMode', {})
    }
  }, [Vim])

  return (
    <div>
      {isSketch ? (
        <ReactDraw
          drawingTools={[
            selectTool,
            freeDrawTool,
            squareTool,
            circleTool,
            diamondTool,
            straightLineTool,
            textAreaTool,
            arrowTool,
            eraseTool
          ]}
          actionTools={[
            undoTool,
            redoTool,
            trashTool,
            duplicateTool,
            bringBackTool,
            bringForwardTool
          ]}
          shouldSelectAfterCreate={true}
          styleComponents={{
            color: { order: 3, component: ColorStyle },
            background: { order: 4, component: BackgroundStyle },
            lineWidth: { order: 1, component: LineWidthStyle },
            opacity: { order: 0, component: OpacityStyle },
            fontSize: { order: 2, component: FontSizeStyle }
          }}
          menuComponents={[ClearAllButton]}
          layout="fit"
        >
          <div className="h-dvh w-dvw bg-white"></div>
        </ReactDraw>
      ) : isPreview ? (
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
