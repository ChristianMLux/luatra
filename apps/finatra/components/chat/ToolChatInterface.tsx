"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, Button, Input, ScrollArea } from "@repo/ui"
import { useAuth } from "@repo/core"
import { mockChatStream } from "@/lib/api"
import { v4 as uuidv4 } from 'uuid'
import { MessageSquarePlus, Send, Sparkles } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import clsx from "clsx"

import { DynamicChart, ChartData } from "../charts/DynamicChart"

// Placeholder for DynamicChart until ported (Removed)


type Message = {
    role: 'user' | 'agent'
    content: string
    component?: {
        type: string
        data: unknown
    }
}

interface ToolChatInterfaceProps {
    initialPrompt?: string;
}

export function ToolChatInterface({ initialPrompt }: ToolChatInterfaceProps) {
    const [chatId, setChatId] = useState(() => uuidv4())
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [statusLog, setStatusLog] = useState<string>("")
    const { user } = useAuth()
    const hasInitialTriggered = useRef(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, statusLog])

    const handleNewChat = () => {
        const newId = uuidv4()
        setChatId(newId)
        setMessages([])
        setStatusLog("")
    }

    const handleSend = useCallback(async (e?: React.FormEvent, overrideInput?: string) => {
        if (e) e.preventDefault()
        const messageToSend = overrideInput || input
        if (!messageToSend.trim()) return

        // Add user message immediately
        const userMsg: Message = { role: 'user', content: messageToSend }
        setMessages(prev => [...prev, userMsg])
        
        setInput("")
        setLoading(true)
        setStatusLog("Thinking...")

        try {
            // Streaming simulation
            let fullResponse = ""
            await mockChatStream(messageToSend, chatId, (chunk) => {
                try {
                    const data = JSON.parse(chunk)
                    if (data.type === 'log') {
                        setStatusLog(data.content)
                    }
                } catch (e) {
                    // Not a log object, treat as content
                    fullResponse += chunk
                    // Update the last message if it's from agent, or create new one
                    setMessages(prev => {
                        const last = prev[prev.length - 1]
                        if (last && last.role === 'agent') {
                           return [...prev.slice(0, -1), { ...last, content: fullResponse }]
                        } else {
                           return [...prev, { role: 'agent', content: fullResponse }]
                        }
                    })
                }
            })

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setStatusLog("") 
        }
    }, [input, chatId])

    return (
        <Card className="h-[600px] flex flex-col border-none shadow-none bg-transparent">
             <div className="px-4 py-2 border-b border-border/40 flex justify-between items-center bg-muted/20 rounded-t-lg">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-primary" />
                    Finatra AI
                </span>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleNewChat}
                    className="h-6 text-xs text-muted-foreground hover:text-primary"
                >
                    <MessageSquarePlus className="w-3 h-3 mr-1" />
                    Reset
                </Button>
            </div>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative bg-background/50 backdrop-blur-sm">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4 pb-4">
                        {messages.length === 0 && (
                             <div className="flex flex-col items-center justify-center h-48 text-muted-foreground space-y-4 opacity-50">
                                <Sparkles className="w-12 h-12" />
                                <p className="text-sm">Ask me about your finances...</p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={clsx(
                                "flex w-full",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}>
                                <div className={clsx(
                                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                    msg.role === 'user' 
                                    ? "bg-primary text-primary-foreground rounded-br-none" 
                                    : "bg-muted text-foreground rounded-bl-none"
                                )}>
                                    {msg.role === 'agent' ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.content
                                    )}
                                    
                                    {msg.component && (
                                        <div className="mt-4 pt-4 border-t border-border/50">
                                             <DynamicChart data={msg.component.data as ChartData} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="bg-muted/50 rounded-2xl px-4 py-2 text-xs text-muted-foreground rounded-bl-none flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                    {statusLog || "Thinking..."}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-background/95 backdrop-blur">
                    <form onSubmit={(e) => handleSend(e)} className="relative flex items-center gap-2">
                        <Input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            placeholder="Ask a question..." 
                            disabled={loading}
                            className="pr-12 rounded-full"
                        />
                        <Button 
                            type="submit" 
                            disabled={loading || !input.trim()} 
                            size="icon" 
                            className="absolute right-1 w-8 h-8 rounded-full"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    )
}
