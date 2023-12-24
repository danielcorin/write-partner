"use client"

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import Chat from "@/app/components/chat";
import { useStore } from '../lib/state'
import DocumentEditor from "@/app/components/document-editor";
import { Editor } from "@/app/components/rich-text-input";


export default function Home() {
  return (
    <main className="h-screen">
      <PanelGroup direction="horizontal">
        <Panel defaultSizePercentage={37} minSizePercentage={15} className="bg-white">
          <DocumentEditor/>
        </Panel>
        <PanelResizeHandle className="mx-1 w-1 bg-slate-300" />
        <Panel defaultSizePercentage={43} minSizePercentage={15} className="bg-white">
          <div style={{ height: '100%', overflowY: 'auto' }}>
             <Editor/>
          </div>
        </Panel>
        <PanelResizeHandle className="mx-1 w-1 bg-slate-300" />
        <Panel defaultSizePercentage={20} minSizePercentage={15} className="bg-white">
          <div className="h-full overflow-y-auto">
            <Chat/>
          </div>
        </Panel>
      </PanelGroup>
    </main>
  )
}
