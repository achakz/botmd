//src/components/ChatBot.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  CssBaseline, Box, AppBar, Toolbar, Typography, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, TextField, IconButton,
  Select, MenuItem, FormControl, Divider, Paper, Link
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  AddCircleOutline, History, Send, VolumeUp, VolumeOff, ChatBubbleOutline
} from "@mui/icons-material";
import MessageBubble from "./MessageBubble";
import { speak } from "./TTSPlayer";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  createChatSession,
  getUserChatSessions,
  addChatMessage,
  getMessagesBySession,
} from "../services/api";
import axios from "axios";
import { Logout } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import { deleteChatSession } from "../services/api";


const drawerWidth = 280;

const BotMDLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 7L12 12L22 7" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 12V22" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
    primary: {
      main: '#2f81f7',
    },
    text: {
      primary: '#c9d1d9',
      secondary: '#8b949e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 500,
    }
  },
});

const TypingIndicator = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
    <Box sx={{
      height: 8, width: 8, backgroundColor: 'grey.600', borderRadius: '50%',
      animation: 'wave 1.3s linear infinite',
      '&:nth-of-type(2)': { animationDelay: '-1.1s' },
      '&:nth-of-type(3)': { animationDelay: '-0.9s' },
      '@keyframes wave': { '0%, 60%, 100%': { transform: 'initial' }, '30%': { transform: 'translateY(-8px)' } }
    }} />
    <Box sx={{
      height: 8, width: 8, backgroundColor: 'grey.600', borderRadius: '50%', ml: 0.5,
      animation: 'wave 1.3s linear infinite',
      '&:nth-of-type(2)': { animationDelay: '-1.1s' },
      '&:nth-of-type(3)': { animationDelay: '-0.9s' },
      '@keyframes wave': { '0%, 60%, 100%': { transform: 'initial' }, '30%': { transform: 'translateY(-8px)' } }
    }} />
    <Box sx={{
      height: 8, width: 8, backgroundColor: 'grey.600', borderRadius: '50%', ml: 0.5,
      animation: 'wave 1.3s linear infinite',
      '&:nth-of-type(2)': { animationDelay: '-1.1s' },
      '&:nth-of-type(3)': { animationDelay: '-0.9s' },
      '@keyframes wave': { '0%, 60%, 100%': { transform: 'initial' }, '30%': { transform: 'translateY(-8px)' } }
    }} />
  </Box>
);


