export default async function handler(req, res) {
    // CORS headers - essential for local development and cross-origin usage
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const body = req.body || {};
    const { type, ...data } = body;

    // შენი რეალური ლინკები Make.com-იდან (CHAT = ...psj)
    const CHAT_WEBHOOK = "https://hook.eu1.make.com/4o637jud8u455wt1sr6bmoha3fci8psj";
    const BOOKING_WEBHOOK = "https://hook.eu1.make.com/on7mkprtr6zlhxrn3bqk0hg3atiscngi";

    const targetUrl = (type === "BOOKING") ? BOOKING_WEBHOOK : CHAT_WEBHOOK;

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const textResponse = await response.text();
        res.status(200).send(textResponse);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Failed to communicate with Make.com' });
    }
}