import config from "../config/config.js"
import { ChatCohere } from "@langchain/cohere"
import { ChatMistralAI } from "@langchain/mistralai"
import { ChatGoogle } from "@langchain/google";



export const Gemini_model = new ChatGoogle({
    model: "gemini-flash-latest",
    apiKey: config.GEMINI_API_KEY
});


export const Mistral_model = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRAL_API_KEY
})


export const Cohere_model = new ChatCohere({
    model: "command-a-03-2025",
   apiKey: config.COHERE_API_KEY
 
})