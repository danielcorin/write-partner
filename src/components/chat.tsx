import { useStore } from '../lib/state'
import dedent from 'dedent'
import { useChat, Message } from 'ai/react'
import { useRef, useState } from 'react'
import AutoResizingTextarea from './auto-resizing-textarea'


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

    const [{ document }, dispatch] = useStore()
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        initialMessages: [
            {
                id: "0",
                role: "system",
                content: dedent(`- You are a thought partner to the user
                    - You will have a conversation with the user, asking thoughtful follow up questions about what they say.
                    - You will allow the user to steer the conversation in another direction if they choose
                    - Only provide feedback when asked
                    - Focus on following up to help the user deepen the ideas they are exploring`),
            },
            {
                id: "1",
                role: "assistant",
                content: "What would you like to write about?",
            }
        ],
        onResponse: analyzeChat,
    })

    const formRef = useRef(null)
    const [loading, setLoading] = useState<boolean>(false)

    const setProposedDocument = (document: string) => {
        dispatch({ type: 'setProposedDocument', document });
    }

    function analyzeChat(_response: Response) {
        const analysisMessages = [
            {
                role: "system",
                content: dedent(`- Given the working document provided by the user and conversation, make _minor_ changes augment and restructure the document to capture the user's most recent ideas from the conversation
                    - Preserve tone of the user's written voice but fix minor mistakes and typos where applicable
                    - Write each sentence on a separate line to make it easier to see the difference between the old version and the modified version
                    - Do not use code fences
                    - Output the augmented document only
                    - The content should be written from the perspective of the user
                    `),
            },
            ...messages.slice(1).map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
            {
                role: "user",
                content: input,
            },
            {
                role: "user",
                content: document ? `Here is the existing document:\n${document}` : "The document is currently empty"
            }
        ]
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: analysisMessages }),
        })
        .then(response => response.text())
        .then(text => {
            setLoading(false)
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
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <AutoResizingTextarea
                            formRef={formRef}
                            handleSubmit={(e) => {
                                setLoading(true)
                                handleSubmit(e)
                            }}
                            input={input}
                            handleInputChange={handleInputChange}
                            loading={loading}
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}
