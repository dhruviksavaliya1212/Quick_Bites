import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Support = () => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");

  const apiKey = "AIzaSyDNtnai9OK_cB_NkbVDqZS1Gh1vCcCxzok";
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: `Prompt
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
Contact Person: Ridham Savaliya
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

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  async function generateResponse() {
    setLoading(true);
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [{ text: userInput }],
          },
          {
            role: "model",
            parts: [
              {
                text: "Hello! Welcome to QuickBites! How can I help you today? Are you looking for information about our menu, delivery options, or payment methods? I'm here to assist you with those!\n",
              },
            ],
          },
        ],
      });

      const result = await chatSession.sendMessage(userInput);
      setResponse(result.response.text());
    } catch (error) {
      console.error("Error generating text:", error);
      setResponse("An error occurred while generating the response.");
    } finally {
      setLoading(false);
    }
  }

  // Function to return the menu in tabular format
  const getMenuResponse = () => {
    return `
      | Category        | Items                             |
      |-----------------|-----------------------------------|
      | Fast Food       | Pizza, Burger, French Fries, Puffs, Pani Puri |
      | Gujarati Dish   | Gujarati Full Dish               |
      | Appetizers      | Manchow Soup, Corn Soup, Hakka Noodles, Lahori Chaat |
      | Beverages       | Sosyo, Mazza, Sprite             |
      | Main Course     | Gujarati Full Dish, Punjabi Dishes, Chinese Platter |
      | Desserts        | Mava Kulfi, Family Combo Ice Cream, Ice Cream Cones |
    `;
  };

  // Check if the user input includes the word 'menu' and return the menu
  const handleUserInput = () => {
    if (userInput.toLowerCase().includes("menu")) {
      setResponse(getMenuResponse());
    } else {
      generateResponse();
    }
  };

  // Suggested prompts for the user
  const suggestedPrompts = [
    { text: "Know about Menu", value: "Tell me the menu" },
    { text: "Contact Us", value: "How can I contact support?" },
    { text: "Suggest a Meal to Choose", value: "Can you suggest a meal for me?" },
  ];

  // Handle clicking a suggestion prompt
  const handlePromptClick = (suggestion) => {
    setUserInput(suggestion.value);
    handleUserInput();
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-blue-50 via-orange-500 to-purple-300 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-orange-600 mb-6">
          QuickBites Chat Support
        </h1>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-wrap gap-4">
            {suggestedPrompts.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(suggestion)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none"
              >
                {suggestion.text}
              </button>
            ))}
          </div>

          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your query here..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-400 text-lg"
            rows={5}
          />
          <button
            onClick={handleUserInput}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Generating..." : "Ask the ChatBot!"}
          </button>
          <div className="bg-gray-100 p-6 rounded-lg h-60 overflow-y-auto border border-gray-300 relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
                <p className="mt-4 text-orange-500 font-medium text-lg">
                  Generating response...
                </p>
              </div>
            ) : response ? (
              <p className="text-gray-700 whitespace-pre-wrap text-lg">
                {response}
              </p>
            ) : (
              <p className="text-gray-400 text-center">
                Bot response will appear here...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
