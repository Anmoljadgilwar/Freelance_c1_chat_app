const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/chat/send
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, messageType = 'text' } = req.body;
    const senderId = req.user._id;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    // Create message
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      messageType
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.unreadCount += 1;
    await conversation.save();

    // Populate sender details
    await message.populate('sender', 'name avatar');
    await message.populate('receiver', 'name avatar');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversation messages
// @route   GET /api/chat/conversation/:userId
// @access  Private
const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Find conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, userId] }
    });

    if (!conversation) {
      return res.json({ messages: [], conversation: null });
    }

    // Get messages
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar')
    .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: currentUserId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    // Update conversation unread count
    conversation.unreadCount = 0;
    await conversation.save();

    res.json({ messages, conversation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user conversations
// @route   GET /api/chat/conversations
// @access  Private
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    let conversations;
    if (req.user.role === 'admin') {
      // Admin sees all conversations
      conversations = await Conversation.find({})
        .populate('participants', 'name avatar isOnline lastSeen')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });
    } else {
      // Users see only their conversations
      conversations = await Conversation.find({
        participants: userId
      })
      .populate('participants', 'name avatar isOnline lastSeen')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as read
// @route   PUT /api/chat/read/:messageId
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only receiver can mark as read
    if (message.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread count
// @route   GET /api/chat/unread
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadCount = await Message.countDocuments({
      receiver: userId,
      isRead: false
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getUserConversations,
  markAsRead,
  getUnreadCount
};
