const user = require("../models/user");

const createUser = (req, res) => {
  return user.create(req.body).then((user) =>
    res
      .status(201)
      .send(user))
      .catch((e) =>
        res.status(500).send({ message: `Ошибка создания пользователя ${e}` })
      )

};

const getUser = (req, res) => {};

const getUsers = (req, res) => {};

module.exports = { createUser, getUser, getUsers };
