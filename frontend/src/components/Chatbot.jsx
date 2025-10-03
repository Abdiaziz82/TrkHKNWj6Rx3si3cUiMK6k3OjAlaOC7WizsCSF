import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiX, FiMinimize, FiMaximize, FiPaperclip, FiUser, FiClock } from 'react-icons/fi';
import { BsLightningFill } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

const Chatbot = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: t("chatbot.welcome"),
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('inventory') || message.includes('stock')) {
      return "I can help you check inventory levels. For real-time stock information, please provide the SKU numbers or product names you're interested in. You can also access our live inventory dashboard through the main portal.";
    } else if (message.includes('price') || message.includes('cost')) {
      return "Our wholesale pricing is based on order volume and your account tier. For specific pricing, please let me know which products you're interested in and your estimated monthly order quantities. I can also check for any current promotions.";
    } else if (message.includes('order') || message.includes('track')) {
      return "To track an order, I'll need your order number. You can also visit the Orders section in your dashboard for real-time tracking updates and delivery estimates.";
    } else if (message.includes('supplier') || message.includes('vendor')) {
      return "We work with over 500 verified global suppliers. Tell me what category of products you're looking for, and I'll connect you with suitable suppliers from our network.";
    } else if (message.includes('shipping') || message.includes('delivery')) {
      return "We offer multiple shipping options including express, standard, and consolidated freight. Shipping costs and times vary by destination and order size. What's your target delivery location?";
    } else if (message.includes('payment') || message.includes('credit')) {
      return "We accept various payment methods including wire transfer, credit cards, and offer net-30 terms for qualified businesses. For payment term inquiries, please contact our accounts team.";
    } else {
      return "Thank you for your inquiry. I'm here to assist with wholesale purchasing, inventory management, supplier connections, and order tracking. Could you please provide more specific details so I can better assist you?";
    }
  };

  const quickActions = [
    { label: t("chatbot.quickActions.inventory"), query: 'What is the current inventory status for popular items?' },
    { label: t("chatbot.quickActions.pricing"), query: 'Can you provide wholesale pricing for bulk orders?' },
    { label: t("chatbot.quickActions.order"), query: 'I need to track my recent order' },
    { label: t("chatbot.quickActions.supplier"), query: 'Connect me with reliable suppliers' }
  ];

  const handleQuickAction = (query) => {
    setInputMessage(query);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[100] flex flex-col w-full max-w-md bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out">
      
      {/* Chat Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
            <BsLightningFill className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{t("chatbot.header.title")}</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-500">{t("chatbot.header.status")}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <FiMaximize className="w-4 h-4" /> : <FiMinimize className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
            aria-label="Close chat"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-25">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : message.type === 'welcome'
                      ? 'bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 text-slate-700'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mt-0.5">
                        <BsLightningFill className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div className={`flex items-center space-x-1 mt-2 text-xs ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        <FiClock className="w-3 h-3" />
                        <span>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <div className="flex-shrink-0 w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center mt-0.5">
                        <FiUser className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-4 bg-slate-100 border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-slate-500">{t("chatbot.loading")}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-6 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.query)}
                    className="px-3 py-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors text-left"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-slate-200 p-6 bg-white">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={t("chatbot.inputPlaceholder")}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-700 placeholder-slate-400 disabled:bg-slate-50"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
                  aria-label="Attach file"
                >
                  <FiPaperclip className="w-4 h-4" />
                </button>
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                aria-label="Send message"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </form>
            
            {/* Privacy Notice */}
            <div className="mt-3 text-center">
              <p className="text-xs text-slate-400">
                {t("chatbot.privacy")}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
