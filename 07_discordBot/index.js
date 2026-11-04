
// Load environment variables from the .env file
require("dotenv").config();

// Import required classes from discord.js
const {
    Client,
    GatewayIntentBits
} = require("discord.js");

// Import Gemini functions from our service file
const {
    askGemini,
    resetChat
} = require("./services/geminiService");


// --------------------------------------------------
// 1. INITIALIZE DISCORD CLIENT
// --------------------------------------------------

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,         // Access server information
        GatewayIntentBits.GuildMessages,  // Receive messages in servers
        GatewayIntentBits.MessageContent  // Read actual message content
    ]
});


// --------------------------------------------------
// 2. FUNCTION TO SEND LONG MESSAGES
// --------------------------------------------------

async function sendLongMessage(message, content) {

    // Discord allows up to 2000 characters per normal message.
    // We use 1900 to stay safely below that limit.
    const maxLength = 1900;

    // Divide the response into smaller chunks
    for (let i = 0; i < content.length; i += maxLength) {

        // Extract the current chunk from the response
        const chunk = content.slice(i, i + maxLength);

        // Reply to the original user message for the first chunk
        if (i === 0) {
            await message.reply(chunk);
        }

        // Send remaining chunks as normal channel messages
        else {
            await message.channel.send(chunk);
        }
    }
}


// --------------------------------------------------
// 3. BOT READY EVENT
// --------------------------------------------------

client.once("ready", () => {

    // Display a message when the bot successfully connects
    console.log(`Nexora is online! Logged in as ${client.user.tag}`);

});


// --------------------------------------------------
// 4. MESSAGE CREATE EVENT
// --------------------------------------------------

client.on("messageCreate", async (message) => {

    // Ignore messages sent by other bots
    if (message.author.bot) return;


    // --------------------------------------------------
    // 5. AI COMMAND: !ai
    // --------------------------------------------------

    if (message.content.startsWith("!ai ")) {

        // Remove the !ai command and extract the actual question
        const prompt = message.content.slice(4).trim();

        // Check whether the user entered a question
        if (!prompt) {
            return message.reply("Please enter a question.");
        }

        // Create a unique session ID for each user in each channel
        // This keeps different users' conversations separate
        const sessionId = `${message.channelId}-${message.author.id}`;

        try {

            // Display the typing indicator while Gemini generates a response
            await message.channel.sendTyping();

            // Send the prompt to Gemini and wait for its response
            const response = await askGemini(prompt, sessionId);

            // Check whether Gemini returned an empty response
            if (typeof response !== "string" || !response.trim()) {
                return message.reply(
                    "Gemini returned an empty response. Please try again."
                );
            }

            // Send the response, splitting it if it is too long
            await sendLongMessage(message, response);

        } catch (error) {

            // Print technical error details in the terminal
            console.error("Gemini Error:", error);

            // Show a simple error message to the Discord user
            await message.reply(
                "Something went wrong while generating your response. Please try again."
            );
        }
    }


    // --------------------------------------------------
    // 6. RESET COMMAND: !reset
    // --------------------------------------------------

    if (message.content.trim() === "!reset") {

        // Generate the same session ID used for AI conversations
        const sessionId = `${message.channelId}-${message.author.id}`;

        // Delete the user's existing conversation from memory
        resetChat(sessionId);

        // Confirm that the conversation has been reset
        await message.reply(
            "Your conversation memory has been reset!"
        );
    }

});


// --------------------------------------------------
// 7. LOGIN TO DISCORD
// --------------------------------------------------

// Connect the bot using the Discord token
client.login(process.env.DISCORD_TOKEN);
