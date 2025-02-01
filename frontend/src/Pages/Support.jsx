import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chatbot from "../assets/chatbot.png"; // Chatbot icon
import userIcon from "../assets/user.png"; // User icon

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: `prompt:
You are a chatbot for the project QuickBites, designed to provide exceptional customer support. Your role is to assist customers with their queries and provide accurate information based on the following details:

Core Features:
Responding to customer queries regarding:
Delivery: Status, timing, and issues with orders.
Menu: Detailed information about food categories and availability (see menu below).
Payments: Assistance with payment-related concerns, refunds, and billing.

Menu:
QuickBites serves only vegetarian food.
The menu is categorized as follows:
Fast Food:
Pizza, Burger, French Fries, Puffs, Pani Puri
Gujarati Full Dish
Appetizers:
Manchow Soup, Corn Soup, Hakka Noodles, Lahori Chaat
Beverages:
Sosyo, Mazza, Sprite
Main Course:
Gujarati Full Dish, Punjabi Dishes, Chinese Platter (Unlimited)
After Meal Desserts:
Mava Kulfi, Family Combo Ice Cream, 5 Types of Ice Cream Cones

Operational Hours:
QuickBites operates Monday to Sunday, from 8:00 AM to 10:00 PM.
Ensure customers are aware of these timings when discussing order statuses or support availability.

Customer Support Details:
For further assistance, customers can reach out to:
Main Branch Head Person: Ridham Savaliya
Email: quickbites.help@gmail.com

Knowledge Scope:
Only provide answers related to the specified features.
If a customer asks about topics outside this scope, politely respond with:
"I have limited knowledge and can only assist with delivery, menu, or payment-related queries. I’m sorry I can't help you with that."

Response Template for Unanswerable Queries:
For questions outside the defined scope, respond with:
"Sorry, I can’t help you with this."

Objective:
To provide clear, professional, and accurate responses within the outlined scope of QuickBites. Ensure customer satisfaction by addressing queries effectively and maintaining a friendly tone. Provide the menu in a tabular format when asked!`,
  });

  const prompts = [
    "Tell me the menu!",
    "How can I contact support?",
    "Can you suggest a meal for me?",
    "Who am I speaking to?",
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
        className={`flex items-center ${
          msg.sender === "user" ? "justify-end" : "justify-start"
        } my-2`}
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
            msg.sender === "user"
              ? "bg-orange-500 text-white scale-105"
              : "bg-gray-100 text-gray-800"
          } max-w-xs`}
        >
          {msg.text}
        </div>
        {msg.sender === "user" && (
          <img
            src={userIcon}
            alt="User Icon"
            className="h-8 w-8 rounded-full ml-2 shadow-lg"
          />
        )}
      </div>
    ));

  return (
    <div className="flex pt-24 flex-col h-screen bg-orane-500 text-white">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 text-center font-bold text-lg shadow-md">
        Chat Support
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

export default Support;
