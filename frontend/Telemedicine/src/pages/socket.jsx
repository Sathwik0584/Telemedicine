import io from 'socket.io-client';
// const socket = io('https://telemedicine-0i2m.onrender.com');
const socket = io(`${process.env.BACKEND_URL}`);
export default socket;