// Messages.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Send, Phone, Video, MoreVertical, ChevronLeft,
  Paperclip, Smile, Mic, PhoneOff, VideoOff, UserPlus,
  MessageCircle, Image, File, X, Mail
} from 'lucide-react';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCall, setActiveCall] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRetailers, setShowRetailers] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callStatus, setCallStatus] = useState('calling');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sample data
  const sampleUsers = {
    retailer: { id: 'retailer_1', name: 'Tech Store', type: 'retailer', avatar: 'TS', online: true },
    customer: { id: 'customer_1', name: 'Sarah Johnson', type: 'customer', avatar: 'SJ', online: true }
  };

  const availableRetailers = [
    { id: 'retailer_1', name: 'Tech Store', avatar: 'TS', category: 'Electronics', rating: '4.8', online: true },
    { id: 'retailer_2', name: 'Fashion Hub', avatar: 'FH', category: 'Clothing', rating: '4.6', online: false },
    { id: 'retailer_3', name: 'Home Essentials', avatar: 'HE', category: 'Home Goods', rating: '4.9', online: true }
  ];

  const commonEmojis = ['😀', '😂', '🥰', '😎', '👍', '❤️', '🔥', '🎉', '🙏', '💯'];

  // Mock conversations data
  const mockConversations = [
    {
      id: 'conv_1',
      retailer_id: 'retailer_1',
      retailer_name: 'Tech Store',
      retailer_avatar: 'TS',
      customer_id: 'customer_1',
      customer_name: 'Sarah Johnson',
      customer_avatar: 'SJ',
      last_message: 'Thanks for your purchase! Let us know if you need help with setup.',
      unread_count: 2,
      timestamp: new Date(Date.now() - 300000),
      online: true
    },
    {
      id: 'conv_2',
      retailer_id: 'retailer_2',
      retailer_name: 'Fashion Hub',
      retailer_avatar: 'FH',
      customer_id: 'customer_1',
      customer_name: 'Sarah Johnson',
      customer_avatar: 'SJ',
      last_message: 'Your order has been shipped and will arrive tomorrow',
      unread_count: 0,
      timestamp: new Date(Date.now() - 600000),
      online: false
    },
    {
      id: 'conv_3',
      retailer_id: 'retailer_3',
      retailer_name: 'Home Essentials',
      retailer_avatar: 'HE',
      customer_id: 'customer_1',
      customer_name: 'Sarah Johnson',
      customer_avatar: 'SJ',
      last_message: 'We have a new collection arriving next week',
      unread_count: 1,
      timestamp: new Date(Date.now() - 86400000),
      online: true
    }
  ];

  const mockMessages = {
    'conv_1': [
      {
        id: 'msg_1',
        sender_id: 'customer_1',
        sender_type: 'customer',
        content: 'Hi, I have a question about my recent laptop purchase',
        message_type: 'text',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 'msg_2',
        sender_id: 'retailer_1',
        sender_type: 'retailer',
        content: 'Hello Sarah! I\'d be happy to help. What would you like to know?',
        message_type: 'text',
        timestamp: new Date(Date.now() - 3500000)
      },
      {
        id: 'msg_3',
        sender_id: 'customer_1',
        sender_type: 'customer',
        content: 'When will my order be delivered? I need it for work',
        message_type: 'text',
        timestamp: new Date(Date.now() - 3400000)
      },
      {
        id: 'msg_4',
        sender_id: 'retailer_1',
        sender_type: 'retailer',
        content: 'Thanks for your purchase! Let us know if you need help with setup.',
        message_type: 'text',
        timestamp: new Date(Date.now() - 300000)
      }
    ]
  };

  // Initialize data
  useEffect(() => {
    setCurrentUser(sampleUsers.customer);
    setConversations(mockConversations);
  }, []);

  const fetchConversation = async (conversationId) => {
    setIsLoading(true);
    setTimeout(() => {
      const conversation = mockConversations.find(c => c.id === conversationId);
      if (conversation) {
        setSelectedConversation({
          ...conversation,
          messages: mockMessages[conversationId] || []
        });
      }
      setIsLoading(false);
    }, 500);
  };

  const startNewConversation = async (retailer) => {
    const newConversation = {
      id: `conv_${Date.now()}`,
      retailer_id: retailer.id,
      retailer_name: retailer.name,
      retailer_avatar: retailer.avatar,
      customer_id: currentUser.id,
      customer_name: currentUser.name,
      customer_avatar: currentUser.avatar,
      last_message: 'Conversation started',
      unread_count: 0,
      timestamp: new Date(),
      messages: [],
      online: retailer.online
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
    setShowRetailers(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender_id: currentUser.id,
      sender_type: currentUser.type,
      content: newMessage,
      message_type: 'text',
      timestamp: new Date()
    };

    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      last_message: newMessage,
      timestamp: new Date()
    }));

    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, last_message: newMessage, timestamp: new Date() }
          : conv
      )
    );

    setNewMessage('');
  };

  const toggleUserType = () => {
    setCurrentUser(currentUser.type === 'retailer' ? sampleUsers.customer : sampleUsers.retailer);
    setSelectedConversation(null);
  };

  const getOtherPartyName = (conv) => currentUser.type === 'retailer' ? conv.customer_name : conv.retailer_name;
  const getOtherPartyAvatar = (conv) => currentUser.type === 'retailer' ? conv.customer_avatar : conv.retailer_avatar;
  const isOnline = (conv) => conv.online;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const filteredConversations = conversations.filter(conv =>
    currentUser?.type === 'retailer'
      ? conv.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      : conv.retailer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`w-full md:w-96 bg-gray-50 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleUserType}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-600"
              >
                {currentUser?.type === 'retailer' ? 'Switch to Customer' : 'Switch to Retailer'}
              </button>
              <button 
                onClick={() => setShowRetailers(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => fetchConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-white ${
                selectedConversation?.id === conversation.id ? 'bg-white border-blue-500 border-r-2' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                    {getOtherPartyAvatar(conversation)}
                  </div>
                  {isOnline(conversation) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {getOtherPartyName(conversation)}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(conversation.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                    {conversation.last_message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isOnline(conversation) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isOnline(conversation) ? 'Online' : 'Offline'}
                    </span>
                    {conversation.unread_count > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-6 text-center">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {/* Chat Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold">
                  {getOtherPartyAvatar(selectedConversation)}
                </div>
                {isOnline(selectedConversation) && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div>
                <h2 className="font-semibold text-gray-900 text-lg">
                  {getOtherPartyName(selectedConversation)}
                </h2>
                <p className="text-sm text-gray-600 flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    isOnline(selectedConversation) ? 'bg-green-400' : 'bg-gray-400'
                  }`}></span>
                  {isOnline(selectedConversation) ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading messages...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedConversation.messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-lg px-4 py-3 rounded-2xl ${
                        message.sender_id === currentUser.id
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.sender_id === currentUser.id ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-6">
            <div className="flex items-end space-x-3">
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  rows="1"
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                
                {/* Attachment Menu */}
                {showAttachmentMenu && (
                  <div className="absolute bottom-16 left-0 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-48">
                    <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                      <Image className="w-4 h-4 text-blue-500" />
                      <span>Photo & Video</span>
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                      <File className="w-4 h-4 text-blue-500" />
                      <span>Document</span>
                    </button>
                  </div>
                )}

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-0 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-10 grid grid-cols-5 gap-2 min-w-48">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => setNewMessage(prev => prev + emoji)}
                        className="w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors text-lg flex items-center justify-center"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className={`p-3 rounded-xl transition-all ${
                  newMessage.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Messages</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Send messages, share files, and have conversations with retailers and customers. 
              Start by selecting a conversation or creating a new one.
            </p>
            <button
              onClick={() => setShowRetailers(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              Start New Conversation
            </button>
          </div>
        </div>
      )}

      {/* Retailers Modal */}
      {showRetailers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Start New Conversation</h3>
                <button
                  onClick={() => setShowRetailers(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-3">
                {availableRetailers.map(retailer => (
                  <button
                    key={retailer.id}
                    onClick={() => startNewConversation(retailer)}
                    className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold">
                          {retailer.avatar}
                        </div>
                        {retailer.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900">{retailer.name}</p>
                          <div className="flex items-center space-x-1 text-sm text-blue-600">
                            <span>⭐</span>
                            <span>{retailer.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{retailer.category}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          retailer.online 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {retailer.online ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;