const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, phone, address } = req.body;
    const userId = await User.create(username, email, password,phone, address);
    res.status(201).json({ id: userId, message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email,password,phone,address } = req.body;
    const updatedRows = await User.update(req.params.id, username, email,password, phone,address);
    if (!updatedRows) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedRows = await User.delete(req.params.id);
    if (!deletedRows) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//
const getUserByToken = async (req, res) => {
  try {
    console.log("📢 User ID from token:", req.user.user_id); // Kiểm tra user_id từ token

    const user = await User.getById(req.user.user_id);
    console.log("🔎 User found:", user); // Kiểm tra user lấy từ DB

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      phone: user.phone,
      address: user.address,
    });
  } catch (error) {
    console.error("❌ Error in getUserByToken:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateUserByToken = async (req, res) => {
  try {
    console.log("📥 Received request to update user by token");
    console.log("📌 Decoded user from token:", req.user);
    console.log("📌 Request body:", req.body);

    const { username, phone, address, currentPassword, newPassword } = req.body;
    const userId = req.user.user_id;

    // Lấy user từ database
    const user = await User.getById(userId);
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("👤 Existing user data:", user);

    let updatedPassword = user.password; // Giữ nguyên mật khẩu nếu không đổi

    // Nếu user muốn đổi mật khẩu, kiểm tra mật khẩu cũ
    if (currentPassword && newPassword) {
      console.log("🔑 User is changing password");

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        console.log("❌ Current password is incorrect");
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      updatedPassword = await bcrypt.hash(newPassword, 10);
      console.log("✅ New hashed password set");
    }

    // Chuẩn bị dữ liệu cập nhật (không có email)
    const updatedUser = {
      username: username?.trim() || user.username || null,
      phone: phone?.trim() || user.phone || null,
      address: address?.trim() || user.address || null,
      password: updatedPassword || user.password || null,
    };

    // Thực hiện cập nhật vào database
    const result = await User.update(userId, updatedUser);

    if (!result || typeof result.affectedRows === "undefined") {
      console.log("❌ Update function did not return a valid result");
      return res.status(500).json({ message: "Unexpected error during update" });
    }

    if (result.affectedRows === 0) {
      console.log("❌ Update failed, no rows affected");
      return res.status(400).json({ message: "No changes made" });
    }

    console.log("✅ User updated successfully:", updatedUser);
    res.json({ message: "User updated successfully" });

  } catch (error) {
    console.error("❌ Error updating user by token:", error);
    res.status(500).json({ error: error.message });
  }
};

//dang ky
const register = async (req, res) => {
  try {
    const { username, email, password, phone, address } = req.body;

    const existingUser = await User.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userID = await User.create(username, email, hashedPassword, phone, address);

    res.status(201).json({ success: true, id: userID, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//dang nhap
const login=async(req, res)=>{
  try {
    const {email, password}=req.body;
    //kiem tra ton tai user
    const user=await User.getByEmail(email);
    if(!user){
      return res.status(400).json({message:"Invalid email or password"});
    }
    //kiem tra password
    const isMatch=await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message:"Invalid email or password"})
    }

    //Tao JWT Token
    const token=jwt.sign({user_id: user.user_id, email: user.email}, process.env.JWT_SECRET, {expiresIn:"1h"});
    res.json({token, user:{id: user.user_id, username: user.username, email:user.email,address: user.address,   // cần thêm field này
      phone: user.phone }});
  } catch (error) {
    res.status(500).json({error:error.message});
  }
}


module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, register, login,getUserByToken, updateUserByToken };
