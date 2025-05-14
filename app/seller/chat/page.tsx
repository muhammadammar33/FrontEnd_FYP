"use client";
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { FiSend, FiSearch, FiMoreVertical } from 'react-icons/fi';
import { BiArrowBack } from 'react-icons/bi';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
// Types
interface User {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

interface Message {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
    conversationId: string;
    sender?: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

interface Conversation {
    id: string;
    participants: ConversationParticipant[];
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}

interface ConversationParticipant {
    user: User;
    userId: string;
    conversationId: string;
}

export default function Chat() {
    // State
    const { data: session } = useSession();
    const user = session?.user;
    const [socket, setSocket] = useState<Socket | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [showSearch, setShowSearch] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [typing, setTyping] = useState<{ userId: string, conversationId: string } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Use authenticated user from session
    useEffect(() => {
        if (user) {
            setCurrentUser({
                id: user.id || 'unknown',
                name: user.name,
                email: user.email || 'unknown@example.com',
                image: user.image
            });
        }
    }, [user]);

    // Initialize Socket.io
    useEffect(() => {
        if (!currentUser) return;

        const socketInstance = io('http://localhost:5000', {
            auth: {
                userId: currentUser.id
            }
        });

        socketInstance.on('connect', () => {
            console.log('Socket connected');
        });

        socketInstance.on('error', (error) => {
            console.error('Socket error:', error);
            setError('Connection error. Please try again.');
        });

        socketInstance.on('connect_error', (err) => {
            console.error('Connection error:', err);
            setError('Failed to connect to the chat server.');
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [currentUser]);

    // Load conversations
    useEffect(() => {
        if (!currentUser) return;

        const fetchConversations = async () => {
            try {
                setLoading(true);
                console.log(`Fetching conversations for user: ${currentUser.id}`);
                
                const response = await fetch(`/api/conversations/user/${currentUser.id}`);
                
                // Log raw response for debugging
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error response (${response.status}): `, errorText);
                    throw new Error(`Failed to fetch conversations: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data.success) {
                    console.log(`Received ${data.data?.length || 0} conversations`);
                    setConversations(data.data || []);
                } else {
                    throw new Error(data.message || 'Unknown error from API');
                }
            } catch (error) {
                console.error('Error fetching conversations:', error);
                setError(error instanceof Error ? error.message : 'Failed to load conversations.');
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [currentUser]);

    // Socket event handlers
    useEffect(() => {
        if (!socket) return;

        // Handle new messages
        socket.on('message:new', (message: Message) => {
            // Update messages if from current conversation
            if (selectedConversation && message.conversationId === selectedConversation.id) {
                setMessages(prev => [...prev, message]);
            }

            // Update conversations list with latest message
            setConversations(prev => {
                return prev.map(conv => {
                    if (conv.id === message.conversationId) {
                        return {
                            ...conv,
                            updatedAt: new Date().toISOString(),
                            messages: [message]
                        };
                    }
                    return conv;
                }).sort((a, b) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
            });
        });

        // Handle online users
        socket.on('users:online', (users: string[]) => {
            setOnlineUsers(users);
        });

        socket.on('user:online', (userId: string) => {
            setOnlineUsers(prev => [...prev, userId]);
        });

        socket.on('user:offline', (userId: string) => {
            setOnlineUsers(prev => prev.filter(id => id !== userId));
        });

        // Handle typing indicators
        socket.on('typing:start', (data: { userId: string, conversationId: string }) => {
            if (selectedConversation?.id === data.conversationId) {
                setTyping(data);
            }
        });

        socket.on('typing:stop', () => {
            setTyping(null);
        });

        // Handle new conversation
        socket.on('conversation:new', (conversation: Conversation) => {
            setConversations(prev => [conversation, ...prev]);
        });

        // Handle search results
        socket.on('users:search-results', (users: User[]) => {
            setSearchResults(users);
        });

        return () => {
            socket.off('message:new');
            socket.off('users:online');
            socket.off('user:online');
            socket.off('user:offline');
            socket.off('typing:start');
            socket.off('typing:stop');
            socket.off('conversation:new');
            socket.off('users:search-results');
        };
    }, [socket, selectedConversation]);

    // Load messages when a conversation is selected
    useEffect(() => {
        if (!selectedConversation) return;

        const loadMessages = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/conversations/${selectedConversation.id}`);
                if (!response.ok) throw new Error('Failed to fetch messages');
                const data = await response.json();
                if (data.success && data.data.conversation) {
                    setMessages(data.data.conversation.messages || []);
                }
            } catch (error) {
                console.error('Error loading messages:', error);
                setError('Failed to load messages');
            } finally {
                setLoading(false);
            }
        };

        loadMessages();

        // Join the conversation room via socket
        if (socket) {
            socket.emit('conversation:join', selectedConversation.id);
        }

        return () => {
            if (socket) {
                socket.emit('conversation:leave', selectedConversation.id);
            }
        };
    }, [selectedConversation, socket]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle sending a message
    const handleSendMessage = () => {
        if (!socket || !selectedConversation || !newMessage.trim()) return;

        socket.emit('message:send', {
            content: newMessage.trim(),
            conversationId: selectedConversation.id
        });

        setNewMessage('');
    };

    // Handle typing events
    const handleTyping = () => {
        if (!socket || !selectedConversation) return;

        socket.emit('typing:start', selectedConversation.id);

        // Stop typing indicator after 2 seconds of inactivity
        const timeout = setTimeout(() => {
            socket.emit('typing:stop', selectedConversation.id);
        }, 2000);

        return () => clearTimeout(timeout);
    };

    // Handle searching users
    const handleSearch = () => {
        if (!socket || !searchTerm.trim()) return;

        socket.emit('users:search', searchTerm);
    };

    // Start a new conversation with a user
    const startConversation = (userId: string) => {
        if (!socket) return;

        socket.emit('conversation:create', userId);
        setShowSearch(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    // Get other participant in a conversation
    const getOtherParticipant = (conversation: Conversation) => {
        if (!currentUser) return null;
        return conversation.participants.find(p => p.userId !== currentUser.id)?.user;
    };

    // Format timestamp
    const formatTime = (timestamp: string) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
        } catch (error) {
            return 'Recently';
        }
    };

    if (!currentUser) {
        return <div className="flex h-screen items-center justify-center">Loading user profile...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Conversations List */}
            <div className={`w-full md:w-1/3 bg-white border-r ${selectedConversation ? 'hidden md:block' : 'block'}`}>
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-emerald-600 text-white">
                    <h1 className="font-bold text-xl">Chats</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="p-2 rounded-full hover:bg-emerald-700"
                        >
                            <FiSearch size={20} />
                        </button>
                        <button className="p-2 rounded-full hover:bg-emerald-700">
                            <FiMoreVertical size={20} />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {showSearch && (
                    <div className="p-4 border-b">
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search users..."
                                className="w-full px-4 py-2 border rounded-l-lg focus:outline-none"
                            />
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-r-lg"
                            >
                                <FiSearch />
                            </button>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="mt-2 border rounded-lg overflow-hidden bg-white shadow-md">
                                {searchResults.map(user => (
                                    <div
                                        key={user.id}
                                        className="p-3 border-b flex items-center hover:bg-gray-50 cursor-pointer"
                                        onClick={() => startConversation(user.id)}
                                    >
                                        <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                            {user.image ? (
                                                <Image
                                                    src={user.image}
                                                    alt={user.name || 'User'}
                                                    width={40}
                                                    height={40}
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-500">
                                                    {user.name?.[0] || user.email[0].toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{user.name || 'No name'}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Conversations List */}
                {loading && conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">Loading conversations...</div>
                ) : error ? (
                    <div className="p-4 text-center text-red-500">{error}</div>
                ) : conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        No conversations yet. Search for a user to start chatting!
                    </div>
                ) : (
                    <div className="overflow-y-auto h-[calc(100vh-138px)]">
                        {conversations
                            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                            .map(conversation => {
                                const otherUser = getOtherParticipant(conversation);
                                const lastMessage = conversation.messages && conversation.messages.length > 0
                                    ? conversation.messages[0]
                                    : null;

                                return (
                                    <div
                                        key={conversation.id}
                                        onClick={() => setSelectedConversation(conversation)}
                                        className={`p-4 border-b flex items-center hover:bg-gray-50 cursor-pointer ${selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''
                                            }`}
                                    >
                                        {/* Avatar */}
                                        <div className="relative h-12 w-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                                            {otherUser?.image ? (
                                                <Image
                                                    src={otherUser.image}
                                                    alt={otherUser.name || 'User'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-500 text-xl">
                                                    {otherUser?.name?.[0] || otherUser?.email[0].toUpperCase()}
                                                </div>
                                            )}

                                            {/* Online indicator */}
                                            {otherUser && onlineUsers.includes(otherUser.id) && (
                                                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h2 className="font-semibold truncate">{otherUser?.name || otherUser?.email || 'Unknown User'}</h2>
                                                {lastMessage && (
                                                    <span className="text-xs text-gray-500">
                                                        {formatTime(lastMessage.createdAt)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">
                                                {lastMessage
                                                    ? `${lastMessage.senderId === currentUser.id ? 'You: ' : ''}${lastMessage.content}`
                                                    : 'No messages yet'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>

            {/* Chat Area */}
            <div className={`w-full md:w-2/3 flex flex-col bg-gray-50 ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex justify-between items-center bg-emerald-600 text-white">
                            <div className="flex items-center">
                                <button
                                    className="md:hidden mr-3 p-1 rounded-full hover:bg-emerald-700"
                                    onClick={() => setSelectedConversation(null)}
                                >
                                    <BiArrowBack size={20} />
                                </button>

                                <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                    {getOtherParticipant(selectedConversation)?.image ? (
                                        <Image
                                            src={getOtherParticipant(selectedConversation)!.image!}
                                            alt={getOtherParticipant(selectedConversation)?.name || 'User'}
                                            width={40}
                                            height={40}
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-500">
                                            {getOtherParticipant(selectedConversation)?.name?.[0] ||
                                                getOtherParticipant(selectedConversation)?.email[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h2 className="font-bold">
                                        {getOtherParticipant(selectedConversation)?.name ||
                                            getOtherParticipant(selectedConversation)?.email || 'Unknown User'}
                                    </h2>
                                    <p className="text-xs">
                                        {onlineUsers.includes(getOtherParticipant(selectedConversation)?.id || '')
                                            ? 'Online'
                                            : 'Offline'}
                                    </p>
                                </div>
                            </div>

                            <button className="p-2 rounded-full hover:bg-emerald-700">
                                <FiMoreVertical size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-[#e5ded8]">
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex justify-center items-center h-full text-gray-500">
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                <div>
                                    {messages.map((message) => {
                                        const isCurrentUser = message.senderId === currentUser?.id;
                                        return (
                                            <div
                                                key={message.id}
                                                className={`mb-3 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg p-3 ${isCurrentUser
                                                            ? 'bg-emerald-100 text-gray-800'
                                                            : 'bg-white text-gray-800'
                                                        }`}
                                                >
                                                    <p className="break-words">{message.content}</p>
                                                    <p className="text-right text-xs text-gray-500 mt-1">
                                                        {formatTime(message.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Typing indicator */}
                                    {typing && typing.userId !== currentUser.id && (
                                        <div className="flex justify-start mb-3">
                                            <div className="bg-gray-200 rounded-lg p-3">
                                                <div className="flex space-x-1">
                                                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                                                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-white border-t">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyUp={handleTyping}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className={`px-4 py-2 rounded-r-lg ${newMessage.trim()
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    <FiSend />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                        <div className="w-1/2 max-w-md">
                            <Image
                                src="/chat-placeholder.png"
                                alt="Select a conversation"
                                width={300}
                                height={300}
                                className="mx-auto mb-4 opacity-50"
                            />
                            <h2 className="text-xl font-semibold text-center">Select a conversation</h2>
                            <p className="text-center">Choose a conversation from the sidebar or start a new one by searching for users.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
