const { Admin } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "30d" });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const adminExists = await Admin.findOne({ username });
    if (adminExists) return res.status(400).json({ message: "Admin already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({ username: username || email, email: email || username, password: hashedPassword });
    if (admin) {
      res.status(201).json({ id: admin._id, username: admin.username, email: admin.email, token: generateToken(admin._id) });
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const usernameInput = req.body.username || req.body.email;
    const { password } = req.body;
    
    const admin = await Admin.findOne({ username: usernameInput });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({ id: admin._id, username: admin.username, email: admin.email, role: 'admin', token: generateToken(admin._id) });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserProfile = async (req, res) => {
    const admin = await Admin.findById(req.user.id);
    if(admin) {
        res.json({ id: admin._id, username: admin.username, role: 'admin' });
    } else {
        res.status(404).json({ message: 'Admin not found' });
    }
}

module.exports = { registerUser, loginUser, getUserProfile };