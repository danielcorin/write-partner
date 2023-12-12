import { getState } from '../lib/state'
import { useState } from "react"
import { useChat, Message } from 'ai/react';


const BotMessageBlock = (message: Message, index: number) => (
    <div key={index} className="mx-auto bg-gray-200 p-1 md:w-full">
        <div className="flex flex-wrap items-start">
            <div className="p-1 w-full flex justify-between">
                <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">{message.role}</div>
                <div className="text-sm text-gray-500">{message.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div key={message.id} className="p-1 text-gray-600 w-full">
                {message.content}
            </div>
        </div>
    </div>
)

const UserMessageBlock = (message: Message, index: number) => (
    <div key={index} className="mx-auto bg-gray-100 p-1 md:w-full">
        <div className="flex flex-wrap items-start">
            <div className="p-1 w-full flex justify-between">
                <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">{message.role}</div>
                <div className="text-sm text-gray-500">{message.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div key={message.id} className="p-1 text-gray-600 w-full">
                {message.content}
            </div>
        </div>
    </div>
)

export default function Chat() {

    const [{ document }, dispatch] = getState()
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        initialMessages: [
            {
                id: "0",
                role: "system",
                content: "You are a thought partner to the user.\n\nYou will have a conversation with the user, asking thoughtful follow up questions about what they say. You will allow the user to steer the conversation in another direction if they choose.\n\nOnly provide feedback when asked. Focus on following up to help the user deepen the ideas they are exploring.",
            },
            {
                id: "1",
                role: "assistant",
                content: "What would you like to write about?",
            }
        ],
        onResponse: analyzeChat,
    })


    const setProposedDocument = (document: string) => {
        dispatch({ type: 'setProposedDocument', document });
    }

    function analyzeChat(response: Response) {
        console.log('Received:', response);
        console.log(messages)
        const analysisMessages = [
            {
                role: "system",
                content: "Given the following working document and conversation, make _minor_ changes augment and restructure the document to capture the user's most recent ideas from the conversation. The content should be written from the perspective of the user. Preserve tone of the user's written voice but fix minor mistakes and typos where applicable. Write each sentence on a separate line to make it easier to see the difference between the old version and the modified version. Do not use code fences. Output the augmented document only.",
            },
            {
                role: "user",
                content: input,
            },
        ]
        if (document) {
            analysisMessages.push({
                role: "user",
                content: `Here is the existing document:\n${document}`
            })
        }
        console.log(analysisMessages)
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: analysisMessages }),
        })
        .then(response => response.text())
        .then(text => {
            setProposedDocument(text)
        })
        .catch(error => {
            console.error('Error while fetching the response:', error);
        });
    }


    const messageBlocks = messages.map((message: Message, index: number) => {
        if (message.role === "user") {
            return UserMessageBlock(message, index)
        }
        else if (message.role === "assistant") {
            return BotMessageBlock(message, index)
        }
    }).filter(Boolean)

    return (
        <div>
            {messageBlocks}
            <div className="mx-auto bg-gray-300 p-1 md:w-full">
                <div className="flex justify-between items-center">
                    <form onSubmit={handleSubmit}>
                        <input
                            aria-label="Type your message here"
                            className="w-full px-3 py-2 text-gray-700 focus:outline-none bg-gray-300"
                            placeholder="Type your message here..."
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}
