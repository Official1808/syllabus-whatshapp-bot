const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('WhatsApp Syllabus Bot Running');
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    console.log('QR RECEIVED');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot Ready');
});

client.on('authenticated', () => {
    console.log('Authenticated');
});

client.on('auth_failure', msg => {
    console.log('Auth failure', msg);
});

client.on('disconnected', reason => {
    console.log('Disconnected', reason);
});

client.on('message', async msg => {

    if (msg.body.toLowerCase() === 'syllabus') {

        try {

            const pdf = MessageMedia.fromFilePath('./syllabus.pdf');

            await client.sendMessage(msg.from, pdf);

            console.log('Syllabus sent to ' + msg.from);

        } catch (error) {

            console.log('Error sending PDF:', error);

        }

    }

});

client.initialize();
