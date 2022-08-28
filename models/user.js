const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30,
    default: 'Жак-Ив Кусто', // а максимальная — 30 символов
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        const urlRegex = /https?:\/\/\S+\.\S+/gm;
        return urlRegex.test(url);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    validate: {
      validator(email) {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
        return emailRegex.test(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },

});

module.exports = mongoose.model('user', userSchema);
