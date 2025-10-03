import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Mic, Send, X } from 'lucide-react';

const AIBot = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  messages, 
  setMessages, 
  inputText, 
  setInputText, 
  isListening, 
  setIsListening, 
  isProcessing, 
  handleSendMessage,
  processOrderCommand,
  productCatalog,
  orders,
  setGlobalFilter,
  table
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 bg-slate-800 text-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-bold">AI Order Assistant</h2>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1 rounded-md hover:bg-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 rounded-br-none'
                  : 'bg-slate-700 rounded-bl-none'
              } ${message.type === 'success' ? 'border-l-4 border-green-400' : ''} transition-all duration-200`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
              <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-200' : 'text-slate-300'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me about the order or ask a question..."
              className="w-full px-3 py-2 pr-8 border border-slate-600 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              rows="2"
              disabled={isProcessing}
            />
            <button
              onClick={() => setIsListening(!isListening)}
              className={`absolute right-2 bottom-2 p-1 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-slate-600 hover:bg-slate-500'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isProcessing}
            >
              <Mic className="h-3 w-3" />
            </button>
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isProcessing}
            className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {isListening && (
          <div className="mt-2 text-center">
            <div className="inline-flex items-center px-3 py-1 bg-red-900/50 text-red-100 rounded-full text-xs border border-red-700">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
              Listening... Speak now
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIBot;