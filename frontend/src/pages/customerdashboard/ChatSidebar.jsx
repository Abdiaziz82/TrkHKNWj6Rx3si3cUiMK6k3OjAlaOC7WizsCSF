import { useState, useEffect, useRef } from 'react';
import { 
  FiMessageCircle, 
  FiX, 
  FiGlobe, 
  FiMic, 
  FiMicOff, 
  FiPhone, 
  FiDollarSign,
  FiCheckCircle,
  FiShoppingCart
} from 'react-icons/fi';

const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  sw: { name: 'Kiswahili', flag: '🇹🇿' }
};

const translations = {
  en: {
    welcome: "Hi! I'm your AI order assistant. I can help you place orders instantly. What would you like to order today?",
    helpOrder: "I can help you with that! Let me check our available products for you.",
    paymentPrompt: "Please choose your preferred payment method:",
    paymentSuccess: "Payment successful! Redirecting to your orders...",
    mpesaPrompt: "Please enter your M-Pesa phone number:",
    airtelPrompt: "Please enter your Airtel Money phone number:",
    cashConfirm: "Cash payment selected. Please have exact amount ready upon delivery.",
    placeOrder: "Place New Order",
    currentOffers: "Current Offers",
    trackOrder: "Track Order",
    newProducts: "New Products",
    chatTitle: "AI Order Assistant",
    chatSubtitle: "Instant ordering powered by AI",
    typeMessage: "Type your message here...",
    send: "Send",
    listening: "Listening...",
    startSpeaking: "Start speaking",
    chooseLanguage: "Choose Language",
    paymentMethods: "Payment Methods",
    cash: "Cash on Delivery",
    mpesa: "M-Pesa",
    airtel: "Airtel Money",
    enterPhone: "Enter Phone Number",
    processPayment: "Process Payment",
    cancel: "Cancel",
    success: "Success!",
    redirecting: "Redirecting to orders...",
    productAvailable: "Great! {product} is available.",
    productUnavailable: "I'm sorry, {product} is currently out of stock.",
    insufficientStock: "I'm sorry, we only have {stock} units of {product} available.",
    confirmOrder: "Shall I order {quantity} {product} for KSh {total}?",
    orderConfirmed: "Order confirmed! Processing your payment...",
    processingOrder: "Processing your order...",
    orderSuccess: "Excellent! Order #{orderId} placed successfully. STK Push sent to your phone.",
    stkPushSent: "Payment request sent to your phone. Please complete the payment.",
    errorProcessing: "Error processing your order. Please try again.",
    specifyQuantity: "How many would you like to order?",
    productNotFound: "I couldn't find '{product}'. Here are available products: {suggestions}",
    needProductInfo: "I'd be happy to help you order! Please tell me what product you'd like.",
    yes: "Yes",
    no: "No",
    confirm: "Confirm",
    cancelOrder: "Cancel"
  },
  sw: {
    welcome: "Habari! Mimi ni msaidizi wako wa kuagiza. Ninaweza kukusaidia kuagiza haraka. Ungependa kuagiza nini leo?",
    helpOrder: "Ninaweza kukusaidia na hilo! Nitaangalia bidhaa zetu zilizopo kwa ajili yako.",
    paymentPrompt: "Tafadhali chagua njia yako ya malipo unayopendelea:",
    paymentSuccess: "Malipo yamefanikiwa! Unaendelea kwenye maagizo yako...",
    mpesaPrompt: "Tafadhali weka nambari yako ya simu ya M-Pesa:",
    airtelPrompt: "Tafadhali weka nambari yako ya simu ya Airtel Money:",
    cashConfirm: "Uchaguzi wa malipo ya pesa taslim. Tafadhali andaa kiasi halisi wakati wa kufikishwa.",
    placeOrder: "Weka Agizo Jipya",
    currentOffers: "Ofa za Sasa",
    trackOrder: "Fuatilia Agizo",
    newProducts: "Bidhaa Mpya",
    chatTitle: "Msaidizi wa Maagizo",
    chatSubtitle: "Kuagiza haraka kwa umakini wa AI",
    typeMessage: "Andika ujumbe wako hapa...",
    send: "Tuma",
    listening: "Inasikiliza...",
    startSpeaking: "Anza kuzungumza",
    chooseLanguage: "Chagua Lugha",
    paymentMethods: "Mbinu za Malipo",
    cash: "Pesa Taslim",
    mpesa: "M-Pesa",
    airtel: "Airtel Money",
    enterPhone: "Weka Nambari ya Simu",
    processPayment: "Fanya Malipo",
    cancel: "Ghairi",
    success: "Imefanikiwa!",
    redirecting: "Inaelekeza kwenye maagizo...",
    productAvailable: "Vizuri! {product} ipo.",
    productUnavailable: "Samahani, {product} haipo kwa sasa.",
    insufficientStock: "Samahani, tuna {stock} vipimo tu vya {product} vinavyopatikana.",
    confirmOrder: "Je, niagize {quantity} {product} kwa KSh {total}?",
    orderConfirmed: "Agizo limethibitishwa! Inachakata malipo yako...",
    processingOrder: "Inachakata agizo lako...",
    orderSuccess: "Bora! Agizo #{orderId} limewekwa kikamilifu. STK Push imetumwa kwenye simu yako.",
    stkPushSent: "Ombi la malipo limetumwa kwenye simu yako. Tafadhali kamilisha malipo.",
    errorProcessing: "Hitilafu katika kuchakata agizo lako. Tafadhali jaribu tena.",
    specifyQuantity: "Ungependa vipimo ngapi?",
    productNotFound: "Sikuweza kupata '{product}'. Hizi ni bidhaa zilizopo: {suggestions}",
    needProductInfo: "Ningefurahi kukusaidia kuagiza! Tafadhali niambie ni bidhaa gani ungependa.",
    yes: "Ndio",
    no: "Hapana",
    confirm: "Thibitisha",
    cancelOrder: "Ghairi"
  }
};

