const { GoogleGenAI } = require("@google/genai");

const chatWithAI = async (req, res) => {
    try {
        const { history } = req.body;

        if (!history || !Array.isArray(history) || history.length === 0) {
            return res.status(400).json({ message: 'No chat history provided' });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
           return res.status(500).json({ message: 'Gemini API key is not configured.' });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const systemPrompt = `You are the SmartCart AI Shopping Assistant. 
You help users find products, offer recommendations, and answer questions about the e-commerce store.
Be friendly, concise, and helpful. 
The store currently sells Electronics (like Premium Wireless Earbuds, Smart Fitness Watch), Home Decor (Minimalist Wall Clock, Ceramic Table Lamp), Clothing, Medicines, and Gifts. Use ₹ (INR) for currency formatting.`;

        // Map the frontend history array to the format Gemini expects
        const formattedContents = history.map(msg => ({
            role: msg.isUser ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: formattedContents,
            config: {
                systemInstruction: systemPrompt,
            }
        });

        res.status(200).json({ reply: response.text });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: 'Server error processing AI chat' });
    }
};


const recommendProducts = async (req, res) => {
    try {
        const { cartItems } = req.body;
        if (!cartItems || cartItems.length === 0) {
            return res.json({ recommendations: [] });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: 'Gemini API key is not configured.' });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });
        
        const itemNames = cartItems.map(item => item.name).join(', ');
        const prompt = `The user has the following items in their cart: ${itemNames}. 
Based on these items, suggest 3 generic categories or specific types of products they might also like to buy from an e-commerce store (e.g. if they bought a laptop, suggest a wireless mouse, laptop bag, and USB hub). 
Return exactly 3 short product names separated by commas, nothing else.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        const suggestions = response.text.split(',').map(s => s.trim()).filter(s => s.length > 0);
        res.status(200).json({ recommendations: suggestions });
    } catch (error) {
        console.error("AI Recommendation Error:", error);
        res.status(500).json({ message: 'Server error processing AI recommendations' });
    }
};

module.exports = { chatWithAI, recommendProducts };
