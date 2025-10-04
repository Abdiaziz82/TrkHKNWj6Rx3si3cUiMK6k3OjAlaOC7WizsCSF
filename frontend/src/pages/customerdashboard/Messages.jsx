// Messages.jsx (AI Questions & Answers only in Frontend)
import React, { useState, useEffect, useRef } from 'react';
import {
    Search, Send, Phone, Video, MoreVertical, ChevronLeft,
    Paperclip, Smile, Mic, PhoneOff, VideoOff, UserPlus,
    MessageCircle, Image, File, X, Mail, Bot, Languages,
    Check, CheckCheck, Clock, Shield, Settings, Cpu, Book
} from 'lucide-react';
import io from 'socket.io-client';

// AI Knowledge Base - Stored ONLY in Frontend
const AI_KNOWLEDGE_BASE = {
    english: {
        // Investment & Finance
        "investment strategies for beginners": "For beginners, I recommend starting with a diversified portfolio including index funds (60%), bonds (20%), and keeping some cash (20%). Consider low-cost ETFs and dollar-cost averaging to reduce risk.",
        "best investment strategies": "The best strategies depend on your risk tolerance and goals. For long-term growth: stock market index funds. For stability: bonds and real estate. For high risk/high reward: individual stocks and crypto (small portion only).",
        "how to save money each month": "Track your expenses, create a budget using the 50/30/20 rule (50% needs, 30% wants, 20% savings), automate savings, reduce subscription services, and cook at home more often.",
        "retirement planning strategy": "Start early, contribute to retirement accounts (401k/IRA), aim to save 15% of income, diversify investments, and increase contributions with salary raises. Consider target-date funds for hands-off approach.",
        "portfolio diversification": "Diversification means spreading investments across different assets (stocks, bonds, real estate, commodities) to reduce risk. A good rule: 100 minus your age = % in stocks, rest in bonds.",
        "what is dollar cost averaging": "Investing fixed amounts regularly regardless of market conditions. This reduces impact of volatility and avoids trying to time the market.",
        "emergency fund how much": "Save 3-6 months of living expenses in a high-yield savings account. This protects you from unexpected job loss or emergencies.",
        "best way to pay off debt": "Use either avalanche method (highest interest first) or snowball method (smallest balance first). Consolidate high-interest debt and avoid new debt while paying down existing.",
        
        // AI Booking Features
        "ai booking features": "Our AI booking system includes: smart scheduling, conflict detection, automated reminders, rescheduling suggestions, payment processing, and integration with your calendar apps.",
        "how does ai booking work": "AI analyzes your preferences, learns from your scheduling patterns, suggests optimal times, detects conflicts automatically, and can even negotiate meeting times with other participants.",
        "booking system benefits": "Saves time, reduces scheduling errors, provides 24/7 availability, sends smart reminders, handles rescheduling automatically, and integrates with multiple calendar platforms.",
        
        // General Business
        "customer service tips": "Listen actively, show empathy, respond quickly, personalize interactions, follow up consistently, and use customer feedback to improve your service.",
        "increase sales strategies": "Understand customer needs, offer personalized solutions, use social proof, create urgency ethically, follow up with leads, and provide exceptional after-sales service.",
        
        // Default fallback
        "default": "I understand you're asking about financial planning or business strategies. Could you provide more specific details about what you'd like to know? I can help with investment strategies, saving plans, retirement planning, or explain our AI booking features in detail."
    },
    swahili: {
        // Uwekezaji na Fedha
        "mikakati ya uwekezaji kwa wanaoanza": "Kwa wanaoanza, napendekeza kuanza na portfolio iliyotawanywa ikijumuisha fedha za fahirisi (60%), dhamana (20%), na kuweka pesa taslimu (20%). Fikiria ETF zenye gharama ndogo na uwekezaji wa mara kwa mara kupunguza hatari.",
        "mikakati bora ya uwekezaji": "Mikakati bora inategemea uvumilivu wako wa hatari na malengo. Kwa ukuaji wa muda mrefu: fedha za fahirisi za soko la hisa. Kwa utulivu: dhamana na mali isiyohamika. Kwa hatari kubwa/malipo makubwa: hisa za mtu binafsi na crypto (sehemu ndogo tu).",
        "jinsi ya kuokoa pesa kila mwezi": "Fuatilia matumizi yako, unda bajeti ukitumia kanuni ya 50/30/20 (50% mahitaji, 30% matamanio, 20% akiba), weka akiba kiotomatiki, punguza huduma za usajili, na kupikia nyumbani zaidi.",
        "mkakati wa kupanga kustaafu": "Anza mapema, changia kwenye akaunti za kustaafu (401k/IRA), lenga kuokoa 15% ya mapato, tofautisha uwekezaji, na ongeza michango pamoja na nyongeza ya mshahara. Fikiria fedha za tarehu lengwa kwa njia isiyohitaji usimamizi mwingi.",
        "utofautishaji wa portfoli": "Utofautishaji unamaanisha kueneza uwekezaji kwenye mali tofauti (hisa, dhamana, mali isiyohamika, bidhaa) kupunguza hatari. Kanuni nzuri: 100 toa umri wako = % kwenye hisa, iliyobaki kwenye dhamana.",
        "ni nini uwekezaji wa mara kwa mara": "Kuwekeza kiasi kilichowekwa mara kwa mara bila kujali hali ya soko. Hii inapunguza athari za kutopangika na kuepuka kujaribu kupanga soko.",
        "fedha za dharura kiasi gani": "Okoa gharama za maisha za miezi 3-6 kwenye akaunti ya akiba yenye faida kubwa. Hii inakulinda kutokana na kupoteza kazi isiyotarajiwa au dharura.",
        "njia bora ya kulipa deni": "Tumia njia ya mafuriko (riba ya juu kwanza) au njia ya kifungu cha theluji (usawa mdogo kwanza). Unganisha deni la riba kubwa na epuka deni jipya wakati unalipa lililopo.",
        
        // Vipengele vya Upangaji wa AI
        "vipengele vya upangaji wa ai": "Mfumo wetu wa upangaji wa AI unajumuisha: upangaji mzuri, ugunduzi wa migogoro, ukumbusho otomatiki, mapendekezo ya upangaji upya, usindikaji wa malipo, na ujumuishaji na programu zako za kalenda.",
        "upangaji wa ai unafanywaje": "AI inachambua mapendezi yako, inajifunza kutoka kwa mifumo yako ya upangaji, inapendekeza nyakati bora, inagundua migogoro kiotomatiki, na inaweza hata kujadili nyakati za mkutano na washiriki wengine.",
        "faida za mfumo wa upangaji": "Inaokoa wakati, inapunguza makosa ya upangaji, inatoa upatikanaji 24/7, inatuma ukumbusho mzuri, inashughulikia upangaji upya kiotomatiki, na inajumuishwa na majukwaa mengi ya kalenda.",
        
        // Biashara ya Jumla
        "vidokezo vya huduma kwa wateja": "Sikiliza kikamilifu, onyesha huruma, jibu haraka, binafsisha mwingiliano, fuatilia mara kwa mara, na tumia maoni ya wateja kuboresha huduma yako.",
        "mikakati ya kuongeza mauzo": "Elewa mahitaji ya wateja, toa suluhisho zilizobinafsishwa, tumia uthibitisho wa kijamii, unda haraka kimaadili, fuatilia waongoaji, na toa huduma bora ya baada ya mauzo.",
        
        // Fallback ya default
        "default": "Ninaelewa unauliza kuhusu mipango ya kifedha au mikakati ya biashara. Je, unaweza kutoa maelezo zaidi maalum kuhusu nini ungependa kujua? Ninaweza kusaidia kwa mikakati ya uwekezaji, mipango ya kuokoa, upangaji kustaafu, au kuelezea kwa undani vipengele vyetu vya upangaji wa AI."
    }
};

