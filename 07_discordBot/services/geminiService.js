
// Store the Gemini API client after its first initialization
let aiClient = null;


// Store individual conversation sessions
// Map uses sessionId as the key and Gemini chat object as the value
const chatSessions = new Map();


// --------------------------------------------------
// 1. INITIALIZE GEMINI CLIENT
// --------------------------------------------------

async function getAIClient() {

    // Initialize the client only once
    // This avoids creating a new client for every Discord message
    if (!aiClient) {

        // Dynamically import the Gemini SDK while keeping CommonJS
        const { GoogleGenAI } = await import("@google/genai");

        // Create a Gemini client using the API key from .env
        aiClient = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
    }

    // Return the existing or newly initialized client
    return aiClient;
}


// --------------------------------------------------
// 2. SEND PROMPT TO GEMINI
// --------------------------------------------------

async function askGemini(prompt, sessionId) {

    // Get the initialized Gemini client
    const ai = await getAIClient();


    // Check whether this user already has a conversation
    let chat = chatSessions.get(sessionId);


    // If no conversation exists, create a new one
    if (!chat) {

        chat = ai.chats.create({
            model: "gemini-flash-latest",
        });

        // Store the new chat session in the Map
        chatSessions.set(sessionId, chat);
    }


    // Send the user's message to Gemini
    // Gemini maintains the conversation context within this chat session
    const response = await chat.sendMessage({
        message: prompt
    });


    // Return the generated text to index.js
    return response.text;
}


// --------------------------------------------------
// 3. RESET CONVERSATION
// --------------------------------------------------

function resetChat(sessionId) {

    // Delete the specified user's conversation from the Map
    // The next message will create a fresh Gemini chat session
    chatSessions.delete(sessionId);
}


// --------------------------------------------------
// 4. EXPORT FUNCTIONS
// --------------------------------------------------

// Make these functions available to index.js
module.exports = {
    askGemini,
    resetChat
};
