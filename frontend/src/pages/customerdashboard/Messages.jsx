// Messages.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Send, Phone, Video, MoreVertical, ChevronLeft,
  Paperclip, Smile, Mic, PhoneOff, VideoOff, UserPlus,
  Users, MessageCircle
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
  const messagesEndRef = useRef(null);

  const API_BASE = 'http://localhost:5000/api/messages';

  // Sample users (in real app, this would come from authentication)
  const sampleUsers = {
    retailer: {
      id: 'retailer_1',
      name: 'Tech Store',
      type: 'retailer',
      avatar: 'TS'
    },
    customer: {
      id: 'customer_1', 
      name: 'John Customer',
      type: 'customer',
      avatar: 'JC'
    }
  };

  // Available retailers for customers to message
  const availableRetailers = [
    {
      id: 'retailer_1',
      name: 'Tech Store',
      avatar: 'TS',
      category: 'Electronics',
      rating: '4.8'
    },
    {
      id: 'retailer_2',
      name: 'Fashion Hub',
      avatar: 'FH',
      category: 'Clothing',
      rating: '4.6'
    },
    {
      id: 'retailer_3',
      name: 'Home Essentials',
      avatar: 'HE',
      category: 'Home Goods',
      rating: '4.9'
    }
  ];

  // Set current user (toggle between retailer and customer for demo)
  useEffect(() => {
    setCurrentUser(sampleUsers.retailer); // Start as retailer
  }, []);

  // Fetch conversations for current user
  const fetchConversations = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(
        `${API_BASE}/conversations?user_id=${currentUser.id}&user_type=${currentUser.type}`
      );
      const data = await response.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Fetch conversation details
  const fetchConversation = async (conversationId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/conversations/${conversationId}?user_id=${currentUser.id}`
      );
      const data = await response.json();
      if (data.success) {
        setSelectedConversation(data.data);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start new conversation with retailer
  const startNewConversation = async (retailer) => {
    try {
      const response = await fetch(`${API_BASE}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retailer_id: retailer.id,
          retailer_name: retailer.name,
          retailer_avatar: retailer.avatar,
          customer_id: currentUser.id,
          customer_name: currentUser.name,
          customer_avatar: currentUser.avatar
        })
      });

      const data = await response.json();
      if (data.success) {
        await fetchConversation(data.data.conversation_id);
        await fetchConversations();
        setShowRetailers(false);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    try {
      const response = await fetch(
        `${API_BASE}/conversations/${selectedConversation.id}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender_id: currentUser.id,
            sender_type: currentUser.type,
            content: newMessage,
            message_type: 'text'
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        // Refresh conversation to get updated messages
        await fetchConversation(selectedConversation.id);
        await fetchConversations(); // Update conversations list
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Toggle user type (retailer/customer) for demo
  const toggleUserType = () => {
    setCurrentUser(currentUser.type === 'retailer' ? sampleUsers.customer : sampleUsers.retailer);
    setSelectedConversation(null);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const filteredConversations = conversations.filter(conv =>
    currentUser.type === 'retailer' 
      ? conv.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      : conv.retailer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOtherPartyName = (conversation) => {
    return currentUser.type === 'retailer' ? conversation.customer_name : conversation.retailer_name;
  };

  const getOtherPartyAvatar = (conversation) => {
    return currentUser.type === 'retailer' ? conversation.customer_avatar : conversation.retailer_avatar;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversations Sidebar */}
      <div className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col ${
        selectedConversation ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Sidebar Header */}
        <div className="p-4 bg-blue-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold">Messages</h1>
            <div className="flex space-x-2">
              <button 
                onClick={toggleUserType}
                className="p-2 hover:bg-blue-700 rounded-full text-xs bg-blue-800"
                title={`Switch to ${currentUser?.type === 'retailer' ? 'Customer' : 'Retailer'}`}
              >
                {currentUser?.type === 'retailer' ? 'C' : 'R'}
              </button>
              <button 
                onClick={() => setShowRetailers(true)}
                className="p-2 hover:bg-blue-700 rounded-full"
              >
                <UserPlus className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-blue-700 rounded-full">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-sm mb-2">
            Logged in as: <strong>{currentUser?.name}</strong> ({currentUser?.type})
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" />
            <input
              type="text"
              placeholder={`Search ${currentUser?.type === 'retailer' ? 'customers' : 'retailers'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-blue-500 text-white placeholder-blue-200 rounded-lg focus:outline-none focus:bg-blue-600 border border-blue-400"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => fetchConversation(conversation.id)}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {getOtherPartyAvatar(conversation)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {getOtherPartyName(conversation)}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(conversation.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.last_message}
                    </p>
                    {conversation.unread_count > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
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
          <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {getOtherPartyAvatar(selectedConversation)}
              </div>
              
              <div>
                <h2 className="font-semibold text-gray-900">
                  {getOtherPartyName(selectedConversation)}
                </h2>
                <p className="text-sm text-gray-600">
                  {currentUser.type === 'retailer' ? 'Customer' : 'Retailer'}
                </p>
              </div>
            </div>

            {/* Call Buttons */}
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Video className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading messages...</div>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedConversation.messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender_id === currentUser.id
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-white text-gray-900 rounded-bl-none shadow-sm border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
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
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message"
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {newMessage.trim() ? (
                <button
                  onClick={sendMessage}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Empty state when no conversation selected
        <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Direct Messaging</h3>
            <p>Select a conversation to start messaging</p>
            <button
              onClick={() => setShowRetailers(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start New Conversation
            </button>
          </div>
        </div>
      )}

      {/* Retailers Modal */}
      {showRetailers && currentUser?.type === 'customer' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Available Retailers</h3>
                <button
                  onClick={() => setShowRetailers(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto max-h-96">
              <div className="space-y-3">
                {availableRetailers.map(retailer => (
                  <button
                    key={retailer.id}
                    onClick={() => startNewConversation(retailer)}
                    className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {retailer.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{retailer.name}</p>
                        <p className="text-sm text-gray-600">{retailer.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-blue-600">⭐ {retailer.rating}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Interface */}
      {activeCall && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              {activeCall.type === 'video' ? (
                <Video className="w-12 h-12" />
              ) : (
                <Phone className="w-12 h-12" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-2">
              {activeCall.type === 'video' ? 'Video Call' : 'Voice Call'}
            </h2>
            
            <p className="text-gray-300 mb-2">Calling {selectedConversation?.user_name}</p>
            <p className="text-gray-300 mb-6">Status: {activeCall.status}</p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={endCall}
                className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-colors"
              >
                {activeCall.type === 'video' ? (
                  <VideoOff className="w-6 h-6" />
                ) : (
                  <PhoneOff className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;