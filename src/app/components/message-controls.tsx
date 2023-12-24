import { Check, Copy, MinusCircle } from 'lucide-react'
import React, { useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/app/components/ui/tooltip"
import { Message } from 'ai/react'


const copyToClipboard = async (text: string) => {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
    } else {
        console.error('Clipboard API not available.')
    }
}

interface MessageControlsProps {
    message: Message;
    removeMessage: () => void;
}

const MessageControls: React.FC<MessageControlsProps> = ({ message, removeMessage }: MessageControlsProps) => {
    const [iconState, setIconState] = useState({
        copy: React.createElement(Copy, { size: 12 }),
        delete: React.createElement(MinusCircle, { size: 12 }),
    })
    const handleIconClick = async (iconKey: keyof typeof iconState) => {
        const curIcon = iconState[iconKey]
        if (iconKey === 'copy') {
            await copyToClipboard(message.content)
        } else if (iconKey === 'delete') {
            removeMessage()
            return
        } else {
            return
        }
        setIconState(prevState => ({
            ...prevState,
            [iconKey]: React.createElement(Check, { color: 'green', size: 12 })
        }))
        setTimeout(() => {
            setIconState(prevState => ({
                ...prevState,
                [iconKey]: curIcon
            }))
        }, 1000)
    }

    return (
        <div className="flex space-x-1 text-gray-500">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <div
                            className="cursor-pointer"
                            onClick={() => handleIconClick('copy')}
                        >
                            {iconState.copy}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div>Copy</div>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger>
                        <div
                            className="cursor-pointer"
                            onClick={() => handleIconClick('delete')}
                        >
                            {iconState.delete}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div>Delete</div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

export default MessageControls
