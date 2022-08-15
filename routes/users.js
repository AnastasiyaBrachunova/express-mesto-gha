const router = require('express').Router()
const { createUser, getUser, getUsers } = require('../controllers/users')

router.get('/users', getUsers)  // получение всех пользователей
router.get('/users/:userId', getUser) // получение информации пользователя по айди
router.post('/users',createUser)  // создание пользователя

module.exports = router;