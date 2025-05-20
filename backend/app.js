// server.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require("body-parser");
require('dotenv').config();
require('./config/passport'); // Passport strategy setup
const http = require("http");
const socketIO = require("socket.io");
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const app = express();
const Message = require('./models/message');
const symptomCheckerRoutes = require("./routes/symptomCheckerRoutes");
const reviewRoutes = require('./routes/reviewRoutes');
const prescriptionRoutes = require("./routes/prescriptionRoutes.js");
const patientRoutes = require('./routes/patientRoutes.js');
const paymentRoutes = require("./routes/paymentRoutes.js");

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // Adjust for frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json({ limit: "10mb" })); // or higher if needed
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'Sathwik',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use("/api/symptom-checker", symptomCheckerRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/patients", patientRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/payment", paymentRoutes);


// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/Telemedicine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('------------MongoDB Connected -------------'))
  .catch(err => console.log(err));

server.listen(8080, () => console.log(`--------Server + Socket.IO running on port 8080-----`));

io.on('connection', (socket) => {
  console.log("✅ A user connected:", socket.id);

  // Appointment broadcasting
  socket.on("new-appointment", (appointment) => {
    io.emit("appointment-updated", appointment);
  });

  // Join room
  socket.on('joinRoom', async (appointmentId) => {
    socket.join(appointmentId);
    console.log(`🟢 User joined appointment room: ${appointmentId}`);

    // Send chat history
    const messages = await Message.find({ appointmentId }).sort({ timestamp: 1 });
    socket.emit('messageHistory', messages);
  });

  socket.on('signal', ({ appointmentId, signalData }) => {
    console.log(`📶 Relaying signal for appointment: ${appointmentId}`);
    socket.to(appointmentId).emit('signal', { signalData });
  });  

  // Receive message
  socket.on('sendMessage', async ({ appointmentId, message, sender }) => {
    console.log('📩 Message received:', { appointmentId, message, sender });

    const newMessage = await Message.create({ appointmentId, message, sender });

    // Send to everyone in the room
    io.to(appointmentId).emit('receiveMessage', newMessage);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

