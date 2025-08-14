import io from 'socket.io-client';
// const socket = io('https://telemedicine-0i2m.onrender.com');
const socket = io('http://localhost:8080');
export default socket;