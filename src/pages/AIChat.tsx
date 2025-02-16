import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useTheme } from "../context/ThemeContext";

const AiChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; text: string; mapUrl?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    const newMessage = { type: "user", text: message };
    setMessages((prev: any) => [...prev, newMessage]);

    const locationKeywords = [
      "near me",
      "location",
      "my home",
      "things near me",
    ];
    const containsLocationKeyword = locationKeywords.some((keyword) =>
      newMessage.text.toLowerCase().includes(keyword)
    );

    if (containsLocationKeyword) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;

            setMessages((prev) => [
              ...prev,
              {
                type: "bot",
                text: `Your current location: 🌍 Lat: ${latitude}, Lng: ${longitude}`,
              },
              {
                type: "bot",
                text: "Here is your location on the map:",
                mapUrl,
              },
            ]);

            try {
              // Reverse Geocode to get city name
              const locationResponse = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const locationData = await locationResponse.json();
              const locationDetails = `You are in ${locationData.city}, ${locationData.countryName}.`;
              setMessages((prev) => [
                ...prev,
                { type: "bot", text: locationDetails },
              ]);

              // Extracting place type from the message
              const placeTypes = [
                "mall",
                "restaurant",
                "hospital",
                "hotel",
                "gym",
                "school",
                "park",
              ];
              const requestedPlaceType = placeTypes.find((type) =>
                message.toLowerCase().includes(type)
              );

              if (requestedPlaceType) {
                // Fetch nearby places using Google Places API
                const googlePlacesApiKey = "YOUR_GOOGLE_PLACES_API_KEY";
                const placesResponse = await fetch(
                  `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=${requestedPlaceType}&key=${googlePlacesApiKey}`
                );
                const placesData = await placesResponse.json();

                if (placesData.results && placesData.results.length > 0) {
                  const placesList = placesData.results
                    .slice(0, 5)
                    .map(
                      (place: any) =>
                        `📍 <b>${place.name}</b> - ${place.vicinity}`
                    )
                    .join("<br>");

                  setMessages((prev) => [
                    ...prev,
                    {
                      type: "bot",
                      text: `Nearby ${requestedPlaceType}s:<br>${placesList}`,
                    },
                  ]);
                } else {
                  setMessages((prev) => [
                    ...prev,
                    {
                      type: "bot",
                      text: `No nearby ${requestedPlaceType}s found.`,
                    },
                  ]);
                }
              } else {
                setMessages((prev) => [
                  ...prev,
                  {
                    type: "bot",
                    text: "I can help find malls, restaurants, hospitals, etc. Try asking for one!",
                  },
                ]);
              }
            } catch (error) {
              console.error("Error fetching location data:", error);

              setMessages((prev) => [
                ...prev,
                { type: "bot", text: "Error fetching location details." },
              ]);
              setMessage("");
            } finally {
              setLoading(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setMessages((prev) => [
              ...prev,
              { type: "bot", text: "Unable to fetch your location." },
            ]);
            setLoading(false);
          }
        );
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "Geolocation is not supported in your browser.",
          },
        ]);
        setLoading(false);
      }
    } else {
      // AI Chatbot Logic
      try {
        setMessage("");
        const apiKey = import.meta.env.VITE_GOOGLE_AI_KEY;
        if (!apiKey) throw new Error("Missing API Key!");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(message);
        const botResponse = await result.response;

        const cleanText = botResponse
          .text()
          .replace(/\*\*/g, "")
          .replace(/\n/g, "<br>")
          .replace(/(\*|-)\s*/g, "<br>• ");

        setMessages((prev) => [...prev, { type: "bot", text: cleanText }]);
      } catch (error) {
        console.error("Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "Sorry, there was an error processing your request.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
   <div className="w-[100%] h-[100vh]">
     <div
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.text,
      }}
      className="w-[100%] h-[100%] bg-red-400 p-6 rounded-lg shadow-xl max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Chat with AI</h2>

      {/* Scrollable Chat Box */}
      <div
        className="mb-4 h-[390px] max-h-[390px] overflow-y-auto p-4 rounded-lg"
        style={{ backgroundColor: currentTheme.secondary }}
      >
        {messages.length === 0 ? (
          <p style={{ color: currentTheme.text }}>
            AI responses will appear here...
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.mapUrl ? (
                <iframe
                  src={msg.mapUrl}
                  width="100%"
                  height="250"
                  style={{ borderRadius: "10px", border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              ) : (
                <div
                  className="mb-2 p-2 rounded-lg max-w-[75%] text-white"
                  style={{
                    backgroundColor:
                      msg.type === "user"
                        ? currentTheme.primary
                        : currentTheme.accent,
                    color: currentTheme.text,
                  }}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              )}
            </div>
          ))
        )}
        <div ref={chatRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 rounded-lg focus:ring-2 focus:outline-none resize-none max-h-20 overflow-y-auto"
          style={{
            backgroundColor: currentTheme.secondary,
            color: currentTheme.text,
          }}
          placeholder="Type your message here..."
          rows={1}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="w-full py-3 rounded-lg font-semibold transition-colors"
          style={{
            backgroundColor:
              loading || !message.trim()
                ? currentTheme.accent
                : currentTheme.primary,
            cursor: loading || !message.trim() ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Thinking..." : "Send Message"}
        </button>
      </form>
    </div>
   </div>
  );
};

export default AiChat;
