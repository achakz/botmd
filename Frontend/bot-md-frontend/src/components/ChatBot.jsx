import React, { useState, useEffect, useRef } from "react";
import {
  CssBaseline, Box, AppBar, Toolbar, Typography, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, TextField, IconButton,
  Select, MenuItem, FormControl, Divider, Paper
} from "@mui/material";
import {
  AddCircleOutline, History, Send, VolumeUp, VolumeOff, ChatBubbleOutline
} from "@mui/icons-material";
import MessageBubble from "./MessageBubble";
import { speak } from "./TTSPlayer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  createChatSession,
  getUserChatSessions,
  addChatMessage,
  getMessagesBySession,
} from "../services/api";
import axios from "axios";

const drawerWidth = 280;

const TypingIndicator = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
    <Box sx={{
      height: 8,
      width: 8,
      backgroundColor: 'grey.500',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'wave 1.3s linear infinite',
      '&:nth-of-type(2)': { animationDelay: '-1.1s' },
      '&:nth-of-type(3)': { animationDelay: '-0.9s' },
      '@keyframes wave': { '0%, 60%, 100%': { transform: 'initial' }, '30%': { transform: 'translateY(-8px)' } }
    }} />
    <Box sx={{
      height: 8,
      width: 8,
      backgroundColor: 'grey.500',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'wave 1.3s linear infinite',
      '&:nth-of-type(2)': { animationDelay: '-1.1s' },
      '&:nth-of-type(3)': { animationDelay: '-0.9s' },
      '@keyframes wave': { '0%, 60%, 100%': { transform: 'initial' }, '30%': { transform: 'translateY(-8px)' } },
      ml: 0.5
    }} />
    <Box sx={{
      height: 8,
      width: 8,
      backgroundColor: 'grey.500',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'wave 1.3s linear infinite',
      '&:nth-of-type(2)': { animationDelay: '-1.1s' },
      '&:nth-of-type(3)': { animationDelay: '-0.9s' },
      '@keyframes wave': { '0%, 60%, 100%': { transform: 'initial' }, '30%': { transform: 'translateY(-8px)' } },
      ml: 0.5
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);


  useEffect(() => {
    const init = async () => {
      if (!user?.token) return;
      try {
        const sessions = await getUserChatSessions(user.token);
        setChatSessions(sessions);
        if (sessions.length > 0) {
          const lastSession = sessions[0];
          await handleSessionClick(lastSession._id);
        } else {
          await handleNewChat();
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      }
    };
    init();
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
    try {
      const newSession = await createChatSession(user.token, "New Chat Session");
      setSessionId(newSession._id);
      setMessages([]);
      const sessions = await getUserChatSessions(user.token);
      setChatSessions(sessions);
    } catch (error) {
      console.error("Failed to create new chat session:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const drawerContent = (
    <div>
      <Toolbar />
      <Box sx={{ p: 2 }}>
        <ListItemButton onClick={handleNewChat}>
          <ListItemIcon>
            <AddCircleOutline />
          </ListItemIcon>
          <ListItemText primary="New Chat" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/history")}>
          <ListItemIcon>
            <History />
          </ListItemIcon>
          <ListItemText primary="View History" />
        </ListItemButton>
      </Box>
      <Divider />
      <List>
        {chatSessions.map((session) => (
          <ListItem key={session._id} disablePadding>
            <ListItemButton
              selected={sessionId === session._id}
              onClick={() => handleSessionClick(session._id)}
            >
              <ListItemIcon>
                <ChatBubbleOutline />
              </ListItemIcon>
              <ListItemText
                primary={session.title}
                secondary={new Date(session.createdAt).toLocaleDateString()}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            BotMD
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {drawerContent}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
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
          elevation={3}
          sx={{ p: 1, display: 'flex', alignItems: 'center', mt: 1 }}
        >
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              size="small"
            >
              <MenuItem value="predict">Prediction</MenuItem>
              <MenuItem value="chat">Chat</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter your symptoms or message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            multiline
            maxRows={4}
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
  );
};

export default ChatBot;