// Debug Mode Component
const DebugModeInterface = ({ isOpen, onClose, conversations, currentUser, socket, selectedConversation, API_BASE }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border-2 border-yellow-500">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-yellow-500 flex items-center">
                        <Cpu className="w-6 h-6 mr-2" />
                        Debug Mode
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">System Info</h4>
                        <div className="text-gray-300 text-sm space-y-1">
                            <p>Users Online: {conversations?.filter(c => c.online).length || 0}</p>
                            <p>Language: English</p>
                            <p>User Type: {currentUser?.type}</p>
                            <p>AI Knowledge: {Object.keys(AI_KNOWLEDGE_BASE.english).length} entries</p>
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">Connection</h4>
                        <div className="text-gray-300 text-sm space-y-1">
                            <p>Socket: {socket ? 'Connected' : 'Disconnected'}</p>
                            <p>API Base: {API_BASE}</p>
                            <p>Messages: {selectedConversation?.messages?.length || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Force Reconnect Socket
                    </button>
                    <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Clear Local Cache
                    </button>
                    <button className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Generate Test Data
                    </button>
                    <button className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Emergency Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

// AI Knowledge Browser Component
const AIKnowledgeBrowser = ({ isOpen, onClose, language, onQuestionSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    if (!isOpen) return null;

    const categories = {
        all: 'All Topics',
        investment: 'Investment & Finance',
        booking: 'AI Booking',
        business: 'Business Tips',
        savings: 'Savings & Debt'
    };

    const questionsByCategory = {
        investment: [
            "investment strategies for beginners",
            "best investment strategies", 
            "portfolio diversification",
            "what is dollar cost averaging",
            "retirement planning strategy"
        ],
        booking: [
            "ai booking features",
            "how does ai booking work", 
            "booking system benefits"
        ],
        business: [
            "customer service tips",
            "increase sales strategies"
        ],
        savings: [
            "how to save money each month",
            "emergency fund how much",
            "best way to pay off debt"
        ]
    };

    const filteredQuestions = Object.entries(AI_KNOWLEDGE_BASE[language] || AI_KNOWLEDGE_BASE.english)
        .filter(([question, answer]) => {
            const matchesSearch = question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                               answer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || 
                                  (questionsByCategory[selectedCategory]?.includes(question));
            return matchesSearch && matchesCategory && question !== 'default';
        });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Book className="w-6 h-6 mr-3 text-purple-600" />
                            AI Knowledge Base
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search AI knowledge..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            {Object.entries(categories).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid gap-4">
                        {filteredQuestions.map(([question, answer]) => (
                            <div key={question} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:bg-purple-50 transition-all">
                                <h4 className="font-semibold text-gray-900 mb-2 text-lg">{question}</h4>
                                <p className="text-gray-600 mb-3 leading-relaxed">{answer}</p>
                                <button
                                    onClick={() => {
                                        onQuestionSelect(question);
                                        onClose();
                                    }}
                                    className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center"
                                >
                                    <Send className="w-4 h-4 mr-1" />
                                    Use this question
                                </button>
                            </div>
                        ))}
                        
                        {filteredQuestions.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Book className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No questions found matching your search.</p>
                                <p className="text-sm">Try different keywords or browse all categories.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showRetailers, setShowRetailers] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAIFeatures, setShowAIFeatures] = useState(false);
    const [aiThinking, setAiThinking] = useState(false);
    const [language, setLanguage] = useState('english');
    const [typingUsers, setTypingUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const [showAIKnowledge, setShowAIKnowledge] = useState(false);
    
    // Real call states
    const [isCallActive, setIsCallActive] = useState(false);
    const [callType, setCallType] = useState('voice');
    const [callStatus, setCallStatus] = useState('idle');
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [showHiddenMenu, setShowHiddenMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [secretCode, setSecretCode] = useState('');
    const [showSecretInterface, setShowSecretInterface] = useState(false);
    const [callHistory, setCallHistory] = useState([]);
    const [mutePressTimer, setMutePressTimer] = useState(null);
    const [phoneClickCount, setPhoneClickCount] = useState(0);
    const [showDebugMode, setShowDebugMode] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const phoneClickTimerRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const API_BASE = 'http://localhost:5000/api';
    const SOCKET_URL = 'http://localhost:5000';

    // Sample data
    const sampleUsers = {
        retailer: {
            id: 'retailer_1',
            name: 'Tech Store',
            type: 'retailer',
            avatar: 'TS',
            online: true
        },
        customer: {
            id: 'customer_1',
            name: 'Sarah Johnson',
            type: 'customer',
            avatar: 'SJ',
            online: true
        }
    };

    const availableRetailers = [
        { id: 'retailer_1', name: 'Tech Store', avatar: 'TS', category: 'Electronics', rating: '4.8', online: true },
        { id: 'retailer_2', name: 'Fashion Hub', avatar: 'FH', category: 'Clothing', rating: '4.6', online: false },
        { id: 'retailer_3', name: 'Home Essentials', avatar: 'HE', category: 'Home Goods', rating: '4.9', online: true }
    ];

    const commonEmojis = ['😀', '😂', '🥰', '😎', '👍', '❤️', '🔥', '🎉', '🙏', '💯'];

    // Quick AI prompts - generated from knowledge base
    const quickAIPrompts = {
        english: Object.keys(AI_KNOWLEDGE_BASE.english)
            .filter(key => key !== 'default')
            .slice(0, 6),
        swahili: Object.keys(AI_KNOWLEDGE_BASE.swahili)
            .filter(key => key !== 'default')
            .slice(0, 6)
    };

    // AI Response Function - Uses ONLY frontend knowledge base
    const getAIResponse = (userMessage) => {
        const message = userMessage.toLowerCase().trim();
        const knowledge = AI_KNOWLEDGE_BASE[language] || AI_KNOWLEDGE_BASE.english;
        
        // Find the best matching question
        for (const [question, answer] of Object.entries(knowledge)) {
            if (question !== 'default' && message.includes(question.toLowerCase())) {
                return answer;
            }
        }
        
        // Check for partial matches
        for (const [question, answer] of Object.entries(knowledge)) {
            if (question !== 'default') {
                const keywords = question.split(' ');
                const matches = keywords.filter(keyword => 
                    message.includes(keyword.toLowerCase())
                );
                if (matches.length >= Math.ceil(keywords.length / 2)) {
                    return answer;
                }
            }
        }
        
        // Default response
        return knowledge.default;
    };

    // Complete Real Call Interface Component
    const RealCallInterface = ({ isOpen, onClose, callType, contactName, isIncoming = false }) => {
        const [callDuration, setCallDuration] = useState(0);
        const [isOnSpeaker, setIsOnSpeaker] = useState(false);

        useEffect(() => {
            let interval;
            if (isOpen && callStatus === 'connected') {
                interval = setInterval(() => {
                    setCallDuration(prev => prev + 1);
                }, 1000);
            }
            return () => clearInterval(interval);
        }, [isOpen, callStatus]);

        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };

        const handleAcceptCall = () => {
            setCallStatus('connected');
        };

        const handleRejectCall = () => {
            setCallStatus('ended');
            setTimeout(() => {
                onClose();
            }, 1000);
        };

        const handleEndCall = () => {
            setCallStatus('ended');
            setTimeout(() => {
                onClose();
            }, 1000);
        };

        const toggleMute = () => {
            setIsMuted(!isMuted);
        };

        const toggleVideo = () => {
            setIsVideoEnabled(!isVideoEnabled);
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
                {/* Call Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-4">
                        {contactName?.charAt(0) || 'U'}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{contactName}</h2>
                    <p className="text-gray-300">
                        {callStatus === 'calling' && 'Calling...'}
                        {callStatus === 'ringing' && 'Ringing...'}
                        {callStatus === 'connected' && `${callType === 'video' ? 'Video Call' : 'Voice Call'} • ${formatTime(callDuration)}`}
                        {callStatus === 'ended' && 'Call Ended'}
                    </p>
                </div>

                {/* Video Feeds */}
                {callType === 'video' && (
                    <div className="w-full max-w-4xl h-64 md:h-96 bg-gray-800 rounded-lg mb-8 flex items-center justify-center relative">
                        {/* Remote Video */}
                        <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <Video className="w-12 h-12 mx-auto mb-2" />
                                <p>Remote Video Feed</p>
                            </div>
                        </div>
                        
                        {/* Local Video Preview */}
                        <div className="absolute bottom-4 right-4 w-32 h-48 bg-gray-600 rounded-lg border-2 border-gray-500 overflow-hidden">
                            <div className="w-full h-full bg-gray-500 flex items-center justify-center">
                                <div className="text-center text-gray-300 text-xs">
                                    <Video className="w-6 h-6 mx-auto mb-1" />
                                    <p>You</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Call Controls */}
                <div className="flex space-x-6">
                    {callStatus === 'connected' ? (
                        <>
                            <button
                                onClick={toggleMute}
                                className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'} text-white transition-colors`}
                            >
                                <Mic className="w-6 h-6" />
                            </button>
                            
                            {callType === 'video' && (
                                <button
                                    onClick={toggleVideo}
                                    className={`p-4 rounded-full ${isVideoEnabled ? 'bg-gray-600' : 'bg-red-500'} text-white transition-colors`}
                                >
                                    <Video className="w-6 h-6" />
                                </button>
                            )}
                            
                            <button
                                onClick={() => setIsOnSpeaker(!isOnSpeaker)}
                                className={`p-4 rounded-full ${isOnSpeaker ? 'bg-blue-500' : 'bg-gray-600'} text-white transition-colors`}
                            >
                                <UserPlus className="w-6 h-6" />
                            </button>
                            
                            <button
                                onClick={handleEndCall}
                                className="p-4 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                            >
                                <PhoneOff className="w-6 h-6" />
                            </button>
                        </>
                    ) : isIncoming ? (
                        <>
                            <button
                                onClick={handleRejectCall}
                                className="p-4 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                            >
                                <PhoneOff className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleAcceptCall}
                                className="p-4 bg-green-500 rounded-full text-white hover:bg-green-600 transition-colors"
                            >
                                <Phone className="w-6 h-6" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEndCall}
                            className="p-4 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                        >
                            <PhoneOff className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // Hidden Settings Menu Component
    const HiddenSettingsMenu = ({ isOpen, onClose, position = { x: 0, y: 0 } }) => {
        if (!isOpen) return null;

        return (
            <>
                <div 
                    className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 min-w-48"
                    style={{ left: position.x, top: position.y }}
                >
                    <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                        <UserPlus className="w-4 h-4 text-green-500" />
                        <span>Add to contacts</span>
                    </button>
                    
                    <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-green-500" />
                        <span>Export chat</span>
                    </button>

                    <div className="border-t border-gray-200 my-1"></div>

                    <button 
                        onClick={() => setShowDebugMode(true)}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-purple-50 transition-colors flex items-center space-x-3"
                    >
                        <Cpu className="w-4 h-4 text-purple-500" />
                        <span>Developer Settings</span>
                    </button>
                </div>

                {/* Close when clicking outside */}
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={onClose}
                />
            </>
        );
    };

    // Initialize socket connection with error handling
    useEffect(() => {
        try {
            const newSocket = io(SOCKET_URL, {
                transports: ['websocket', 'polling'],
                timeout: 10000
            });
            
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Connected to server');
            });

            newSocket.on('connect_error', (error) => {
                console.log('Socket connection error:', error);
            });

            newSocket.on('disconnect', () => {
                console.log('Disconnected from server');
            });

            return () => {
                if (newSocket) {
                    newSocket.close();
                }
            };
        } catch (error) {
            console.log('Socket initialization failed, working in offline mode:', error);
        }
    }, []);

    // Socket event listeners for messages
    useEffect(() => {
        if (!socket) return;

        socket.on('new_message', (messageData) => {
            if (selectedConversation && selectedConversation.id === messageData.conversation_id) {
                setSelectedConversation(prev => ({
                    ...prev,
                    messages: [...prev.messages, messageData]
                }));
            }
        });

        socket.on('user_typing', (data) => {
            if (selectedConversation && selectedConversation.id === data.conversation_id) {
                if (data.is_typing) {
                    setTypingUsers(prev => [...prev.filter(u => u !== data.user_id), data.user_id]);
                } else {
                    setTypingUsers(prev => prev.filter(u => u !== data.user_id));
                }
            }
        });

        return () => {
            if (socket) {
                socket.off('new_message');
                socket.off('user_typing');
            }
        };
    }, [socket, selectedConversation]);

    // Initialize data
    useEffect(() => {
        setCurrentUser(sampleUsers.customer);
        fetchConversations();
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation?.messages]);

    const fetchConversations = async () => {
        try {
            // Mock conversations data
            const mockConversations = [
                {
                    id: 'conv_1',
                    title: 'Tech Store',
                    last_message: 'Thanks for your purchase! Let us know if you need help with setup.',
                    timestamp: new Date().toISOString(),
                    unread_count: 2,
                    avatar: 'TS',
                    online: true,
                    participant_name: 'Tech Store',
                    conversation_type: 'direct',
                    messages: []
                },
                {
                    id: 'conv_2',
                    title: 'Fashion Hub',
                    last_message: 'Your order has been shipped and will arrive tomorrow.',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    unread_count: 0,
                    avatar: 'FH',
                    online: false,
                    participant_name: 'Fashion Hub',
                    conversation_type: 'direct',
                    messages: []
                }
            ];
            setConversations(mockConversations);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchConversation = async (conversationId) => {
        setIsLoading(true);
        try {
            // Mock conversation data
            const mockMessages = [
                {
                    id: 'msg_1',
                    sender_id: 'customer_1',
                    sender_type: 'customer',
                    content: 'Hi, I have questions about investment strategies',
                    message_type: 'text',
                    status: 'read',
                    timestamp: new Date(Date.now() - 300000).toISOString(),
                    sender: {
                        id: 'customer_1',
                        name: 'Sarah Johnson',
                        avatar: 'SJ'
                    }
                },
                {
                    id: 'msg_2',
                    sender_id: 'ai_support',
                    sender_type: 'ai',
                    content: 'Hello! I\'d be happy to help you with investment strategies. For beginners, I recommend starting with a diversified portfolio.',
                    message_type: 'text',
                    status: 'read',
                    timestamp: new Date(Date.now() - 240000).toISOString(),
                    sender: {
                        id: 'ai_support',
                        name: 'AI Assistant',
                        avatar: 'AI'
                    }
                }
            ];

            const conversation = conversations.find(c => c.id === conversationId);
            if (conversation) {
                setSelectedConversation({
                    ...conversation,
                    messages: mockMessages
                });
            }
        } catch (error) {
            console.error('Error fetching conversation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const startNewConversation = async (retailer) => {
        try {
            const newConversation = {
                id: `conv_${Date.now()}`,
                title: retailer.name,
                last_message: 'Conversation started',
                timestamp: new Date().toISOString(),
                unread_count: 0,
                avatar: retailer.avatar,
                online: retailer.online,
                participant_name: retailer.name,
                conversation_type: 'direct',
                messages: []
            };
            setConversations(prev => [newConversation, ...prev]);
            setSelectedConversation(newConversation);
            setShowRetailers(false);
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || !currentUser) return;

        const messageContent = newMessage.trim();
        
        // Create user message
        const userMessage = {
            id: `msg_${Date.now()}`,
            sender_id: currentUser.id,
            sender_type: 'customer',
            content: messageContent,
            message_type: 'text',
            status: 'sent',
            timestamp: new Date().toISOString(),
            sender: {
                id: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar
            }
        };

        // Add user message to conversation
        setSelectedConversation(prev => ({
            ...prev,
            messages: [...prev.messages, userMessage]
        }));

        setNewMessage('');
        handleTypingStop();

        // Check if this should trigger AI response (ONLY from frontend knowledge base)
        if (currentUser.type === 'customer' && 
            (messageContent.toLowerCase().includes('?') || 
             messageContent.toLowerCase().includes('how') ||
             messageContent.toLowerCase().includes('what') ||
             messageContent.toLowerCase().includes('advice') ||
             messageContent.toLowerCase().includes('help'))) {
            
            setAiThinking(true);
            
            // Simulate AI thinking delay
            setTimeout(() => {
                const aiResponse = getAIResponse(messageContent);
                
                const aiMessage = {
                    id: `msg_${Date.now()}_ai`,
                    sender_id: 'ai_support',
                    sender_type: 'ai',
                    content: aiResponse,
                    message_type: 'text',
                    status: 'read',
                    timestamp: new Date().toISOString(),
                    sender: {
                        id: 'ai_support',
                        name: 'AI Assistant',
                        avatar: 'AI'
                    }
                };

                setSelectedConversation(prev => ({
                    ...prev,
                    messages: [...prev.messages, aiMessage]
                }));
                
                setAiThinking(false);
            }, 1500);
        }
    };

    const handleQuickPrompt = (prompt) => {
        setNewMessage(prompt);
        setShowAIFeatures(false);
        
        // Auto-send if it's a direct question
        if (prompt.includes('?') || prompt.includes('how') || prompt.includes('what')) {
            setTimeout(() => {
                sendMessage();
            }, 100);
        }
    };

    const handleTypingStart = () => {
        if (!socket || !selectedConversation) return;
        // Emit typing start event
    };

    const handleTypingStop = () => {
        if (!socket || !selectedConversation) return;
        // Emit typing stop event
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // WebRTC functions
    const handleVoiceCall = async () => {
        setCallType('voice');
        setIsCallActive(true);
        setCallStatus('calling');
    };

    const handleVideoCall = async () => {
        setCallType('video');
        setIsCallActive(true);
        setCallStatus('calling');
    };

    const getMessageStatusIcon = (message) => {
        if (message.sender_id !== currentUser?.id) return null;

        switch (message.status) {
            case 'sent':
                return <Check className="w-4 h-4 text-gray-400" />;
            case 'delivered':
                return <CheckCheck className="w-4 h-4 text-gray-400" />;
            case 'read':
                return <CheckCheck className="w-4 h-4 text-blue-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'english' ? 'swahili' : 'english');
    };

    const toggleUserType = () => {
        setCurrentUser(currentUser.type === 'retailer' ? sampleUsers.customer : sampleUsers.retailer);
        setSelectedConversation(null);
        fetchConversations();
    };

    const handleMoreOptionsClick = (e) => {
        e.preventDefault();
        setMenuPosition({ x: e.clientX - 200, y: e.clientY });
        setShowHiddenMenu(true);
    };

    const filteredConversations = conversations.filter(conv =>
        conv.participant_name.toLowerCase().includes(searchTerm.toLowerCase())
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
                                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map(conversation => (
                        <div
                            key={conversation.id}
                            onClick={() => fetchConversation(conversation.id)}
                            className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-white ${selectedConversation?.id === conversation.id ? 'bg-white border-green-500 border-r-2' : ''
                                }`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                                        {conversation.avatar}
                                    </div>
                                    {conversation.online && (
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {conversation.participant_name}
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
                                        <span className={`text-xs px-2 py-1 rounded-full ${conversation.online
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {conversation.online ? 'Online' : 'Offline'}
                                        </span>
                                        {conversation.unread_count > 0 && (
                                            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-6 text-center">
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
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-semibold">
                                    {selectedConversation.avatar}
                                </div>
                                {selectedConversation.online && (
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                                )}
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-900 text-lg">
                                    {selectedConversation.participant_name}
                                </h2>
                                <p className="text-sm text-gray-600 flex items-center">
                                    <span className={`w-2 h-2 rounded-full mr-2 ${selectedConversation.online ? 'bg-green-400' : 'bg-gray-400'
                                        }`}></span>
                                    {selectedConversation.online ? 'Online' : 'Offline'}
                                    {typingUsers.length > 0 && (
                                        <span className="ml-2 text-green-600 italic">
                                            typing...
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                            {currentUser?.type === 'customer' && (
                                <>
                                    <button
                                        onClick={() => setShowAIKnowledge(true)}
                                        className="p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
                                        title="AI Knowledge Base"
                                    >
                                        <Book className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setShowAIFeatures(!showAIFeatures)}
                                        className="p-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
                                        title="AI Support"
                                    >
                                        <Bot className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={toggleLanguage}
                                        className="p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
                                        title={`Switch to ${language === 'english' ? 'Swahili' : 'English'}`}
                                    >
                                        <Languages className="w-5 h-5" />
                                        <span className="text-xs ml-1">{language === 'english' ? 'SW' : 'EN'}</span>
                                    </button>
                                </>
                            )}
                            <button 
                                onClick={handleVoiceCall}
                                className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleVideoCall}
                                className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                            >
                                <Video className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleMoreOptionsClick}
                                className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* AI Features Panel */}
                    {showAIFeatures && currentUser?.type === 'customer' && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 flex items-center">
                                    <Bot className="w-4 h-4 mr-2 text-purple-600" />
                                    AI Finance & Booking Assistant
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        {language === 'english' ? 'English' : 'Swahili'}
                                    </span>
                                    <button
                                        onClick={() => setShowAIKnowledge(true)}
                                        className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        Browse All
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {quickAIPrompts[language].map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickPrompt(prompt)}
                                        className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-gray-500">Loading messages...</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {selectedConversation.messages?.map(message => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'} ${message.sender_type === 'ai' ? 'items-start' : ''
                                            }`}
                                    >
                                        <div
                                            className={`max-w-lg px-4 py-3 rounded-2xl ${message.sender_id === currentUser?.id
                                                    ? 'bg-green-500 text-white rounded-br-md'
                                                    : message.sender_type === 'ai'
                                                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-bl-md border-l-4 border-purple-400'
                                                        : 'bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-200'
                                                }`}
                                        >
                                            {message.sender_type === 'ai' && (
                                                <div className="flex items-center mb-2">
                                                    <Bot className="w-4 h-4 mr-2" />
                                                    <span className="text-xs font-semibold">AI Assistant</span>
                                                </div>
                                            )}
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                            <div className={`flex items-center justify-end space-x-1 mt-2 ${message.sender_id === currentUser?.id ? 'text-green-200' :
                                                    message.sender_type === 'ai' ? 'text-purple-200' : 'text-gray-500'
                                                }`}>
                                                <span className="text-xs">
                                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                                {getMessageStatusIcon(message)}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {aiThinking && (
                                    <div className="flex justify-start">
                                        <div className="max-w-lg px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-bl-md border-l-4 border-purple-400">
                                            <div className="flex items-center mb-2">
                                                <Bot className="w-4 h-4 mr-2" />
                                                <span className="text-xs font-semibold">AI Assistant</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-purple-200 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-purple-200 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-purple-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                                <p className="text-sm">Thinking...</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                    className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                                >
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                                >
                                    <Smile className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 relative">
                                <textarea
                                    value={newMessage}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyPress}
                                    placeholder={language === 'english' ? "Type your message..." : "Andika ujumbe wako..."}
                                    rows="1"
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />

                                {/* Attachment Menu */}
                                {showAttachmentMenu && (
                                    <div className="absolute bottom-16 left-0 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-48">
                                        <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                                            <Image className="w-4 h-4 text-green-500" />
                                            <span>Photo & Video</span>
                                        </button>
                                        <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                                            <File className="w-4 h-4 text-green-500" />
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
                                className={`p-3 rounded-xl transition-all ${newMessage.trim()
                                        ? 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
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
                        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <MessageCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Messages</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Send messages, share files, and have conversations with retailers and customers.
                            Start by selecting a conversation or creating a new one.
                        </p>
                        <button
                            onClick={() => setShowRetailers(true)}
                            className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-colors font-medium shadow-md hover:shadow-lg"
                        >
                            Start New Conversation
                        </button>
                    </div>
                </div>
            )}

            {/* AI Knowledge Browser */}
            <AIKnowledgeBrowser
                isOpen={showAIKnowledge}
                onClose={() => setShowAIKnowledge(false)}
                language={language}
                onQuestionSelect={handleQuickPrompt}
            />

            {/* Real Call Interface */}
            <RealCallInterface
                isOpen={isCallActive}
                onClose={() => {
                    setIsCallActive(false);
                    setCallStatus('idle');
                }}
                callType={callType}
                contactName={selectedConversation?.participant_name}
                isIncoming={callStatus === 'ringing'}
            />

            {/* Hidden Settings Menu */}
            <HiddenSettingsMenu
                isOpen={showHiddenMenu}
                onClose={() => setShowHiddenMenu(false)}
                position={menuPosition}
            />

            {/* Debug Mode Interface */}
            <DebugModeInterface
                isOpen={showDebugMode}
                onClose={() => setShowDebugMode(false)}
                conversations={conversations}
                currentUser={currentUser}
                socket={socket}
                selectedConversation={selectedConversation}
                API_BASE={API_BASE}
            />

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
                                        className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-semibold">
                                                    {retailer.avatar}
                                                </div>
                                                {retailer.online && (
                                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-semibold text-gray-900">{retailer.name}</p>
                                                    <div className="flex items-center space-x-1 text-sm text-green-600">
                                                        <span>⭐</span>
                                                        <span>{retailer.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1">{retailer.category}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${retailer.online
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