import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Fab,
  Drawer,
  Avatar,
  Divider,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Stack,
  Tooltip,
  Zoom,
  Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import TuneIcon from '@mui/icons-material/Tune';
import LanguageIcon from '@mui/icons-material/Language';
import { sendChatMessage, getSupportedChatModels } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';

// Predefined conversation starters by language
const getConversationStarters = (languageCode) => {
  switch (languageCode) {
    case 'es':
      return [
        "¿Qué formatos de archivo puedo convertir?",
        "¿Cómo convierto un PDF a DOCX?",
        "¿Están seguros mis datos durante la conversión?",
        "¿Puedo convertir varios archivos a la vez?",
        "¿Cuál es el tamaño máximo de archivo para la conversión?"
      ];
    case 'fr':
      return [
        "Quels formats de fichiers puis-je convertir ?",
        "Comment convertir un PDF en DOCX ?",
        "Mes données sont-elles sécurisées pendant la conversion ?",
        "Puis-je convertir plusieurs fichiers à la fois ?",
        "Quelle est la taille maximale de fichier pour la conversion ?"
      ];
    case 'de':
      return [
        "Welche Dateiformate kann ich konvertieren?",
        "Wie konvertiere ich eine PDF in DOCX?",
        "Sind meine Daten während der Konvertierung sicher?",
        "Kann ich mehrere Dateien auf einmal konvertieren?",
        "Was ist die maximale Dateigröße für die Konvertierung?"
      ];
    default:
      return [
        "What file formats can I convert?",
        "How do I convert a PDF to DOCX?",
        "Is my data secure during conversion?",
        "Can I batch convert multiple files?",
        "What's the maximum file size for conversion?"
      ];
  }
};

