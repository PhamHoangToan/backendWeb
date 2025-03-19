const db = require("../config/db");

const User = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM users");
    return rows;
  },

  getById: async (user_id) => {
    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [user_id]);
    return rows[0];
  },

  getByEmail: async(email)=>{
    const [rows]=await db.query("SELECT * FROM users WHERE email=?", [email]);
    return rows[0];
  },

  create: async (username, email, password, phone, address) => {
    const [result] = await db.query(
      "INSERT INTO users (username, email, password, phone, address) VALUES (?, ?, ?, ? , ?)",
      [username, email, password,phone, address]
    );
    return result.insertId;
  },

  update: async (id, username, email,password, phone, address) => {
    const [result] = await db.query(
      "UPDATE users SET username = ?, email = ?,password=?, phone=?, address=? WHERE user_id = ?",
      [username, email,password,phone,address, id]
    );
    return result.affectedRows;
  },

  delete: async (user_id) => {
    const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [user_id]);
    return result.affectedRows;
  },
};

module.exports = User;
