"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Conversation {
  userId: string
  userName: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
}

interface Message {
  _id: string
  senderId: string
  recipientId: string
  content: string
  read: boolean
  createdAt: string
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedUserId = searchParams.get("userId")

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchConversations()
    }
  }, [status, router])

  useEffect(() => {
    if (selectedUserId && conversations.length > 0) {
      const user = conversations.find((c) => c.userId === selectedUserId)
      if (user) {
        selectConversation(user)
      }
    }
  }, [selectedUserId, conversations])

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/messages/conversations")
      const data = await response.json()
      setConversations(data)
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectConversation = async (conversation: Conversation) => {
    setSelectedUser(conversation)
    try {
      const response = await fetch(`/api/messages/${conversation.userId}`)
      const data = await response.json()
      setMessages(data)
      setMessageInput("")
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !selectedUser) return

    setSending(true)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: selectedUser.userId,
          content: messageInput,
        }),
      })

      if (response.ok) {
        const newMessage = await response.json()
        setMessages([...messages, newMessage])
        setMessageInput("")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading messages...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Travel Buddy</h1>
          <nav className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <Link href="/trips">
              <Button variant="ghost">Trips</Button>
            </Link>
            <Link href="/matches">
              <Button variant="ghost">Matches</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="border border-border rounded-lg overflow-hidden flex flex-col">
            <div className="bg-card/50 border-b border-border p-4">
              <h2 className="font-semibold">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <p>No conversations yet</p>
                  <Link href="/matches" className="text-primary hover:underline text-sm mt-2 inline-block">
                    Find travel buddies
                  </Link>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.userId}
                    onClick={() => selectConversation(conversation)}
                    className={`w-full text-left p-4 border-b border-border hover:bg-muted transition-colors ${
                      selectedUser?.userId === conversation.userId ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{conversation.userName}</p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 border border-border rounded-lg overflow-hidden flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="bg-card/50 border-b border-border p-4">
                  <h3 className="font-semibold">{selectedUser.userName}</h3>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.senderId === session?.user?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.senderId === session?.user?.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <p className="">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="border-t border-border p-4 flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={sending}
                  />
                  <Button type="submit" disabled={sending || !messageInput.trim()}>
                    {sending ? "Sending..." : "Send"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
