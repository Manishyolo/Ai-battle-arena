import {config} from 'dotenv';
config();

type Config = {
   readonly  GEMINI_API_KEY : string;
    readonly MISTRAL_API_KEY : string;
    readonly COHERE_API_KEY : string;
}



 const config:Config = {
    GEMINI_API_KEY : process.env.GEMINI_API_KEY || '',
    MISTRAL_API_KEY : process.env.MISTRAL_API_KEY || '',
    COHERE_API_KEY : process.env.COHERE_API_KEY || '',
}

export default config;