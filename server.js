const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// JSON-ის წასაკითხად (Body Parser)
app.use(express.json());

// სტატიკური ფაილების (HTML, CSS, JS) გაშვება ფოლდერიდან
app.use(express.static(__dirname));

// API მარშრუტი - ეს არის შენი ბექჰენდი
app.post('/api/contact', async (req, res) => {
    const { type, ...data } = req.body;

    // შენი Make.com-ის Webhook ლინკები
  // api/contact.js-ში შეცვალე ლინკები ასე:
const CHAT_WEBHOOK = process.env.CHAT_WEBHOOK_URL;
const BOOKING_WEBHOOK = process.env.BOOKING_WEBHOOK_URL;
    // ვირჩევთ სწორ მისამართს
    const targetUrl = (type === "BOOKING") ? BOOKING_WEBHOOK : CHAT_WEBHOOK;

    console.log(`[LOG] მოთხოვნა მიღებულია: ${type}`); // ტერმინალში რომ დაინახო

    try {
        // ვაგზავნით Make.com-ზე
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const text = await response.text();
        console.log(`[LOG] Make.com პასუხი: ${text}`);
        res.send(text); // ვაბრუნებთ პასუხს საიტზე

    } catch (error) {
        console.error("[ERROR]", error);
        res.status(500).send("Server Error");
    }
});

// სერვერის ჩართვა
app.listen(port, () => {
    console.log(`🚀 სერვერი გაშვებულია! გახსენი: http://localhost:${port}`);
});