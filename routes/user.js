const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check_auth')
const user = require('../controller/user')

// total get user
router.get('/', checkAuth, user.allget)

// detail get user
router.get('/:userId', checkAuth, user.detailget)

// signup 
router.post('/signup', user.signup)

// login
router.post('/login', user.login)

// update user
router.patch('/:userId', checkAuth, user.update)

// total delete user
router.delete('/', checkAuth, user.alldelete)

// detail delete user
router.delete('/:userId', checkAuth, user.detaildelete)

module.exports = router