const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ttsEnabled, setTTSEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [mode, setMode] = useState("predict");
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);


  useEffect(() => {
    if (!user?.token) return;

    let isMounted = true; // ✅ Prevents re-trigger from StrictMode
    let hasInitialized = false;

    const init = async () => {
      if (!isMounted || hasInitialized) return;
      hasInitialized = true;

      try {
        const sessions = await getUserChatSessions(user.token);
        setChatSessions(sessions);

        if (sessions.length > 0) {
          const lastSession = sessions[0];
          await handleSessionClick(lastSession._id);
        } else {
          console.log("🟦 No sessions found, creating default one...");
          const newSession = await createChatSession(user.token, "New Chat Session");
          if (isMounted) {
            setSessionId(newSession._id);
            setMessages([]);
            setChatSessions([newSession]);
          }
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      }
    };

    init();

    return () => {
      isMounted = false; // ✅ prevents duplicate firing when component unmounts/remounts
    };
  }, [user?.token]);


  const handleSessionClick = async (id) => {
    setSessionId(id);
    setMessages([]);
    const msgs = await getMessagesBySession(user.token, id);
    setMessages(msgs);
  };

  const handleSend = async () => {
    if (!input.trim() || !sessionId) return;
    const userMessage = { sender: "user", content: input, mode };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    await addChatMessage(user.token, { ...userMessage, sessionId });
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { message: input, mode },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      let botContent;
      if (mode === "predict") {
        botContent = res.data.humanized_response;
        if (ttsEnabled) speak(botContent);
      } else {
        botContent = res.data.chat_response;
        if (ttsEnabled) speak(res.data.chat_response);
      }
      const botMessage = { sender: "bot", content: botContent, mode };
      setMessages((prev) => [...prev, botMessage]);
      await addChatMessage(user.token, { ...botMessage, sessionId });
    } catch (err) {
      const errorMsg = err.response?.data?.error || "An error occurred.";
      const botMessage = { sender: "bot", content: `❌ ${errorMsg}`, mode };
      setMessages((prev) => [...prev, botMessage]);
      await addChatMessage(user.token, { ...botMessage, sessionId });
    }
    setLoading(false);
  };

  const handleNewChat = async () => {
    if (isCreatingSession) return;
    setIsCreatingSession(true);

    try {
      console.log("🟩 Creating a new chat session...");
      const newSession = await createChatSession(user.token, "New Chat Session");
      setSessionId(newSession._id);
      setMessages([]);
      const sessions = await getUserChatSessions(user.token);
      setChatSessions(sessions);
    } catch (error) {
      console.error("Failed to create new chat session:", error);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this chat session?")) return;

    try {
      await deleteChatSession(user.token, id);
      const updatedSessions = chatSessions.filter((s) => s._id !== id);
      setChatSessions(updatedSessions);

      if (sessionId === id) {
        // if the deleted session was active, reset to first available or none
        if (updatedSessions.length > 0) {
          await handleSessionClick(updatedSessions[0]._id);
        } else {
          setSessionId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Failed to delete chat session. Please try again.");
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const drawerContent = (
    <Box sx={{ backgroundColor: '#0d1117', height: '100%' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', p: 2, mb: 1 }}>
        <BotMDLogo />
        <Link component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography sx={{ fontFamily: '"Oswald", "sans-serif"', fontWeight: 600, fontSize: '2.25rem' }}>
            &nbsp;BotMD
          </Typography>
        </Link>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <Box sx={{ p: 1 }}>
        <ListItemButton onClick={handleNewChat} sx={{ borderRadius: '8px', m: 1 }}>
          <ListItemIcon><AddCircleOutline /></ListItemIcon>
          <ListItemText primary="New Chat" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/history")} sx={{ borderRadius: '8px', m: 1 }}>
          <ListItemIcon><History /></ListItemIcon>
          <ListItemText primary="View History" />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            localStorage.removeItem("user"); // or call logout() from context
            navigate("/login");
            window.location.reload(); // optional clean refresh
          }}
          sx={{ borderRadius: '8px', m: 1 }}
        >
          <ListItemIcon><Logout /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List sx={{ p: 1 }}>
        {chatSessions.map((session) => (
          <ListItem key={session._id} disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering session click
                  handleDeleteSession(session._id);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            }
          >
            <ListItemButton
              selected={sessionId === session._id}
              onClick={() => handleSessionClick(session._id)}
              sx={{ borderRadius: '8px', mb: 0.5 }}
            >
              <ListItemIcon><ChatBubbleOutline fontSize="small" /></ListItemIcon>
              <ListItemText
                primary={session.title}
                primaryTypographyProps={{ fontWeight: 500, noWrap: true }}
                secondary={new Date(session.createdAt).toLocaleDateString()}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            background: 'linear-gradient(90deg, #161b22 0%, #0d1117 100%)',
            borderBottom: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.12)',
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Chat Session
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth, flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', borderRight: '1px solid rgba(255, 255, 255, 0.12)' },
          }}
          variant="permanent" anchor="left"
        >
          {drawerContent}
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, height: '100vh', display: 'flex', flexDirection: 'column' }}
        >
          <Toolbar />
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} from={msg.sender} text={msg.content} />
            ))}
            {loading && <MessageBubble from="bot" text={<TypingIndicator />} />}
            <div ref={messagesEndRef} />
          </Box>
          <Paper
            elevation={0}
            sx={{
              p: 1, display: 'flex', alignItems: 'center', mt: 1,
              backgroundColor: '#161b22',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px'
            }}
          >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select value={mode} onChange={(e) => setMode(e.target.value)} size="small">
                <MenuItem value="predict">Prediction</MenuItem>
                <MenuItem value="chat">Chat</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth variant="outlined"
              placeholder="Enter your symptoms or message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              multiline maxRows={4}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: '10px' } }}
            />
            <IconButton onClick={() => setTTSEnabled((prev) => !prev)}>
              {ttsEnabled ? <VolumeUp /> : <VolumeOff />}
            </IconButton>
            <IconButton onClick={handleSend} disabled={loading || !input.trim()} color="primary">
              <Send />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ChatBot;