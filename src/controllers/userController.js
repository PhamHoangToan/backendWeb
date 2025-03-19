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


module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, register, login };
