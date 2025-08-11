import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatBox = ({ appointmentId, sender,socket }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleMessageHistory = (history) => {
      setMessages(history);
    };

    const handleNewMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on('messageHistory', handleMessageHistory);
    socket.on('receiveMessage', handleNewMessage);
    socket.emit('joinRoom', appointmentId);

    return () => {
      socket.off('messageHistory', handleMessageHistory);
      socket.off('receiveMessage', handleNewMessage);
    };
  }, [appointmentId]);

  useEffect(() => {
    // Auto-scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      const newMsg = {
        appointmentId,
        message,
        sender,
        timestamp: new Date().toISOString(), // Add timestamp on send
      };

      socket.emit('sendMessage', newMsg);
      setMessage('');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
      {/* Messages Box */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          mb: 2,
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          p: 1,
          bgcolor: '#f5f5f5',
        }}
      >
        {messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No messages yet.
          </Typography>
        ) : (
          messages.map((msg, i) => {
            const isOwnMessage = msg.sender === sender;
            return (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    px: 1.5,
                    py: 1,
                    maxWidth: '70%',
                    bgcolor: isOwnMessage ? '#1976d2' : '#e0e0e0',
                    color: isOwnMessage ? '#fff' : '#000',
                    borderRadius: 2,
                    wordWrap: 'break-word',     // breaks long words
                    overflowWrap: 'break-word', // wraps at word boundary
                    whiteSpace: 'pre-wrap',     // preserves line breaks and wraps
                  }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                  {msg.timestamp && (
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem', opacity: 0.7 }}
                    >
                      {formatTimestamp(msg.timestamp)}
                    </Typography>
                  )}
                </Paper>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Box */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // avoid new line
              handleSend();
            }
          }}
          multiline
          maxRows={4}
        />
        <Button variant="contained" endIcon={<SendIcon />} onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
