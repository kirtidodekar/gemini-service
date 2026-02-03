import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "./prompts.js";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeImage(imageInput) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let imagePart;

        if (imageInput.startsWith('http')) {
            // Fetch URL and convert to base64
            const response = await fetch(imageInput);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            imagePart = {
                inlineData: {
                    data: buffer.toString('base64'),
                    mimeType: response.headers.get('content-type') || 'image/jpeg'
                }
            };
        } else {
            // Assume base64
            // helper to strip prefix if present is handled in caller or here
            // For simplicity, let's assume the caller passes the raw base64 data or data uri
            // We will do a basic check
            let data = imageInput;
            let mimeType = "image/jpeg";

            const matches = imageInput.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                mimeType = matches[1];
                data = matches[2];
            }

            imagePart = {
                inlineData: {
                    data: data,
                    mimeType: mimeType
                }
            };
        }

        const result = await model.generateContent([
            SYSTEM_PROMPT,
            imagePart
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present to parse JSON
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            return JSON.parse(cleanText);
        } catch (e) {
            console.error("Failed to parse Gemini response as JSON:", text);
            return {
                waste_type: "Unknown",
                confidence: 0,
                description: "Error parsing AI response",
                usage_suggestions: []
            };
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}
