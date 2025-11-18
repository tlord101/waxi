import { GoogleGenAI, Type } from "@google/genai";

const model = 'gemini-2.5-flash';

// This function safely creates the GenAI client only when needed.
const getGenAIClient = () => {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        console.error("AI ASSISTANT OFFLINE: Gemini API key is not configured. Please set the API_KEY environment variable in your deployment settings. The AI assistant will not be functional.");
        return null;
    }
    return new GoogleGenAI({ apiKey: API_KEY });
}

export const askBYDAssistant = async (history: { role: 'user' | 'model'; parts: { text: string }[] }[], question: string) => {
  const ai = getGenAIClient();

  // If the client fails to initialize (e.g., missing key), return a user-friendly message.
  if (!ai) {
    return "I'm sorry, my AI capabilities are currently offline because the API key has not been configured correctly. Please contact the site administrator.";
  }

  try {
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: `You are a friendly and knowledgeable sales expert for Zhengzhou BYD Vehicles Co., Ltd. 
        Your goal is to assist customers with information about BYD electric vehicles, answer their questions, and help them find the perfect car for their needs.
        You have in-depth knowledge of BYD's vehicle lineup, features, pricing, and financing options.
        Always maintain a professional yet approachable tone.
        If you don't know an answer, be honest and offer to connect them with a sales representative.
        Never make up information about vehicle specifications or pricing.
        
        Our dealership is located in Zhengzhou, Henan, China.`,,
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

export const getVehicleDetailsWithAI = async (vehicleName: string) => {
    const ai = getGenAIClient();
    if (!ai) {
        return "AI capabilities are offline. API key is not configured.";
    }

    const schema = {
        type: Type.OBJECT,
        properties: {
            type: {
                type: Type.STRING,
                description: 'The category of the vehicle.',
                enum: ['Sedan', 'SUV', 'Hatchback', 'Commercial', 'Special'],
            },
            price: {
                type: Type.NUMBER,
                description: 'Estimated price in Chinese Yuan (CNY).',
            },
            description: {
                type: Type.STRING,
                description: 'A short, engaging marketing description for the vehicle.',
            },
            specs: {
                type: Type.ARRAY,
                description: 'A list of key technical specifications.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        icon: {
                            type: Type.STRING,
                            description: "An appropriate icon name from the Ionicons v7 library (e.g., 'flash-outline').",
                        },
                        name: {
                            type: Type.STRING,
                            description: "The name of the specification (e.g., 'Range').",
                        },
                        value: {
                            type: Type.STRING,
                            description: "The value of the specification (e.g., '700km').",
                        },
                    },
                    required: ['icon', 'name', 'value'],
                },
            },
        },
        required: ['type', 'price', 'description', 'specs'],
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `Generate the vehicle details for the following model: "${vehicleName}". Provide an estimated price in Chinese Yuan (CNY). For specs, suggest an appropriate icon name from the Ionicons v7 library.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        // FIX: Trim whitespace from the JSON string response before returning to ensure reliable parsing.
        return response.text.trim();

    } catch (error) {
        console.error("Error calling Gemini API for vehicle details:", error);
        return "Failed to generate vehicle details. Please try again or fill them manually.";
    }
};