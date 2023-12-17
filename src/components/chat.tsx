import { useStore } from '../lib/state'
import dedent from 'dedent'
import { useChat, Message } from 'ai/react'
import { useEffect, useRef, useState } from 'react'
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

    const analysisChat = useChat({
        onFinish: (_message: Message) => setLoading(false)
    })

    useEffect(() => {
        if (analysisChat.messages.length > 0 && analysisChat.messages[analysisChat.messages.length - 1].role === 'assistant') {
            setProposedDocument(analysisChat.messages[analysisChat.messages.length - 1].content)
        }
    }, [analysisChat.messages]);


    const formRef = useRef(null)
    const [loading, setLoading] = useState<boolean>(false)

    const setProposedDocument = (document: string) => {
        dispatch({ type: 'setProposedDocument', document });
    }

    function analyzeChat(_response: Response) {
        let directives = ["You are a document creator and editor"]
        if (document) {
            directives.push("Your job is to continuously synthesize a user's ideas into a document")
            directives.push("Your top priority is to capture the ideas articulated by the user")
            directives.push("The following messages contain a conversation with a user and a working document draft")
            directives.push("Make _minor changes_ to the document to incorporate the user's most recent ideas")
        } else {
            directives.push("Create a short initial document, incorporating the user's thoughts")
        }

        directives = [...directives, ...[
            "Preserve tone of the user's written voice but fix minor mistakes and typos where applicable",
            "Write each sentence on a separate line to make it easier to see the difference between the old version and the modified version",
            "Write content from the perspective of the user",
            "Write the content in markdown",
            "Do not ask follow up questions",
            "Output the augmented document only",
        ]]

        const conversationMessages = [
            ...messages,
            {
                role: "user",
                content: input,
            },
        ]
        const analysisMessages: Message[] = [
            {
                id: "0",
                role: "system",
                content: directives.map(obj => `- ${obj}`).join('\n'),
            },
            {
                id: "1",
                role: "user",
                content: conversationMessages.slice(1).map(msg => `${msg.role}: ${msg.content}`).join('\n'),
            },
        ]
        if (document) {
            analysisMessages.push({
                id: "last",
                role: "user",
                content: `Here is the existing document:\n${document}`
            })
        }
        analysisChat.setMessages(analysisMessages)
        analysisChat.reload()
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
            <div className="flex flex-col justify-between h-full">
                <div className="overflow-y-auto mb-16">
                    {messageBlocks}
                </div>
                <div className="fixed bottom-0 mx-auto bg-gray-300 p-1 mt-6 md:w-full">
                    <div className="flex justify-between items-center w-full">
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
        </div>
    )
}
