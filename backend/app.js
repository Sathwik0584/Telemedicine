if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

// server.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require("body-parser");
require('./config/passport'); // Passport strategy setup
const http = require("http");
const socketIO = require("socket.io");
const profileRoutes = require('./routes/profile.js');
const userRoutes = require('./routes/user');
const appointmentRoutes = require("./routes/appointment.js");
const doctorRoutes = require("./routes/doctor.js");
const app = express();
const Message = require('./models/message');
const reviewRoutes = require('./routes/review.js');
const prescriptionRoutes = require("./routes/prescription.js");
const patientRoutes = require('./routes/patient.js');
const paymentRoutes = require("./routes/payment.js");
const dbUrl = process.env.ATLASDB_URL;

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

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 *3600,
  crypto: {
    secret:process.env.SECRET,
  },
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

app.use(session({
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/user', userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/patients", patientRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/payment", paymentRoutes);


// Database Connection
mongoose.connect(dbUrl, {
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

