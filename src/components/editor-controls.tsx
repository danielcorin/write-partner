import { Check, Copy, Download, History, ListTree, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useStore } from '@/lib/state'


const downloadStringAsFile = (content: string, contentType: string) => {
    const filename = `document-${new Date().getTime()}.md`
    // Create a Blob from the content
    const blob = new Blob([content], { type: contentType })
    const url = window.URL.createObjectURL(blob)

    // Create a link element
    const downloadLink = document.createElement('a')

    // Set the attributes and force triggering download
    downloadLink.href = url
    downloadLink.download = filename
    downloadLink.click() // Simulate click to start download

    // Clean up by revoking the Object URL
    window.URL.revokeObjectURL(url)
}

const copyToClipboard = async (text: string) => {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
    } else {
        console.error('Clipboard API not available.')
    }
}

const EditorControls: React.FC = () => {
    const [iconState, setIconState] = useState({
        copy: React.createElement(Copy),
        download: React.createElement(Download),
        history: React.createElement(History),
        listTree: React.createElement(ListTree),
    })
    const handleIconClick = async (iconKey: keyof typeof iconState) => {
        const curIcon = iconState[iconKey]
        if (iconKey === 'copy') {
            await copyToClipboard(document)
        } else if (iconKey === 'download') {
            downloadStringAsFile(document, 'text/markdown')
        } else {
            return
        }
        setIconState(prevState => ({
            ...prevState,
            [iconKey]: React.createElement(Check, { color: 'green' })
        }))
        setTimeout(() => {
            setIconState(prevState => ({
                ...prevState,
                [iconKey]: curIcon
            }))
        }, 1000)
    }

    const [{ document }, _] = useStore()
    return (
        <div className="flex justify-start gap-3 ml-3">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <div
                            className="cursor-pointer"
                            onClick={() => handleIconClick('download')}
                            onMouseOver={(e) => e.currentTarget.style.color = 'gray'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}
                        >
                            {iconState.download}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div>Download</div>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger>
                        <div
                            className="cursor-pointer"
                            onClick={() => handleIconClick('copy')}
                            onMouseOver={(e) => e.currentTarget.style.color = 'gray'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}
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
                            onClick={() => handleIconClick('history')}
                            onMouseOver={(e) => e.currentTarget.style.color = 'gray'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}
                        >
                            {iconState.history}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div>History</div>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger>
                        <div
                            className="cursor-pointer"
                            onClick={() => handleIconClick('listTree')}
                            onMouseOver={(e) => e.currentTarget.style.color = 'gray'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}
                        >
                            {iconState.listTree}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div>Add Structure</div>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger>
                        <Trash2
                            className="cursor-pointer"
                            onMouseOver={(e) => e.currentTarget.style.color = 'red'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <div>Delete</div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

export default EditorControls
