const twilio = require('twilio');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, phone, city, product, size } = req.body;

    // جلب المتغيرات من بيئة العمل Vercel
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER; // بتنسيق whatsapp:+14155238886
    const toWhatsApp = process.env.ADMIN_WHATSAPP_NUMBER;   // بتنسيق whatsapp:+212701733406

    const client = twilio(accountSid, authToken);

    // صياغة نص الرسالة الاحترافية
    const messageBody = `🚨 *طلب جديد من الموقع!* 🚨\n\n` +
                        `👤 *الاسم:* ${name}\n` +
                        `📞 *الهاتف:* ${phone}\n` +
                        `📍 *المدينة:* ${city}\n` +
                        `🧥 *المنتج:* ${product}\n` +
                        `📏 *المقاس:* ${size}\n\n` +
                        `تاريخ الطلب: ${new Date().toLocaleDateString('ar-MA')}`;

    try {
        await client.messages.create({
            from: fromWhatsApp,
            to: toWhatsApp,
            body: messageBody
        });

        return res.status(200).json({ success: true, message: 'Order sent successfully' });
    } catch (error) {
        console.error('Twilio Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
