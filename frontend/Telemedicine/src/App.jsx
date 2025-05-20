import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Appointments from "./pages/Appointments";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import SymptomCheckerPage from "./pages/SymptomChecker";
import DoctorProfile from "./pages/DoctorProfile";
import ConsultationRoom from "./pages/ConsultationRoom";
import ReviewFormPage from "./pages/ReviewForm";
import AppointmentSummary from "./pages/AppointmentSummary";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/consultation/:appointmentId" element={<ConsultationRoom />} />
        <Route path="/review/:appointmentId" element={<ReviewFormPage />} />
        <Route path="/appointment-summary" element={<AppointmentSummary />} />
       {/* // <Route path="/symptom-checker" element={<SymptomCheckerPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
