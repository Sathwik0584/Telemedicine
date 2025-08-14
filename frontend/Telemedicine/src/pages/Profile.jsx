// Entire updated code (assumes schemas you've provided)
import PatientMedicalHistory from './PatientMedicalHistory';
import React, { useState, useEffect } from "react";
import {
  Container, Typography, TextField, Button, Card, CardContent,
  CircularProgress, Avatar, Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const [profileImage, setProfileImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data);
          setFormData(data);
          setProfileImage(data.image);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      console.log(JSON.stringify({ formData }));
      const response = await fetch(`${BACKEND_URL}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.msg);
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const imgData = new FormData();
    imgData.append("file", file);
    imgData.append("upload_preset", "ml_default");

    setUploading(true);
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dtzqf0zz4/image/upload", {
        method: "POST",
        body: imgData,
      });

      const data = await res.json();

      // Save to state
      setProfileImage(data.secure_url);

      //  Update image field inside formData too
      setFormData(prev => ({
        ...prev,
        image: data.secure_url,
      }));
      // console.log(formData);
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };


  if (loading) return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 5, p: 4, textAlign: "center", boxShadow: 5, borderRadius: 3, bgcolor: "#f5f5f5" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
            Profile
          </Typography>
          <Stack direction="column" alignItems="center" spacing={1}>
            <Avatar
              src={profileImage !== '' ? profileImage : user?.gender === "Male" ? "https://www.w3schools.com/howto/img_avatar.png" : "https://www.w3schools.com/howto/img_avatar2.png"} // You can use any placeholder URL here
              alt={"Image"}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid #1976D2",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                mb: 1,
              }}
            />
          </Stack>

          <form onSubmit={handleUpdate} style={{ marginTop: "20px" }}>
            <label htmlFor="image-upload">
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} id="image-upload" />
              <Button variant="contained" component="span" startIcon={<PhotoCamera />} sx={{ mt: 2 }}>
                Upload Profile Picture
              </Button>
            </label>
            {uploading && <p style={{ marginTop: 10 }}>Uploading...</p>}

            <TextField
              label="Name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              variant="outlined"
            />

            <TextField
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              fullWidth
              disabled
              margin="normal"
              variant="outlined"
            />

            <TextField
              label="Gender"
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              variant="outlined"
            />

            {user?.role === "doctor" ? (
              <>
                <TextField
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization || ""}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                />

                <TextField
                  label="Experience"
                  name="experience"
                  value={formData.experience || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />

                <TextField
                  label="Clinic Address"
                  name="clinicAddress"
                  value={formData.clinicAddress || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />

                <TextField
                  label="Consultation Fee"
                  name="fee"
                  type="number"
                  value={formData.fee || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </>
            ) : (
              <>
                <TextField
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                />
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, borderRadius: 2, paddingY: 1.5, fontSize: "1rem", fontWeight: "bold" }}
            >
              Update Profile
            </Button>
          </form>
          <br></br>
          {user?.role === "patient" ? (
          <PatientMedicalHistory />):<></>}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
