export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export function sendJSON(res, status, data) {
    res.statusCode = status;
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

export function parseBase64(dataString) {
    // Handles data:image/jpeg;base64,..... format
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
        return {
            mimeType: matches[1],
            data: matches[2]
        };
    }
    return {
        mimeType: 'image/jpeg', // Default fall-back if header missing but is base64
        data: dataString
    };
}
