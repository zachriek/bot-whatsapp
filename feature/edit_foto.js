const axios = require('axios');
const { API_KEY_RM_BG } = require('../config');

const EditPhotoHandle = async (text, message) => {
  const cmd = text.split('/');
  if (cmd.length < 2) {
    return message.reply('Format Salah. ketik *edit_bg/warna*');
  }

  if (message.hasMedia) {
    if (message.type != 'image') {
      return message.reply('hanya bisa edit dengan format image.');
    }

    message.reply('sedang diproses, tunggu bentar ya.');

    const media = await message.downloadMedia();

    if (media) {
      const color = cmd[1];
      const newPhoto = await EditPhotoRequest(media.data, color);

      if (!newPhoto.success) {
        return message.reply('Terjadi kesalahan.');
      }

      const chat = await message.getChat();
      media.data = newPhoto.base64;
      chat.sendMessage(media, { caption: 'ini hasilnya' });
    }
  }
};

const EditPhotoRequest = async (base64, bg_color) => {
  const result = {
    success: false,
    base64: null,
    message: '',
  };

  return await axios({
    method: 'post',
    url: 'https://api.remove.bg/v1.0/removebg',
    data: {
      image_file_b64: base64,
      bg_color: bg_color,
    },
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Api-Key': API_KEY_RM_BG,
    },
  })
    .then((response) => {
      if (response.status == 200) {
        result.success = true;
        result.base64 = response.data.data.result_b64;
      } else {
        result.message = 'Failed response';
      }
      return result;
    })
    .catch((error) => {
      result.message = 'Error : ' + error.message;
      return result;
    });
};

module.exports = { EditPhotoHandle };
