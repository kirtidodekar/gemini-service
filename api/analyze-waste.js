import { analyzeImage } from '../lib/gemini.js';
import { sendJSON } from '../lib/utils.js';

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return sendJSON(res, 200, {});
    }

    if (req.method !== 'POST') {
        return sendJSON(res, 405, { error: 'Method not allowed' });
    }

    try {
        const { image } = req.body;

        if (!image) {
            return sendJSON(res, 400, { error: 'Image data (Base64 or URL) is required.' });
        }

        // Call Gemini API
        const analysisResult = await analyzeImage(image);

        return sendJSON(res, 200, analysisResult);

    } catch (error) {
        console.error('API Error:', error);
        return sendJSON(res, 500, {
            error: 'Internal Server Error',
            details: error.message
        });
    }
}
