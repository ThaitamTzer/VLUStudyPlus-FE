'use client'

import React, { useEffect, useRef } from 'react'

import JoditEditor from 'jodit-react'

interface MyProps {
  config?: any
  defaultValue?: string
  onChange?: (content: string) => void
}

export default function MyJoditEditor({ config, defaultValue, onChange }: MyProps) {
  const editor = useRef<any>(null)
  const defaultValueSet = useRef<boolean>(false)

  useEffect(() => {
    if (defaultValue && editor.current && !defaultValueSet.current) {
      editor.current.value = defaultValue
      defaultValueSet.current = true
    }
  }, [defaultValue])

  return <JoditEditor ref={editor} config={{ ...config, readonly: false }} onChange={onChange} />
}
