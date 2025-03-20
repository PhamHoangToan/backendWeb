const { text } = require("stream/consumers");
const db = require("../config/db");
const transporter = require("../config/email");
const crypto = require("crypto");
const { error } = require("console");
const nodemailer = require("nodemailer");

const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(400).json({ success: false, message: "Email không tồn tại" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Mật khẩu sai" });
    }

    // Tạo JWT token (chứa user_id)
    const token = jwt.sign(
      { user_id: user.user_id }, // payload
      'SECRET_KEY',              // secret key
      { expiresIn: '1d' }        // hết hạn token
    );

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token: token, // gửi token về
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Kiểm tra xem email có tồn tại trong database không
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: "Email not found" });
        }

        // Tạo mã xác thực ngẫu nhiên (6 số)
        const resetCode = Math.floor(100000 + Math.random() * 900000);
        const resetExpire = new Date(Date.now() + 15 * 60 * 1000); // Hết hạn sau 15 phút

        await db.query("UPDATE users SET reset_code = ?, reset_expire = ? WHERE email = ?", [resetCode, resetExpire, email]);

        // Cấu hình SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Gửi email
        await transporter.sendMail({
            from: `"Support Team" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Password Reset Code",
            text: `Your password reset code is: ${resetCode}. It will expire in 15 minutes.`,
        });

        res.json({ success: true, message: "Reset code sent to email" });

    } catch (error) {
        res.status(500).json({ error: "Failed to send email", details: error.message });
    }
};

const resetPassword=async(req, res)=>{
    const {email, otp, newPassword}=req.body;

    const [user] = await db.query("SELECT * FROM users WHERE email = ? AND reset_code = ?", [email, otp]);
    if (user.length === 0 || Date.now() > user[0].reset_expire) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE users SET password = ?, reset_code = NULL, reset_expire = NULL WHERE email = ?", [hashedPassword, email]);

    res.json({ message: "Password reset successfully" });
};
module.exports = { forgotPassword, resetPassword,login };


