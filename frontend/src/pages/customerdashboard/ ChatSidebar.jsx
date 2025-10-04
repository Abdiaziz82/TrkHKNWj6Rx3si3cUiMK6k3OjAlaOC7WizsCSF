import { useState, useEffect, useRef } from 'react';
import { 
  FiMessageCircle, 
  FiX, 
  FiGlobe, 
  FiMic, 
  FiMicOff, 
  FiPhone, 
  FiDollarSign,
  FiCheckCircle
} from 'react-icons/fi';

// Move translations and languages to the top level, outside the component
const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  sw: { name: 'Kiswahili', flag: '🇹🇿' }
};

const translations = {
  en: {
    welcome: "Hello! I'm your order assistant. How can I help you place an order today?",
    helpOrder: "I can help you with that! Let me check our available products and current offers for you.",
    paymentPrompt: "Please choose your preferred payment method:",
    paymentSuccess: "Payment successful! Redirecting to your orders...",
    mpesaPrompt: "Please enter your M-Pesa phone number:",
    airtelPrompt: "Please enter your Airtel Money phone number:",
    cashConfirm: "Cash payment selected. Please have exact amount ready upon delivery.",
    placeOrder: "Place New Order",
    currentOffers: "Current Offers",
    trackOrder: "Track Order",
    newProducts: "New Products",
    chatTitle: "Order Assistant",
    chatSubtitle: "AI-powered ordering help",
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
    redirecting: "Redirecting to orders..."
  },
  sw: {
    welcome: "Habari! Mimi ni msaidizi wako wa kuagiza. Ninaweza kukusaidiaje kuagiza leo?",
    helpOrder: "Ninaweza kukusaidia na hilo! Nitaangalia bidhaa zetu zilizopo na ofa za sasa kwa ajili yako.",
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
    chatSubtitle: "Usaidizi wa kuagiza kwa umakini wa AI",
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
    redirecting: "Inaelekeza kwenye maagizo..."
  }
};

