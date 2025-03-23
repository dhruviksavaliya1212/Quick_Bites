import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chatbot from "../assets/chatbot.png"; // Chatbot icon
import userIcon from "../assets/user.png"; // Admin icon (you can change this to an admin-specific icon)
import withAuth from "../utills/hoc/withAuth";

const ChatSupport = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: `You are an admin chatbot for QuickBites, a food ordering system. Your role is to assist the admin with managing the system, addressing order issues, providing order status updates, and offering support for customer inquiries. The core functionalities include:

1. **Order Management**: Help the admin track orders, check their status, and manage pending orders.
2. **Customer Support**: Assist the admin in handling customer queries related to orders, menu items, or payment issues.
3. **Menu Management**: Provide details of the menu, including availability, and suggest modifications.
4. **Payment Issues**: Help with resolving payment-related concerns, issuing refunds, or checking payment status.



**Knowledge Scope**:
- Provide the admin with information on orders, customer support, menu management, and payment-related tasks.
- Do not provide information outside this scope.
- Maintain a professional and helpful tone, ensuring that the admin is able to manage all operations effectively.
- 1. Veggie Burger 2. Chicken Wrap 3. Margherita Pizza 4. Chocolate Brownie 5. Iced Coffee 6. Chicken Burger 7. Cheese Pizza 8. Veggie Wrap 9. Oreo Shake 10. Veg Momos 11. Paneer Tikka 12. Veg Fried Rice when  ".

**Response Templates for Unanswerable Queries**:
- "Sorry, I can’t help with this query."

**Operational Hours**:
QuickBites operates from Monday to Sunday, 8:00 AM to 10:00 PM. Provide operational hours when discussing availability.

**Admin Chatbot Support  handler **:
Ridham Savaliya! or for quicker response Contact him at quickbites.help@gmail.com
`});

  const prompts = [
    "Contact Admin Chatbot Support  Manager",
    // "Show me the current order status.",
    // "Can you assist with customer payment issues?",
    "What's on the menu today?",
    "What are the operational hours for QuickBites?",
    // "How can I help a customer with an order issue?",
    
  ];

  const handleSend = async (input) => {
    if (!input) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    try {
      setIsTyping(true);

      const chatSession = model.startChat({
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
        },
        history: messages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
      });

      const response = await chatSession.sendMessage(input);
      const botMessage = {
        sender: "bot",
        text: response.response.text(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: "bot", text: "Sorry, I encountered an error." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessages = () =>
    messages.map((msg, index) => (
      <div
        key={index}
        className={`flex items-center ${msg.sender === "user" ? "justify-end" : "justify-start"} my-2`}
      >
        {msg.sender === "bot" && (
          <img
            src={chatbot}
            alt="Chatbot Icon"
            className="h-8 w-8 rounded-full mr-2 shadow-lg"
          />
        )}
        <div
          className={`p-4 rounded-lg shadow-lg transition transform ${
            msg.sender === "user" ? "bg-orange-500 text-white scale-105" : "bg-gray-100 text-gray-800"
          } max-w-xs`}
        >
          {msg.text}
        </div>
        {msg.sender === "user" && (
          <img
            src={userIcon}
            alt="Admin Icon"
            className="h-8 w-8 rounded-full ml-2 shadow-lg"
          />
        )}
      </div>
    ));

  return (
    <div className="flex pt-2 flex-col h-screen  text-white">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 text-center font-bold text-lg shadow-md">
        Admin Chat Support
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {renderMessages()}
        {isTyping && (
          <div className="flex items-center my-2">
            <img
              src={chatbot}
              alt="Chatbot Typing"
              className="h-8 w-8 rounded-full mr-2 shadow-lg"
            />
            <div className="p-4 rounded-lg bg-gray-100 text-gray-800 max-w-xs animate-pulse">
              ...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSend(prompt)}
              className="px-4 py-2 bg-orange-400 text-white rounded-lg shadow-md hover:bg-orange-500 transition transform hover:scale-105"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex p-4 bg-white border-t">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border text-black rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={() => handleSend(userInput)}
          className="px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition transform hover:scale-105"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default withAuth(ChatSupport) ;
