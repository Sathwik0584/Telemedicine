// import React, { useEffect, useState } from 'react';
// import { TextField, Button, Box, Typography, Paper } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import io from 'socket.io-client';

// const socket = io('http://localhost:8080'); // Your backend URL

// const ChatBox = ({ appointmentId, sender }) => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     console.log("🧠 useEffect triggered in ChatBox:", appointmentId);

//     const handleMessageHistory = (history) => {
//       console.log("📜 Received message history:", history);
//       setMessages(history);
//     };

//     const handleNewMessage = (data) => {
//       setMessages((prev) => [...prev, data]);
//     };

//     socket.on('messageHistory', handleMessageHistory);
//     socket.on('receiveMessage', handleNewMessage);

//     socket.emit('joinRoom', appointmentId);

//     return () => {
//       socket.off('messageHistory', handleMessageHistory);
//       socket.off('receiveMessage', handleNewMessage);
//     };
//   }, [appointmentId]);

//   const handleSend = () => {
//     if (message.trim()) {
//       const newMsg = {
//         appointmentId,
//         message,
//         sender,
//       };

//       console.log('Sending message:', { appointmentId, message, sender });
//       socket.emit('sendMessage', newMsg);
//       setMessage('');
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '450px' }}>
//       {/* Messages Box */}
//       <Box
//         sx={{
//           flex: 1,
//           overflowY: 'auto',
//           mb: 2,
//           border: '1px solid #e0e0e0',
//           borderRadius: 1,
//           p: 1,
//           bgcolor: '#f5f5f5',
//         }}
//       >
//         {messages.length === 0 ? (
//           <Typography variant="body2" color="text.secondary">
//             No messages yet.
//           </Typography>
//         ) : (
//           messages.map((msg, i) => {
//             const isOwnMessage = msg.sender === sender;
//             return (
//               <Box
//                 key={i}
//                 sx={{
//                   display: 'flex',
//                   justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
//                   mb: 1,
//                 }}
//               >
//                 <Paper
//                   elevation={2}
//                   sx={{
//                     px:5,
//                     py: 1.2,
//                     maxWidth: '70%',
//                     bgcolor: isOwnMessage ? '#1976d2' : '#e0e0e0',
//                     color: isOwnMessage ? '#fff' : '#000',
//                     borderRadius: 2,
//                   }}
//                 >
//                   <Typography variant="body2">{msg.message}</Typography>
//                 </Paper>
//               </Box>
//             );
//           })
//         )}
//       </Box>

//       {/* Input Box */}
//       <Box sx={{ display: 'flex', gap: 1 }}>
//         <TextField
//           fullWidth
//           size="small"
//           variant="outlined"
//           placeholder="Type your message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyPress={(e) => {
//             if (e.key === 'Enter') handleSend();
//           }}
//         />
//         <Button variant="contained" endIcon={<SendIcon />} onClick={handleSend}>
//           Send
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default ChatBox;


// //video call
// import React, { useEffect, useRef, useState } from 'react';
// import Peer from 'simple-peer';
// import { Box, Button, IconButton, MenuItem, FormControl, Select } from '@mui/material';
// import FullscreenIcon from '@mui/icons-material/Fullscreen';
// import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
// import MicOffIcon from '@mui/icons-material/MicOff';
// import MicIcon from '@mui/icons-material/Mic';
// import VideocamOffIcon from '@mui/icons-material/VideocamOff';
// import VideocamIcon from '@mui/icons-material/Videocam';
// import CallEndIcon from '@mui/icons-material/CallEnd';

// const VideoCall = ({ socket, appointmentId, userRole }) => {
//   const myVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const videoContainerRef = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [peer, setPeer] = useState(null);
//   const [callStarted, setCallStarted] = useState(false);
//   const [micOn, setMicOn] = useState(true);
//   const [cameraOn, setCameraOn] = useState(true);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [videoDevices, setVideoDevices] = useState([]);
//   const [selectedDevice, setSelectedDevice] = useState('');

//   const toggleMic = () => {
//     if (stream) {
//       stream.getAudioTracks().forEach(track => track.enabled = !micOn);
//       setMicOn(prev => !prev);
//     }
//   };

