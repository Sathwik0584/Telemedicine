import io from 'socket.io-client';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// const socket = io('https://telemedicine-0i2m.onrender.com');
const socket = io(`${BACKEND_URL}`);
export default socket;