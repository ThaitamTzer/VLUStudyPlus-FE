'use client'
import { forwardRef } from 'react'

import dynamic from 'next/dynamic'

import type { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor'

// Dynamic import để tắt SSR cho MDXEditor
const Editor = dynamic(() => import('@/components/InitializedMDXEditor'), { ssr: false })

export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => (
  <Editor {...props} editorRef={ref} />
))
ForwardRefEditor.displayName = 'ForwardRefEditor'
