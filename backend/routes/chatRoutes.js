const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getUserConversations,
  markAsRead,
  getUnreadCount,
} = require("../controllers/chatController");
const { protect } = require("../middleware/auth");

router.post("/send", protect, sendMessage);
router.get("/conversation/:userId", protect, getConversation);
router.get("/conversations", protect, getUserConversations);
router.put("/read/:messageId", protect, markAsRead);
router.get("/unread", protect, getUnreadCount);

module.exports = router;