const ChatSidebar = ({ show, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [paymentStep, setPaymentStep] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: translations.en.welcome,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

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

  // Handle sending messages
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const userMessage = {
      id: chatMessages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate bot response based on message content
    setTimeout(() => {
      let botResponse = {
        id: chatMessages.length + 2,
        sender: 'bot',
        timestamp: new Date()
      };

      const lowerMessage = newMessage.toLowerCase();

      if (lowerMessage.includes('order') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
        setPaymentStep('select_method');
        botResponse.text = translations[selectedLanguage].paymentPrompt;
      } else if (lowerMessage.includes('offer') || lowerMessage.includes('discount')) {
        botResponse.text = translations[selectedLanguage].helpOrder;
      } else if (lowerMessage.includes('track') || lowerMessage.includes('delivery')) {
        botResponse.text = selectedLanguage === 'sw' 
          ? "Naweza kukusaidia kufuatilia agizo lako. Tafadhali toa kitambulisho cha agizo lako."
          : "I can help you track your order. Please provide your order ID.";
      } else if (lowerMessage.includes('product') || lowerMessage.includes('new')) {
        botResponse.text = translations[selectedLanguage].helpOrder;
      } else {
        botResponse.text = translations[selectedLanguage].helpOrder;
      }

      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    
    if (method === 'cash') {
      const cashMessage = {
        id: chatMessages.length + 1,
        text: translations[selectedLanguage].cashConfirm,
        sender: 'bot',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, cashMessage]);
      setPaymentStep('completed');
      
      // Simulate successful payment and redirect
      setTimeout(() => {
        setPaymentSuccess(true);
        setTimeout(() => {
          window.location.href = '/customer-dashboard/orders';
        }, 2000);
      }, 1500);
    } else {
      setPaymentStep('enter_phone');
      const phonePrompt = {
        id: chatMessages.length + 1,
        text: method === 'mpesa' 
          ? translations[selectedLanguage].mpesaPrompt 
          : translations[selectedLanguage].airtelPrompt,
        sender: 'bot',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, phonePrompt]);
    }
  };

  // Handle phone number submission
  const handlePhoneSubmit = () => {
    if (phoneNumber.trim() === '') return;

    const processingMessage = {
      id: chatMessages.length + 1,
      text: selectedLanguage === 'sw' 
        ? `Inachakata malipo ya ${paymentMethod} kwa nambari ${phoneNumber}...`
        : `Processing ${paymentMethod} payment for ${phoneNumber}...`,
      sender: 'bot',
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, processingMessage]);
    setPaymentStep('processing');

    // Simulate payment processing
    setTimeout(() => {
      const successMessage = {
        id: chatMessages.length + 2,
        text: translations[selectedLanguage].paymentSuccess,
        sender: 'bot',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, successMessage]);
      setPaymentStep('completed');
      setPaymentSuccess(true);

      // Redirect to orders page
      setTimeout(() => {
        window.location.href = '/customer-dashboard/orders';
      }, 2000);
    }, 3000);
  };

  // Quick action buttons for chat
  const quickActions = [
    { text: translations[selectedLanguage].placeOrder, trigger: "I'd like to place a new order" },
    { text: translations[selectedLanguage].currentOffers, trigger: "Show me current offers" },
    { text: translations[selectedLanguage].trackOrder, trigger: "Track my order status" },
    { text: translations[selectedLanguage].newProducts, trigger: "What are the new products?" }
  ];

  const handleQuickAction = (trigger) => {
    setNewMessage(trigger);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 z-40 flex flex-col">
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
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Payment Method Selection */}
        {paymentStep === 'select_method' && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">{translations[selectedLanguage].paymentMethods}</h4>
            <div className="space-y-2">
              <button
                onClick={() => handlePaymentMethodSelect('mpesa')}
                className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <FiPhone className="w-5 h-5 text-green-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">M-Pesa</div>
                  <div className="text-xs text-gray-500">
                    {selectedLanguage === 'sw' ? 'Malipo ya mkopo wa simu' : 'Mobile money payment'}
                  </div>
                </div>
              </button>
              <button
                onClick={() => handlePaymentMethodSelect('airtel')}
                className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
              >
                <FiPhone className="w-5 h-5 text-red-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Airtel Money</div>
                  <div className="text-xs text-gray-500">
                    {selectedLanguage === 'sw' ? 'Malipo ya mkopo wa simu' : 'Mobile money payment'}
                  </div>
                </div>
              </button>
              <button
                onClick={() => handlePaymentMethodSelect('cash')}
                className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <FiDollarSign className="w-5 h-5 text-blue-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">{translations[selectedLanguage].cash}</div>
                  <div className="text-xs text-gray-500">
                    {selectedLanguage === 'sw' ? 'Lipa wakati wa kufikishwa' : 'Pay when delivered'}
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Phone Number Input */}
        {paymentStep === 'enter_phone' && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              {paymentMethod === 'mpesa' 
                ? translations[selectedLanguage].mpesaPrompt 
                : translations[selectedLanguage].airtelPrompt}
            </h4>
            <div className="space-y-3">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={selectedLanguage === 'sw' ? "mfano: 255712345678" : "e.g., 255712345678"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => setPaymentStep(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  {translations[selectedLanguage].cancel}
                </button>
                <button
                  onClick={handlePhoneSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  {translations[selectedLanguage].processPayment}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Processing */}
        {paymentStep === 'processing' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mr-3"></div>
              <span className="text-yellow-800">
                {selectedLanguage === 'sw' ? 'Inachakata malipo...' : 'Processing payment...'}
              </span>
            </div>
          </div>
        )}

        {/* Payment Success */}
        {paymentSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <div className="font-medium text-green-800">{translations[selectedLanguage].success}</div>
                <div className="text-sm text-green-700">{translations[selectedLanguage].redirecting}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="grid grid-cols-2 gap-2 mb-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.trigger)}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              {action.text}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex space-x-2">
          <button
            onClick={toggleListening}
            className={`p-2 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isListening ? translations[selectedLanguage].listening : translations[selectedLanguage].startSpeaking}
          >
            {isListening ? <FiMicOff className="w-4 h-4" /> : <FiMic className="w-4 h-4" />}
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={translations[selectedLanguage].typeMessage}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {translations[selectedLanguage].send}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;