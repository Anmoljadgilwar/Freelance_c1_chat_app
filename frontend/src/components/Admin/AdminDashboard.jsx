import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  PaperAirplaneIcon,
  ArrowLeftIcon,
  UserGroupIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import io from "socket.io-client";
import { SOCKET_URL } from "../../config/config";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Join with user ID
    newSocket.emit("join", user._id);

    // Listen for new messages
    newSocket.on("new message", (message) => {
      setMessages((prev) => [...prev, message]);

      // Update conversations list
      loadUsersAndConversations();
    });

    // Listen for read receipts
    newSocket.on("message read by", (userId) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender._id === userId && msg.receiver._id === user._id
            ? { ...msg, isRead: true }
            : msg
        )
      );
    });

    return () => {
      newSocket.close();
    };
  }, [user._id]);

  useEffect(() => {
    loadUsersAndConversations();
  }, []);

  const loadUsersAndConversations = async () => {
    try {
      setLoading(true);
      const [usersResponse, conversationsResponse] = await Promise.all([
        axios.get("/auth/users"),
        axios.get("/chat/conversations"),
      ]);

      const allUsers = usersResponse.data.filter((u) => u._id !== user._id);
      setUsers(allUsers);
      setConversations(conversationsResponse.data);

      // Select first user if available
      if (allUsers.length > 0 && !selectedUser) {
        setSelectedUser(allUsers[0]);
        loadConversation(allUsers[0]._id);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (userId) => {
    try {
      const response = await axios.get(`/chat/conversation/${userId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    loadConversation(user._id);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await axios.post("/chat/send", {
        receiverId: selectedUser._id,
        content: newMessage.trim(),
      });

      // Add message to local state immediately
      const newMsg = response.data;
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");

      // Emit socket event for real-time delivery
      if (socket) {
        socket.emit("private message", {
          receiverId: selectedUser._id,
          message: newMsg,
        });
      }

      // Refresh conversations to update last message
      const conversationsResponse = await axios.get("/chat/conversations");
      setConversations(conversationsResponse.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleLogout = async () => {
    if (socket) {
      socket.emit("disconnect");
    }
    await logout();
    navigate("/login");
  };

  const getUnreadCount = (userId) => {
    const conversation = conversations.find((conv) =>
      conv.participants.some((p) => p._id === userId)
    );
    return conversation?.unreadCount || 0;
  };

  const getLastMessage = (userId) => {
    const conversation = conversations.find((conv) =>
      conv.participants.some((p) => p._id === userId)
    );
    return conversation?.lastMessage?.content || "No messages yet";
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/")}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {t("admin.header.title")}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {t("admin.header.subtitle")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Admin: {user.name}</span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm px-3 py-1"
              >
                {t("common.logout")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("admin.customers", { count: users.length })}
                </h2>
                <p className="text-sm text-gray-500">
                  {t("admin.selectPrompt")}
                </p>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {users.map((userItem) => (
                  <div
                    key={userItem._id}
                    onClick={() => handleUserSelect(userItem)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedUser?._id === userItem._id
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {userItem.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {userItem.isOnline && (
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {userItem.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {userItem.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getUnreadCount(userItem._id) > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                            {getUnreadCount(userItem._id)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 truncate">
                      {getLastMessage(userItem._id)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-green-50">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium text-sm">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedUser.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedUser.email}
                        </p>
                      </div>
                      <div className="ml-auto">
                        {selectedUser.isOnline ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                            {t("status.online")}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">
                            {t("status.lastSeen", {
                              time: formatTime(selectedUser.lastSeen),
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-20">
                        <div className="mx-auto h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="h-8 w-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 0 0 1 -4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </div>
                        <p className="text-lg font-medium">
                          {t("admin.noMessages.title")}
                        </p>
                        <p className="text-sm">
                          {t("admin.noMessages.subtitle", {
                            name: selectedUser.name,
                          })}
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message._id}
                          className={`flex ${
                            message.sender._id === user._id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              message.sender._id === user._id
                                ? "bg-blue-500 text-white rounded-br-md"
                                : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div
                              className={`flex items-center justify-end space-x-1 mt-1 ${
                                message.sender._id === user._id
                                  ? "text-blue-100"
                                  : "text-gray-400"
                              }`}
                            >
                              <span className="text-xs">
                                {formatTime(message.createdAt)}
                              </span>
                              {message.sender._id === user._id && (
                                <div className="flex items-center">
                                  {message.isRead ? (
                                    <CheckIcon className="h-3 w-3 text-blue-300" />
                                  ) : (
                                    <CheckIcon className="h-3 w-3" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4 bg-white">
                    <form onSubmit={sendMessage} className="flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">
                      {t("admin.selectCustomer.title")}
                    </p>
                    <p className="text-sm">
                      {t("admin.selectCustomer.subtitle")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
