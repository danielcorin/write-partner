"use client"

import Markdown from "react-markdown"
import { DiffEditor } from "@monaco-editor/react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import Chat from "@/components/chat";
import { getState } from '../lib/state'
import { useState } from "react";


export default function Home() {
  const [{ document }, documentDispatch] = getState()
  const [{ proposedDocument }, proposedDocumentDispatch] = getState()
  const [modifiedDocument, setModifiedDocument] = useState<string>(proposedDocument)
  const originalCode = document
  return (
    <main style={{ height: '100vh' }}>
      <PanelGroup direction="horizontal">
        <Panel defaultSizePercentage={40} minSizePercentage={15} className="bg-gray-200">
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <DiffEditor
              width="100%"
              height="100%"
              language="markdown"
              original={originalCode}
              modified={modifiedDocument}
              options={{
                renderSideBySide: false,
                wordWrap: "on",
                minimap: { enabled: false },
                scrollbar: {
                  verticalScrollbarSize: 7,
                  horizontalScrollbarSize: 7
                }
              }}
            />
          </div>
        </Panel>
        <PanelResizeHandle className="mx-1 w-1 bg-slate-300" />
        <Panel defaultSizePercentage={40} minSizePercentage={15} className="bg-gray-200">
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <Markdown className={`markdown`}>
              {modifiedDocument}
            </Markdown>
          </div>
        </Panel>
        <PanelResizeHandle className="mx-1 w-1 bg-slate-300" />
        <Panel defaultSizePercentage={20} minSizePercentage={15} className="bg-gray-200">
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <Chat/>
          </div>
        </Panel>
      </PanelGroup>
    </main>
  )
}
