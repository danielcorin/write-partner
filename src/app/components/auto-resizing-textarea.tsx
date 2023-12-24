import { useStore } from '@/lib/state';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react'

type AutoResizingTextareaProps = {
    formRef: React.RefObject<HTMLFormElement>;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    input: string;
    handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    loading: boolean;
}

const AutoResizingTextarea: React.FC<AutoResizingTextareaProps> = ({ formRef, handleSubmit, input, handleInputChange, loading }) => {
    const [{ proposingChanges }, _] = useStore()
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
            // Set the height to 'auto' to allow it to shrink if necessary
            textarea.style.height = 'auto'
            // Set the height to the scrollHeight to accommodate all content
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }, [input]) // Run the effect when the input value changes


    let placeholder = "Type your message here..."
    if (loading) {
        placeholder = ""
    }
    return (
        <div className="relative">
            <textarea
                aria-label="Type your message here..."
                ref={textareaRef}
                className="w-full px-3 py-2 text-gray-700 focus:outline-none bg-gray-300 overflow-hidden resize-none"
                placeholder={placeholder}
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && input.trim() === '') {
                        e.preventDefault()
                        return
                    }
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (formRef.current) {
                            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                        }
                    }
                }}
                disabled={loading || proposingChanges}
            />
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center">
                    <Loader2 className="h-4 w-4 animate-spin" />&nbsp;proposing updates
                </div>
            )}
        </div>
    )
}

export default AutoResizingTextarea
