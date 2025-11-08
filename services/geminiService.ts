
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this context, we'll proceed assuming it's set in the environment.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

export const askBYDAssistant = async (history: { role: 'user' | 'model'; parts: { text: string }[] }[], question: string) => {
  try {
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: `You are a friendly and knowledgeable sales expert for Wuxi BYD Vehicles Co., Ltd. 
        Your goal is to answer questions about our BYD vehicles, help users calculate installment plans, provide information about our giveaway, and assist with any other dealership-related questions. 
        Use the information from the user's chat history to provide contextually relevant answers.
        Be enthusiastic and helpful. Keep responses concise and easy to read.
        Our available models are: BYD Seal, BYD Yuan Plus (also known as Atto 3), BYD Dolphin, BYD Han EV, BYD Tang EV, BYD Song Plus, BYD eBus, BYD eTruck, and the luxury Yangwang U8.
        You can help with financing calculations by asking for the vehicle price, down payment, and loan term. The interest rate is around 4.5%.
        The current giveaway is for a BYD Dolphin. Entry requires a non-refundable $1,000 fee, and participants will receive a unique raffle code.
        Our dealership is located in Wuxi, Jiangsu, China.`,
      },
      history: history,
    });
    
    const response = await chat.sendMessage({ message: question });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};
