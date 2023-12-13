"use client"

import Markdown from "react-markdown"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import Chat from "@/components/chat";
import { useStore } from '../lib/state'
import DocumentEditor from "@/components/document-editor";


export default function Home() {
  const [{ proposedDocument, document }, _] = useStore()

  return (
    <main style={{ height: '100vh' }}>
      <PanelGroup direction="horizontal">
        <Panel defaultSizePercentage={40} minSizePercentage={15} className="bg-gray-200">
          <DocumentEditor proposingChanges={proposedDocument !== ""}/>
        </Panel>
        <PanelResizeHandle className="mx-1 w-1 bg-slate-300" />
        <Panel defaultSizePercentage={40} minSizePercentage={15} className="bg-gray-200">
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <Markdown className={`markdown`}>
              {proposedDocument || document}
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
