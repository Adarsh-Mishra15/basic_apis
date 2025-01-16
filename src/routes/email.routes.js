import express from "express";
import {sendEmail} from "../utils/sendEmail.js";

const router = express.Router();

router.post("/send-alert", async (req, res) => {
    const { to, subject, text } = req.body;

    try {
        await sendEmail({ to, subject, text });
        res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send email." });
    }
});

export default router;
