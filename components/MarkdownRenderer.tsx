import React from 'react'
import Markdown from 'react-markdown'

export const MarkdownRenderer = ({ content }: { content: string }) => {
  return <Markdown>{content}</Markdown>
}