//   const toggleCamera = () => {
//     if (stream) {
//       stream.getVideoTracks().forEach(track => track.enabled = !cameraOn);
//       setCameraOn(prev => !prev);
//     }
//   };

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       videoContainerRef.current.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setIsFullscreen(false);
//     }
//   };

//   const endCall = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//     if (peer) {
//       peer.destroy();
//       setPeer(null);
//     }
//     setCallStarted(false);
//   };

//   const getCameras = async () => {
//     const devices = await navigator.mediaDevices.enumerateDevices();
//     const videoInputs = devices.filter(device => device.kind === 'videoinput');
//     setVideoDevices(videoInputs);
//     if (videoInputs.length > 0) {
//       setSelectedDevice(videoInputs[0].deviceId);
//     }
//   };

//   const startCall = async () => {
//     if (!socket || !selectedDevice) {
//       console.error('❌ Socket or device not ready');
//       return;
//     }
//     try {
//       const currentStream = await navigator.mediaDevices.getUserMedia({
//         video: { deviceId: selectedDevice },
//         audio: true,
//       });
//       setStream(currentStream);

//       const newPeer = new Peer({ initiator: userRole === 'doctor', trickle: false, stream: currentStream });

//       newPeer.on('signal', data => {
//         socket.emit('signal', { appointmentId, signalData: data });
//       });

//       newPeer.on('stream', remoteStream => {
//         if (remoteVideoRef.current) {
//           remoteVideoRef.current.srcObject = remoteStream;
//           remoteVideoRef.current.onloadedmetadata = () => {
//             remoteVideoRef.current.play().catch(e => console.error("🔴 Remote play error:", e));
//           };
//         }
//       });

//       socket.on('signal', ({ signalData }) => {
//         newPeer.signal(signalData);
//       });

//       setPeer(newPeer);
//       setCallStarted(true);

//       setTimeout(() => {
//         if (myVideoRef.current) {
//           myVideoRef.current.srcObject = currentStream;
//           myVideoRef.current.onloadedmetadata = () => {
//             myVideoRef.current.play().catch(e => console.error("🔴 Play error:", e));
//           };
//         }
//       }, 500);

//     } catch (err) {
//       console.error('❌ Error accessing media devices.', err);
//     }
//   };

//   useEffect(() => {
//     getCameras();
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//       }
//       if (peer) {
//         peer.destroy();
//       }
//     };
//   }, [stream, peer]);

//   return (
//     <Box ref={videoContainerRef} sx={{ width: '100%', height: '100dvh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#000' }}>
//       {!callStarted ? (
//         <Box display="flex" flexDirection="column" gap={2} alignItems="center">
//           <FormControl sx={{ minWidth: 240 }}>
//             <Select
//               value={selectedDevice}
//               onChange={(e) => setSelectedDevice(e.target.value)}
//               displayEmpty
//               sx={{ bgcolor: '#fff' }}
//             >
//               {videoDevices.map(device => (
//                 <MenuItem key={device.deviceId} value={device.deviceId}>{device.label || 'Unnamed Camera'}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <Button variant="contained" size="large" onClick={startCall}>Start Video Call</Button>
//         </Box>
//       ) : (
//         <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
//           <video
//             ref={myVideoRef}
//             muted
//             autoPlay
//             playsInline
//             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//           />
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             style={{ width: 300, height: 200, position: 'absolute', bottom: 20, right: 20, borderRadius: 8, border: '2px solid white' }}
//           />
//           <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 1 }}>
//             <IconButton onClick={toggleFullscreen} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
//               {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
//             </IconButton>
//             <IconButton onClick={toggleMic} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
//               {micOn ? <MicIcon /> : <MicOffIcon />}
//             </IconButton>
//             <IconButton onClick={toggleCamera} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
//               {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
//             </IconButton>
//             <IconButton onClick={endCall} sx={{ bgcolor: 'red', color: '#fff' }}>
//               <CallEndIcon />
//             </IconButton>
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default VideoCall;

// //
