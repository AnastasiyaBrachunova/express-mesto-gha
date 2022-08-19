const User = require("../models/user");

class AplicationError extends Error {
  constructor(status = 500, message = "Internal Error") {
    super();
    this.status = status;
    this.name = this.constructor.name;
    this.message = message;
  }
}

class UserNotFound extends AplicationError {
  constructor() {
    super(404, "User not found");
  }
}

const createUser = (req, res) => {
  return User
    .create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(400).send({ message: `Error validating user ${error}` });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    });
};

const getUser = (req, res) => {
  return User
    .findById(req.params.id)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === "UserNotFound") {
        res.status(error.status).send(error);
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    });
};

const getUsers = (req, res) => {
  return User
    .find({})
    .then((users) => res.status(200).send(users))
    .catch((error) => {
      res.status(500).send({ message: `Internal server error ${error}` });
    });
};

const changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
  .then((user) => res.status(200).send(user))
  .catch((error) => {
    res.status(500).send({ message: `Internal server error ${error}` });
  });
}

const changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
  .then((avatar) => res.status(200).send(avatar))
  .catch((error) => {
    res.status(500).send({ message: `Internal server error ${error}` });
  });

};


module.exports = { createUser, getUser, getUsers, changeUserInfo, changeAvatar };
