import handler from './api/contact.js';

// Mock Fetch
global.fetch = async (url, options) => {
    console.log(`[Mock Fetch] URL: ${url}`);
    console.log(`[Mock Fetch] Method: ${options.method}`);
    console.log(`[Mock Fetch] Body: ${options.body}`);

    if (url.includes('on7mkprtr6zlhxrn3bqk0hg3atiscngi')) {
        return {
            ok: true,
            text: async () => "Chat Webhook Response"
        };
    } else if (url.includes('4o637jud8u455wt1sr6bmoha3fci8psj')) {
        return {
            ok: true,
            text: async () => "Booking Webhook Response"
        };
    }
    return { ok: false, status: 404 };
};

// Mock Response
const res = {
    setHeader: (k, v) => console.log(`[Res Header] ${k}: ${v}`),
    status: (code) => {
        console.log(`[Res Status] ${code}`);
        return res;
    },
    send: (body) => console.log(`[Res Send] ${body}`),
    json: (body) => console.log(`[Res JSON] ${JSON.stringify(body)}`),
    end: () => console.log(`[Res End]`)
};

async function testChat() {
    console.log("--- Testing Chat Request ---");
    const req = {
        method: 'POST',
        body: { type: 'CHAT', message: 'Hello' }
    };
    await handler(req, res);
}

async function testBooking() {
    console.log("\n--- Testing Booking Request ---");
    const req = {
        method: 'POST',
        body: { type: 'BOOKING', date: '2025-01-01' }
    };
    await handler(req, res);
}

async function testMethod() {
    console.log("\n--- Testing GET Request (Should Fail) ---");
    const req = { method: 'GET' };
    await handler(req, res);
}

(async () => {
    await testChat();
    await testBooking();
    await testMethod();
})();
