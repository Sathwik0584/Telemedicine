const Doctor = require("../models/doctor"); // Import User model
const Patient = require("../models/patient");

module.exports.getProfile = async (req, res) => {
  const { id, role } = req.user;

  try {
    const Model = role === "doctor" ? Doctor : Patient;
    const user = await Model.findOne({ _id: id }).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports.updateProfile = async (req, res) => {
  const { id, role } = req.user;

  // Expecting direct flat object (not nested in "formData")
  const updateData = { ...req.body };
  console.log("Incoming update data:", updateData);

  try {
    // Choose model based on role
    const Model = role === "doctor" ? Doctor : Patient;

    // Prevent updating sensitive fields
    delete updateData.email;
    delete updateData.password;

    // Perform update
    const updatedUser = await Model.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    console.log("Updated user:", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};