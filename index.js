const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { EditPhotoHandle } = require('./feature/edit_foto');

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async (message) => {
  const text = message.body.toLowerCase() || '';

  if (message.body === '!ping') {
    client.sendMessage(message.from, 'pong');
  }

  if (text.includes('edit_bg/')) {
    await EditPhotoHandle(text, message);
  }
});

client.initialize();
