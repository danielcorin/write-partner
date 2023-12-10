"use client"

import { Button, ChatList, IChatItemProps, Input } from "react-chat-elements";
import Markdown from "react-markdown"
import { MonacoDiffEditor } from 'react-monaco-editor'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import 'react-chat-elements/dist/main.css'
import { createRef, useState } from "react";


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
`;



export default function Home() {
  const inputReference = createRef<HTMLInputElement>();
  const [messages, setMessages] = useState<IChatItemProps[]>([
    {
      id: 1, // Added id property to satisfy IChatItemProps
      avatar: 'https://via.placeholder.com/40',
      alt: 'Reactjs',
      title: 'Chat',
      subtitle: '',
      date: new Date(),
      unread: 0,
    },
  ]);

  const submitMessage = () => {
    console.log("submit")
    const inputValue = inputReference.current?.value || '';
    if (inputReference.current) {
      inputReference.current.value = '';
    }
    console.log(inputValue)
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        avatar: 'https://via.placeholder.com/40',
        alt: 'Reactjs',
        title: 'User',
        subtitle: inputValue,
        date: new Date(),
        unread: 0,
        style: {
          '--rce-citem-body-bottom-title-white-space': 'normal',
          '--rce-citem-body-bottom-title-overflow': 'visible',
          '--rce-citem-body-bottom-title-text-overflow': 'clip',
        }
      };
      setMessages([...messages, newMessage]);
    }
  };

  return (
    <main style={{ height: '100vh' }}>
      <PanelGroup direction="horizontal">
        <Panel defaultSizePercentage={40} minSizePercentage={15}>
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
        </Panel>
        <PanelResizeHandle className="mx-1 w-1 bg-slate-300" />
        <Panel defaultSizePercentage={40} minSizePercentage={15}>
          <div style={{ overflow: 'auto' }}>
            <Markdown className={`markdown`}>
              {modifiedCode}
            </Markdown>
          </div>
        </Panel>
        <PanelResizeHandle className="mx-1 w-1 bg-slate-300" />
        <Panel defaultSizePercentage={20} minSizePercentage={15}>
          <div style={{ overflow: 'auto' }}>
            <ChatList
              className='chat-list'
              id="chat-list-1"
              lazyLoadingImage="https://via.placeholder.com/40"
              dataSource={messages}
            />
            <Input
              referance={inputReference}
              placeholder='What do you think?'
              multiline={true}
              maxHeight={200}
              minHeight={40}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submitMessage()
                }
              }}
              rightButtons={
                <Button
                  color='white'
                  backgroundColor='black'
                  text='Send'
                  onClick={() => {
                    submitMessage()
                  }}
                />
              }
            />
          </div>
        </Panel>
      </PanelGroup>
    </main>
  )
}
