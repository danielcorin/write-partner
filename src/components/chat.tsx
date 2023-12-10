import { Message } from "@/types/message"
import { getState } from '../lib/state'
import { useState } from "react"


const BotMessageBlock = (message: Message) => (
    <div className="mx-auto bg-gray-200 p-1 md:w-full">
        <div className="flex flex-wrap items-start">
            <div className="p-1 w-full flex justify-between">
                <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">{message.username}</div>
                <div className="text-sm text-gray-500">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <p className="p-1 text-gray-600 w-full">
                <span title={message.timestamp.toLocaleString()}>{message.text}</span>
            </p>
        </div>
    </div>
)

const UserMessageBlock = (message: Message) => (
    <div className="mx-auto bg-gray-100 p-1 md:w-full">
        <div className="flex flex-wrap items-start">
            <div className="p-1 w-full flex justify-between">
                <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">{message.username}</div>
                <div className="text-sm text-gray-500">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <p className="p-1 text-gray-600 w-full">
                <span title={message.timestamp.toLocaleString()}>{message.text}</span>
            </p>
        </div>
    </div>
)

export default function Chat() {
    const [{ messages }, dispatch] = getState()
    const [inputValue, setInputValue] = useState('')

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
    };

    const updateMessages = (messages: Message[]) => {
        dispatch({ type: 'setMessages', messages: messages })
    }

    const submitMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (inputValue.trim()) {
            const newMessage: Message = {
                id: messages.length > 0 ? messages[messages.length - 1].id + 1 : 0,
                username: "user",
                text: inputValue,
                timestamp: new Date(),
            }
            updateMessages([...messages, newMessage])
            setInputValue('')
        }
    }

    const messageBlocks = messages.map((message: Message) =>
        message.username === "bot" ? BotMessageBlock(message) : UserMessageBlock(message)
    )

    return (
        <div>
            {messageBlocks}
            <div className="mx-auto bg-gray-300 p-1 md:w-full">
                <div className="flex justify-between items-center">
                    <input
                        aria-label="Type your message here"
                        className="w-full px-3 py-2 text-gray-700 focus:outline-none bg-gray-300"
                        placeholder="Type your message here..."
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') submitMessage(event as unknown as React.FormEvent<HTMLFormElement>)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
