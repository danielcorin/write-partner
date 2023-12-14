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
        let directives = ["You are a document editor"]
        if (document) {
            directives.push("The follow messages contain a working document and conversation with a user and conversation")
            directives.push("Make _minor_ changes augment and restructure the document to capture the user's most recent ideas from the conversation")
        } else {
            directives.push("Create an initial document, incorporating the user's thoughts")
        }

        directives = [...directives, ...[
            "Preserve tone of the user's written voice but fix minor mistakes and typos where applicable",
            "Write each sentence on a separate line to make it easier to see the difference between the old version and the modified version",
            "Write content from the perspective of the user",
            "Add markdown structure to the document as needed",
            "Output the augmented document only",
            "Do not ask follow up questions",
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
