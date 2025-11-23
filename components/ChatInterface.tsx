
import React, { useState, useEffect, useRef } from 'react';
import { Send, ShieldAlert, Info, ArrowLeft, Search, MoreVertical, CheckCheck, Loader2 } from 'lucide-react';
import { Conversation, Message, User } from '../types';
import { Button } from './Button';
import { analyzeMessageSafety } from '../services/gemini';

interface ChatInterfaceProps {
  currentUser: User;
  conversations: Conversation[];
  activeConversationId?: string | null;
  onBackToHome: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentUser,
  conversations: initialConversations,
  activeConversationId,
  onBackToHome
}) => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(activeConversationId || null);
  const [newMessage, setNewMessage] = useState('');
  const [isAiChecking, setIsAiChecking] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Responsive view state
  const isMobile = window.innerWidth < 768;
  const showSidebar = !isMobile || (isMobile && !selectedChatId);
  const showChat = !isMobile || (isMobile && selectedChatId);

  const activeConversation = conversations.find(c => c.id === selectedChatId);

  useEffect(() => {
    if (activeConversationId) {
      setSelectedChatId(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newMessage.trim() || !selectedChatId) return;
    setModerationError(null);
    setIsAiChecking(true);

    // 1. Client-Side Regex Check (Fast)
    const phoneRegex = /(\+?234|0)[789][01]\d{8}/;
    if (phoneRegex.test(newMessage.replace(/\s/g, ''))) {
       setModerationError("Safety Alert: Sharing phone numbers is not allowed. Please chat within the app.");
       setIsAiChecking(false);
       return;
    }

    // 2. AI Moderation Check (Deep)
    const safetyResult = await analyzeMessageSafety(newMessage);

    if (!safetyResult.isSafe) {
        setModerationError("Message blocked by AI Monitor: Attempt to trade off-platform or share contact info detected.");
        setIsAiChecking(false);
        return;
    }

    // 3. Send Message
    const msg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: newMessage,
      timestamp: new Date()
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedChatId) {
        return {
          ...conv,
          messages: [...conv.messages, msg],
          lastMessage: newMessage,
          lastMessageDate: new Date()
        };
      }
      return conv;
    }));

    setNewMessage('');
    setIsAiChecking(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col h-full">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 h-16">
        <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBackToHome} className="mr-2">
                <ArrowLeft className="w-5 h-5 mr-1" /> Home
            </Button>
            <h1 className="text-xl font-bold text-gray-900 hidden md:block">Messages</h1>
        </div>
        <div className="flex items-center text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-medium">
             <ShieldAlert className="w-4 h-4 mr-2" />
             AI Chat Monitoring Active
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Conversation List */}
        <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-80 lg:w-96 flex-col border-r border-gray-200 bg-white`}>
            <div className="p-4 border-b border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search chats..." 
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    />
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {conversations.map(conv => (
                    <div 
                        key={conv.id}
                        onClick={() => setSelectedChatId(conv.id)}
                        className={`flex items-start p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedChatId === conv.id ? 'bg-indigo-50 hover:bg-indigo-50' : ''}`}
                    >
                        <div className="relative shrink-0">
                            <img src={`https://ui-avatars.com/api/?name=${conv.otherUserName}&background=random`} alt="" className="w-12 h-12 rounded-full" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-sm font-bold text-gray-900 truncate">{conv.otherUserName}</h3>
                                <span className="text-[10px] text-gray-500">{conv.lastMessageDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p className="text-xs text-indigo-600 font-medium truncate mb-0.5">{conv.listingTitle}</p>
                            <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Chat Area */}
        <div className={`${showChat ? 'flex' : 'hidden'} flex-1 flex-col bg-gray-50/50 relative`}>
            {activeConversation ? (
                <>
                    {/* Active Chat Header */}
                    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm shrink-0">
                         <div className="flex items-center">
                             <Button variant="ghost" size="sm" className="md:hidden mr-2 -ml-2" onClick={() => setSelectedChatId(null)}>
                                 <ArrowLeft className="w-5 h-5" />
                             </Button>
                             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold mr-3">
                                 {activeConversation.otherUserName.charAt(0)}
                             </div>
                             <div>
                                 <h2 className="font-bold text-gray-900">{activeConversation.otherUserName}</h2>
                                 <p className="text-xs text-gray-500 flex items-center">
                                     <span className="bg-gray-200 text-gray-600 px-1.5 rounded mr-2">{activeConversation.otherUserUniversity}</span>
                                     Active now
                                 </p>
                             </div>
                         </div>
                         <Button variant="ghost" size="sm"><MoreVertical className="w-5 h-5 text-gray-400" /></Button>
                    </div>

                    {/* Listing Context Banner */}
                    <div className="bg-white border-b border-gray-100 p-2 flex items-center gap-3 px-4 shadow-sm z-10">
                        <img src={activeConversation.listingImage} className="w-10 h-10 rounded object-cover bg-gray-100" alt="" />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500">Discussing item:</p>
                            <p className="text-sm font-bold text-gray-900">{activeConversation.listingTitle}</p>
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        <div className="flex justify-center my-4">
                            <div className="bg-blue-50 text-blue-800 text-xs px-4 py-2 rounded-full flex items-center shadow-sm">
                                <Info className="w-3 h-3 mr-2" />
                                AI is monitoring this chat for your safety. Do not share contacts.
                            </div>
                        </div>

                        {activeConversation.messages.map(msg => {
                            const isMe = msg.senderId === currentUser.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                                        isMe 
                                        ? 'bg-indigo-600 text-white rounded-br-none' 
                                        : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                                    }`}>
                                        <p>{msg.text}</p>
                                        <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                                            <span>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            {isMe && <CheckCheck className="w-3 h-3" />}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                        {moderationError && (
                            <div className="mb-3 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-start border border-red-100 animate-pulse">
                                <ShieldAlert className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                                {moderationError}
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                            <div className="relative flex-1">
                                <textarea 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none bg-white text-gray-900 placeholder-gray-500"
                                    rows={1}
                                    style={{ minHeight: '48px', maxHeight: '100px' }}
                                />
                            </div>
                            <Button 
                                type="submit" 
                                disabled={!newMessage.trim() || isAiChecking}
                                className="h-12 w-12 rounded-xl flex items-center justify-center p-0 shrink-0"
                            >
                                {isAiChecking ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </Button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Send className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Your Messages</h3>
                    <p className="max-w-xs">Select a conversation from the left to start chatting securely.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