// Supported languages
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' }
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your Format Conversion Assistant powered by Groq AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatModels, setChatModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Fetch available models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const models = await getSupportedChatModels();
        if (models && models.length > 0) {
          setChatModels(models);
          // Try to set the preferred model if available
          const preferredModel = "llama-3.3-70b-versatile";
          if (models.includes(preferredModel)) {
            setSelectedModel(preferredModel);
          } else {
            setSelectedModel(models[0]); // Default to first model
          }
        } else {
          // Handle empty models array
          console.warn("No models returned from the API");
          setChatModels(['llama-3.3-70b-versatile']); // Set the preferred model
          setSelectedModel('llama-3.3-70b-versatile');
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        // Set default models in case of error
        setChatModels(['llama-3.3-70b-versatile']);
        setSelectedModel('llama-3.3-70b-versatile');
        
        // Update messages with error notification
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            role: 'assistant', 
            content: 'I encountered an issue connecting to the chat service. Some features may be limited.' 
          }
        ]);
      }
    };
    
    fetchModels();
  }, []);
  
  // Effect to update welcome message when language changes
  useEffect(() => {
    // Only update if there's exactly one message (the initial welcome)
    if (messages.length === 1 && messages[0].role === 'assistant') {
      let welcomeMessage = 'Hello! I\'m your Format Conversion Assistant powered by Groq AI. How can I help you today?';
      
      // Change welcome message based on selected language
      switch (language) {
        case 'es':
          welcomeMessage = '¡Hola! Soy tu Asistente de Conversión de Formatos potenciado por Groq AI. ¿Cómo puedo ayudarte hoy?';
          break;
        case 'fr':
          welcomeMessage = 'Bonjour ! Je suis votre Assistant de Conversion de Format propulsé par Groq AI. Comment puis-je vous aider aujourd\'hui ?';
          break;
        case 'de':
          welcomeMessage = 'Hallo! Ich bin Ihr Format-Konvertierungs-Assistent, unterstützt durch Groq AI. Wie kann ich Ihnen heute helfen?';
          break;
        case 'it':
          welcomeMessage = 'Ciao! Sono il tuo Assistente di Conversione Formato alimentato da Groq AI. Come posso aiutarti oggi?';
          break;
        case 'pt':
          welcomeMessage = 'Olá! Sou seu Assistente de Conversão de Formato com tecnologia Groq AI. Como posso ajudá-lo hoje?';
          break;
        case 'ru':
          welcomeMessage = 'Привет! Я ваш Ассистент по Конвертации Форматов на базе Groq AI. Чем я могу помочь вам сегодня?';
          break;
        case 'zh':
          welcomeMessage = '你好！我是由 Groq AI 提供支持的格式转换助手。今天我能帮您什么忙？';
          break;
        case 'ja':
          welcomeMessage = 'こんにちは！Groq AIを搭載したフォーマット変換アシスタントです。今日はどのようにお手伝いしましょうか？';
          break;
        case 'ko':
          welcomeMessage = '안녕하세요! Groq AI 기반의 형식 변환 도우미입니다. 오늘 어떻게 도와드릴까요?';
          break;
        case 'ar':
          welcomeMessage = 'مرحبًا! أنا مساعد تحويل التنسيق المدعوم من Groq AI. كيف يمكنني مساعدتك اليوم؟';
          break;
        case 'hi':
          welcomeMessage = 'नमस्ते! मैं Groq AI द्वारा संचालित आपका फॉर्मेट रूपांतरण सहायक हूँ। आज मैं आपकी कैसे सहायता कर सकता हूँ?';
          break;
        default:
          // English is the default
          break;
      }
      
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
    }
  }, [language]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleDrawer = () => {
    setOpen(!open);
    if (!open) {
      // Reset settings panel
      setShowSettings(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Prepare conversation history
      const messageHistory = [
        // System message with language instruction
        { 
          role: 'system', 
          content: `You are a helpful assistant for a file format conversion website. Help users understand how to convert files, what formats are supported, and provide advice about file conversions. Please respond in ${languages.find(l => l.code === language)?.name || 'English'}. Be friendly, concise, and helpful.` 
        },
        // Previous messages
        ...messages,
        // New user message
        userMessage
      ];
      
      // Send to API with timeout
      const response = await Promise.race([
        sendChatMessage(messageHistory, {
          temperature,
          model: selectedModel,
          max_tokens: 1024
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), 30000)
        )
      ]);
      
      // Add assistant response
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: response.response }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      // Handle different types of errors
      let errorMessage = 'Sorry, I encountered an unexpected error. Please try again later.';
      
      // Translate error messages based on selected language
      if (language !== 'en') {
        // Basic error translations for common errors
        if (error.message === 'Request timed out') {
          switch(language) {
            case 'es': errorMessage = 'La solicitud tardó demasiado. Inténtalo de nuevo o envía un mensaje más corto.'; break;
            case 'fr': errorMessage = 'La requête a pris trop de temps. Veuillez réessayer ou utilisez un message plus court.'; break;
            case 'de': errorMessage = 'Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es erneut oder verwenden Sie eine kürzere Nachricht.'; break;
            default: errorMessage = 'The request took too long to process. Please try again or use a shorter message.';
          }
        } else if (error.message.includes('Network Error') || error.message.includes('connection')) {
          switch(language) {
            case 'es': errorMessage = 'Parece que hay un problema de conexión. Por favor, revisa tu conexión a internet e inténtalo de nuevo.'; break;
            case 'fr': errorMessage = 'Il semble y avoir un problème de réseau. Veuillez vérifier votre connexion Internet et réessayer.'; break;
            case 'de': errorMessage = 'Es scheint ein Netzwerkproblem zu geben. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.'; break;
            default: errorMessage = 'There seems to be a network issue. Please check your internet connection and try again.';
          }
        } else if (error.message.includes('service unavailable') || error.message.includes('503')) {
          switch(language) {
            case 'es': errorMessage = 'El servicio de chat no está disponible en este momento. Por favor, inténtalo más tarde.'; break;
            case 'fr': errorMessage = 'Le service de chat est actuellement indisponible. Veuillez réessayer plus tard.'; break;
            case 'de': errorMessage = 'Der Chat-Dienst ist derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.'; break;
            default: errorMessage = 'The chat service is currently unavailable. Please try again later.';
          }
        } else {
          switch(language) {
            case 'es': errorMessage = 'Lo siento, he encontrado un error inesperado. Por favor, inténtalo de nuevo más tarde.'; break;
            case 'fr': errorMessage = 'Désolé, j\'ai rencontré une erreur inattendue. Veuillez réessayer plus tard.'; break;
            case 'de': errorMessage = 'Entschuldigung, ich bin auf einen unerwarteten Fehler gestoßen. Bitte versuchen Sie es später erneut.'; break;
            default: errorMessage = 'Sorry, I encountered an unexpected error. Please try again later.';
          }
        }
      } else {
        if (error.message === 'Request timed out') {
          errorMessage = 'The request took too long to process. Please try again or use a shorter message.';
        } else if (error.message.includes('Network Error') || error.message.includes('connection')) {
          errorMessage = 'There seems to be a network issue. Please check your internet connection and try again.';
        } else if (error.message.includes('service unavailable') || error.message.includes('503')) {
          errorMessage = 'The chat service is currently unavailable. Please try again later.';
        }
      }
      
      // Add error message
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: errorMessage }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleStarterClick = (starter) => {
    setInput(starter);
  };
  
  // Render individual message
  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    
    return (
      <Box 
        key={index}
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          mb: 2,
          alignItems: 'flex-start',
        }}
      >
        <Avatar
          sx={{
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            width: 36,
            height: 36,
            mr: isUser ? 0 : 1,
            ml: isUser ? 1 : 0,
          }}
        >
          {isUser ? <PersonIcon /> : <SmartToyIcon />}
        </Avatar>
        
        <Paper
          elevation={1}
          sx={{
            p: 2,
            maxWidth: '75%',
            borderRadius: 2,
            bgcolor: isUser ? 'primary.light' : 'grey.100',
            borderTopLeftRadius: isUser ? 2 : 0,
            borderTopRightRadius: isUser ? 0 : 2,
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.content}
          </Typography>
        </Paper>
      </Box>
    );
  };
  
  // Conversation starters based on current language
  const conversationStarters = getConversationStarters(language);
  
  // Get placeholder text based on language
  const getPlaceholderText = () => {
    switch (language) {
      case 'es': return 'Escribe tu mensaje...';
      case 'fr': return 'Tapez votre message...';
      case 'de': return 'Geben Sie Ihre Nachricht ein...';
      case 'it': return 'Scrivi il tuo messaggio...';
      case 'pt': return 'Digite sua mensagem...';
      case 'ru': return 'Введите ваше сообщение...';
      case 'zh': return '输入您的消息...';
      case 'ja': return 'メッセージを入力してください...';
      case 'ko': return '메시지를 입력하세요...';
      case 'ar': return 'اكتب رسالتك...';
      case 'hi': return 'अपना संदेश लिखें...';
      default: return 'Type your message...';
    }
  };
  
  return (
    <>
      {/* Chat button */}
      <Tooltip title="Chat with AI Assistant" placement="left">
        <Fab
          color="primary"
          aria-label="chat"
          onClick={toggleDrawer}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <ChatIcon />
        </Fab>
      </Tooltip>
      
      {/* Chat drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            height: '100%',
          },
        }}
      >
        {/* Chat header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SmartToyIcon sx={{ mr: 1 }} />
            <Box>
              <Typography variant="h6">Format Conversion Assistant</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <LanguageIcon sx={{ fontSize: 14, mr: 0.5 }} />
                <Typography variant="caption">
                  {languages.find(l => l.code === language)?.name || 'English'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <IconButton 
              color="inherit" 
              onClick={() => setShowSettings(!showSettings)}
              size="small"
              sx={{ mr: 1 }}
            >
              <TuneIcon />
            </IconButton>
            <IconButton color="inherit" onClick={toggleDrawer} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        
        {/* Settings panel */}
        <Zoom in={showSettings}>
          <Box
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: 'grey.100',
              display: showSettings ? 'block' : 'none',
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Chat Settings
            </Typography>
            
            {/* Language Selection */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id="language-select-label">Language</InputLabel>
              <Select
                labelId="language-select-label"
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
                startAdornment={<LanguageIcon sx={{ mr: 1, ml: -0.5, fontSize: 20, color: 'action.active' }} />}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Model Selection */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id="model-select-label">AI Model</InputLabel>
              <Select
                labelId="model-select-label"
                value={selectedModel}
                label="AI Model"
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {chatModels.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">Response Creativity:</Typography>
              <Stack direction="row" spacing={1}>
                {[0.3, 0.5, 0.7, 0.9].map((value) => (
                  <Paper
                    key={value}
                    elevation={0}
                    onClick={() => setTemperature(value)}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      cursor: 'pointer',
                      bgcolor: temperature === value ? 'primary.main' : 'grey.200',
                      color: temperature === value ? 'white' : 'text.primary',
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: temperature === value ? 600 : 400,
                    }}
                  >
                    {value === 0.3
                      ? 'Precise'
                      : value === 0.5
                      ? 'Balanced'
                      : value === 0.7
                      ? 'Creative'
                      : 'Inventive'}
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Box>
        </Zoom>
        
        <Divider />
        
        {/* Messages area */}
        <Box
          sx={{
            p: 2,
            flexGrow: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            height: showSettings ? 'calc(100% - 280px)' : 'calc(100% - 144px)',
          }}
        >
          {messages.map(renderMessage)}
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>
        
        {/* Conversation starters */}
        {messages.length <= 2 && !currentUser && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              {language === 'es' ? 'Prueba a preguntar:' :
               language === 'fr' ? 'Essayez de demander:' :
               language === 'de' ? 'Versuchen Sie zu fragen:' :
               language === 'it' ? 'Prova a chiedere:' :
               language === 'pt' ? 'Tente perguntar:' :
               language === 'ru' ? 'Попробуйте спросить:' :
               language === 'zh' ? '尝试询问:' :
               language === 'ja' ? '質問してみてください:' :
               language === 'ko' ? '질문해 보세요:' :
               language === 'ar' ? 'حاول أن تسأل:' :
               language === 'hi' ? 'पूछने का प्रयास करें:' :
               'Try asking:'}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {conversationStarters.map((starter, index) => (
                <Chip
                  key={index}
                  label={starter}
                  onClick={() => handleStarterClick(starter)}
                  sx={{ 
                    my: 0.5, 
                    cursor: 'pointer',
                    bgcolor: 'grey.100'
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
        
        <Divider />
        
        {/* Input area */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={getPlaceholderText()}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={4}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px',
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={loading || input.trim() === ''}
              sx={{ ml: 1 }}
            >
              {loading ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1, textAlign: 'center' }}
          >
            Powered by Groq AI
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};

export default ChatBot; 