require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

app.post('/send-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    await transporter.sendMail({
      from: `"Scholar App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verify your Scholar account',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px">
          <h2 style="color:#D4AF37">Verify your email</h2>
          <p>Your verification code is:</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:10px;
                      background:#f5f5f5;padding:16px;text-align:center;
                      border-radius:8px;color:#001B2E">
            ${otp}
          </div>
          <p style="color:#666;font-size:13px;margin-top:16px">
            This code expires in 10 minutes. Do not share it with anyone.
          </p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.get('/', (req, res) => res.send('Scholar Email Server running ✅'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));