const ChatSidebar = ({ show, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: translations.en.welcome,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [awaitingQuantity, setAwaitingQuantity] = useState(null);

  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage === 'sw' ? 'sw-TZ' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        setTimeout(() => handleSendMessage(transcript), 300);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Toggle voice recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Analyze message with backend AI
  const analyzeMessage = async (message) => {
    try {
      const response = await fetch('http://localhost:5000/api/chatbot/analyze-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: message,
          language: selectedLanguage
        })
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to analyze message');
      }
    } catch (error) {
      console.error('Error analyzing message:', error);
      return {
        success: false,
        message: translations[selectedLanguage].errorProcessing
      };
    }
  };

  // Confirm order with backend
  const confirmOrder = async (orderData) => {
    try {
      const response = await fetch('http://localhost:5000/api/chatbot/confirm-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: orderData.product.id,
          quantity: orderData.quantity,
          total_amount: orderData.totalAmount
        })
      });

      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to confirm order');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      throw error;
    }
  };

  // Handle quantity input
  const handleQuantityInput = async (quantityText) => {
    if (!awaitingQuantity) return;

    const quantity = parseInt(quantityText);
    if (isNaN(quantity) || quantity <= 0) {
      addBotMessage(selectedLanguage === 'sw' 
        ? 'Tafadhali weka nambari halali. Ungependa vipimo ngapi?'
        : 'Please enter a valid number. How many would you like to order?'
      );
      return;
    }

    const product = awaitingQuantity;
    const totalAmount = parseFloat(product.price) * quantity;

    if (product.stock < quantity) {
      addBotMessage(
        translations[selectedLanguage].insufficientStock
          .replace('{stock}', product.stock)
          .replace('{product}', product.name)
      );
      setAwaitingQuantity(null);
      return;
    }

    // Store order info for confirmation
    setCurrentOrder({
      product: product,
      quantity: quantity,
      totalAmount: totalAmount
    });

    // Ask for confirmation
    addBotMessage(
      translations[selectedLanguage].confirmOrder
        .replace('{quantity}', quantity)
        .replace('{product}', product.name)
        .replace('{total}', totalAmount.toFixed(2)),
      true
    );

    setAwaitingQuantity(null);
  };

  // Handle order confirmation
  const handleOrderConfirmation = async (confirmed) => {
    if (!confirmed || !currentOrder) {
      addBotMessage(selectedLanguage === 'sw' ? 'Agizo limeghairiwa.' : 'Order cancelled.');
      setCurrentOrder(null);
      return;
    }

    setIsProcessing(true);
    addBotMessage(translations[selectedLanguage].orderConfirmed);

    try {
      const result = await confirmOrder(currentOrder);
      
      if (result.success) {
        addBotMessage(
          translations[selectedLanguage].orderSuccess.replace('{orderId}', result.order.id)
        );
        setCurrentOrder(null);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      addBotMessage(`${translations[selectedLanguage].errorProcessing}: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add message to chat
  const addBotMessage = (text, hasButtons = false) => {
    const message = {
      id: Date.now(),
      text: text,
      sender: 'bot',
      timestamp: new Date(),
      hasButtons: hasButtons
    };
    setChatMessages(prev => [...prev, message]);
  };

  // Handle sending messages
  const handleSendMessage = async (customMessage = null) => {
    const messageToSend = customMessage || newMessage;
    
    if (messageToSend.trim() === '' || isProcessing) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: messageToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    
    if (!customMessage) {
      setNewMessage('');
    }

    // If awaiting quantity input
    if (awaitingQuantity) {
      await handleQuantityInput(messageToSend);
      return;
    }

    setIsProcessing(true);

    try {
      const analysis = await analyzeMessage(messageToSend);
      
      if (analysis.success) {
        switch (analysis.type) {
          case 'product_available':
            setCurrentOrder({
              product: analysis.product,
              quantity: analysis.quantity,
              totalAmount: analysis.total_amount
            });
            addBotMessage(analysis.confirmation_message, true);
            break;

          case 'need_quantity':
            setAwaitingQuantity(analysis.product);
            addBotMessage(analysis.message);
            break;

          case 'insufficient_stock':
            setCurrentOrder({
              product: analysis.product,
              quantity: analysis.available_stock,
              totalAmount: parseFloat(analysis.product.price) * analysis.available_stock
            });
            addBotMessage(
              translations[selectedLanguage].confirmOrder
                .replace('{quantity}', analysis.available_stock)
                .replace('{product}', analysis.product.name)
                .replace('{total}', (parseFloat(analysis.product.price) * analysis.available_stock).toFixed(2)),
              true
            );
            break;

          default:
            addBotMessage(analysis.message);
        }
      } else {
        addBotMessage(analysis.message || translations[selectedLanguage].errorProcessing);
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      addBotMessage(translations[selectedLanguage].errorProcessing);
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick action buttons
  const quickActions = [
    { text: "Browse Products", trigger: "What products do you have?" },
    { text: "My Orders", trigger: "Show me my orders" },
    { text: "Help", trigger: "How does this work?" }
  ];

  const handleQuickAction = (trigger) => {
    handleSendMessage(trigger);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleSendMessage();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <FiMessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{translations[selectedLanguage].chatTitle}</h3>
            <p className="text-sm text-blue-100">{translations[selectedLanguage].chatSubtitle}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Language Selector */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 flex items-center">
            <FiGlobe className="w-4 h-4 mr-2" />
            {translations[selectedLanguage].chooseLanguage}
          </span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {Object.entries(languages).map(([code, lang]) => (
              <option key={code} value={code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3"
      >
        {chatMessages.map((message) => (
          <div key={message.id}>
            <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-3 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            {/* Order Confirmation Buttons */}
            {message.hasButtons && (
              <div className="flex justify-start space-x-2 mt-2">
                <button
                  onClick={() => handleOrderConfirmation(true)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {translations[selectedLanguage].yes}
                </button>
                <button
                  onClick={() => handleOrderConfirmation(false)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  {translations[selectedLanguage].no}
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-3 py-2">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">{translations[selectedLanguage].processingOrder}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="grid grid-cols-3 gap-2 mb-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.trigger)}
              disabled={isProcessing}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center disabled:opacity-50"
            >
              {action.text}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex space-x-2">
          <button
            onClick={toggleListening}
            disabled={isProcessing}
            className={`p-2 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } disabled:opacity-50`}
            title={isListening ? translations[selectedLanguage].listening : translations[selectedLanguage].startSpeaking}
          >
            {isListening ? <FiMicOff className="w-4 h-4" /> : <FiMic className="w-4 h-4" />}
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
            placeholder={
              awaitingQuantity 
                ? translations[selectedLanguage].specifyQuantity
                : translations[selectedLanguage].typeMessage
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isProcessing || newMessage.trim() === ''}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {translations[selectedLanguage].send}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;