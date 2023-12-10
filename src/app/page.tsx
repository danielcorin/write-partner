"use client"

import Markdown from "react-markdown"
import { MonacoDiffEditor } from 'react-monaco-editor'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import Chat from "@/components/chat";


const originalCode = `# Vision for a Text Sculpting Tool

## Introduction
I'm captivated by the idea of constructing documents in a non-traditional, more dynamic manner.
My aim is to conceptualize a tool that revolutionizes the way we create text, moving away from the conventional process of writing and refining sentences one by one.

## Concept Overview
Instead of the classic approach to writing, I envision a method akin to sculpting.
The tool I imagine would provide the capability to manipulate and form text in a way that is more organic and intuitive.
`;
const modifiedCode = `# Vision for a Text Sculpting Tool

## Introduction
I am interested in building a tool that allows me to construct a document in a non-linear, dynamic fashion.
My motivation stems from the struggle of traditional writing where I often find myself restructuring and refining as I go, which disrupts the flow of ideas.

## Concept Overview
I have always found that I communicate best in conversation, where ideas flow naturally and can be refined afterward.
This revelation leads me to envision a tool that empowers me to build a document as if I were sculpting text.
Through it, I can organically develop and refine my ideas, much as a sculptor works with clay, without being constrained by the linearity of traditional writing.

## The Sculpting Process
The process begins with a rough outline, a collection of thoughts and concepts that serve as the raw material for the document.
As these ideas are placed on the canvas, they can be shaped, connected, and rearranged through an intuitive interface that responds to the creator's touch.
This tactile approach to text manipulation allows for a more immersive and engaging writing experience, one that mirrors the fluidity of thought.

## Collaboration and Iteration
Moreover, the tool facilitates collaboration, enabling multiple sculptors to work on the same piece, each contributing their unique perspective and expertise.
Iterations become a natural part of the creation process, with changes and refinements happening in real-time, allowing the document to evolve organically.
`;


export default function Home() {
  return (
    <main style={{ height: '100vh' }}>
      <PanelGroup direction="horizontal">
        <Panel defaultSizePercentage={40} minSizePercentage={15} className="bg-gray-200">
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <MonacoDiffEditor
              width="100%"
              height="100%"
              language="markdown"
              original={originalCode}
              value={modifiedCode}
              options={{
                minimap: { enabled: false },
                scrollbar: {
                  verticalScrollbarSize: 5,
                  horizontalScrollbarSize: 5
                }
              }}
            />
          </div>
        </Panel>
        <PanelResizeHandle className="mx-1 w-1 bg-slate-300" />
        <Panel defaultSizePercentage={40} minSizePercentage={15} className="bg-gray-200">
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <Markdown className={`markdown`}>
              {modifiedCode}
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
