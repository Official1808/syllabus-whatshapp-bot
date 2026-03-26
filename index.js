const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('WhatsApp Syllabus Bot Running');
});

app.listen(8080);

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot Ready');
});

client.on('message', async msg => {
    if (msg.body.toLowerCase() === 'syllabus') {
        const pdf = MessageMedia.fromFilePath('./syllabus.pdf');
        client.sendMessage(msg.from, pdf);
    }
});

client.initialize();
