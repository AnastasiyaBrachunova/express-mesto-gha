const { celebrate, Joi } = require('celebrate'); // ВАЛИДИРУЕМ ТОЛЬКО ТО, ЧТО ПОЛУЧАЕМ ОТ ПОЛЬЗОВАТЕЛЯ

const validateCreateUser = celebrate({ // signup
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/\S+\.\S+/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateLogin = celebrate({ // signin
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateGetUser = celebrate({ // получить по айди ПОЛЬЗОВАТЕЛЯ
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

const validateGetCardId = celebrate({ // получить по айди карточку для 3 роутов
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

const validateChangeUserInfo = celebrate({ // смена инфы
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateChangeAvatar = celebrate({ // смена аватара
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/\S+\.\S+/),
  }),
});

const validateСreateCards = celebrate({ // создать карточку
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/\S+\.\S+/),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateGetUser,
  validateChangeUserInfo,
  validateChangeAvatar,
  validateСreateCards,
  validateGetCardId,
};
