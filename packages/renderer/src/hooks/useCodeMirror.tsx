import { useEffect, useState, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import { history, historyKeymap } from '@codemirror/history'
import { indentOnInput } from '@codemirror/language'
import { bracketMatching } from '@codemirror/matchbrackets'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter'
import {
  defaultHighlightStyle,
  HighlightStyle,
  tags
} from '@codemirror/highlight'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { oneDark } from '@codemirror/theme-one-dark'
import { nord } from 'cm6-theme-nord'

export const transparentTheme = EditorView.theme({
  '&': {
    backgroundColor: 'transparent !important',
    height: '100%'
  }
})

export const nordTheme = EditorView.theme(
  {
    '&': {
      color: '#e0def4',
      backgroundColor: '#1f1d2e'
    },

    '.cm-content': {
      caretColor: '#f6c177'
    },

    '&.cm-focused .cm-cursor': { borderLeftColor: '#e0def4' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      { backgroundColor: '#f6c177' },

    '.cm-panels': { backgroundColor: '#9ccfd8', color: '#f6c177' },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },

    '.cm-searchMatch': {
      backgroundColor: '#ebbcba',
      outline: '1px solid #eb6f92'
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: '#6199ff2f'
    },

    '.cm-activeLine': { backgroundColor: '#2c313a' },
    '.cm-selectionMatch': { backgroundColor: '#eb6f92' },

    '.cm-matchingBracket, .cm-nonmatchingBracket': {
      backgroundColor: '#bad0f847',
      outline: '1px solid #515a6b'
    },

    '.cm-gutters': {
      backgroundColor: '#1f1d2e',
      color: '#e0def4',
      border: 'none'
    },

    '.cm-activeLineGutter': {
      backgroundColor: '#eb6f92'
    },

    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ddd'
    },

    '.cm-tooltip': {
      border: '1px solid #181a1f',
      backgroundColor: '#2e3440'
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: '#2c313a',
        color: '#d8dee9'
      }
    }
  },
  { dark: true }
)

const syntaxHighlighting = HighlightStyle.define([
  {
    tag: tags.heading1,
    fontSize: '1.4em',
    fontWeight: 'bold'
  },
  {
    tag: tags.heading2,
    fontSize: '1.2em',
    fontWeight: 'bold'
  },
  {
    tag: tags.heading3,
    fontSize: '1em',
    fontWeight: 'bold'
  }
])

import type React from 'react'

interface Props {
  initialDoc: string
  onChange?: (state: EditorState) => void
}

const useCodeMirror = <T extends Element>(
  props: Props
): [React.MutableRefObject<T | null>, EditorView?] => {
  const refContainer = useRef<T>(null)
  const [editorView, setEditorView] = useState<EditorView>()
  const { onChange } = props

  useEffect(() => {
    if (!refContainer.current) return

    const startState = EditorState.create({
      doc: props.initialDoc,
      extensions: [
        keymap.of([...defaultKeymap, ...historyKeymap]),
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        bracketMatching(),
        defaultHighlightStyle.fallback,
        highlightActiveLine(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          addKeymap: true
        }),
        nordTheme,
        nord,
        oneDark,
        transparentTheme,
        syntaxHighlighting,
        EditorView.lineWrapping,
        EditorView.updateListener.of(update => {
          if (update.changes) {
            onChange && onChange(update.state)
          }
        })
      ]
    })

    const view = new EditorView({
      state: startState,
      parent: refContainer.current
    })
    setEditorView(view)
  }, [refContainer])

  return [refContainer, editorView]
}

export default useCodeMirror
