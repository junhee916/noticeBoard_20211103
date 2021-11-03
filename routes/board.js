const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check_auth')
const board = require('../controller/board')

// total get board
router.get('/', checkAuth, board.allget)

// detail get board
router.get('/:boardId', checkAuth,  board.detailget)

// register board
router.post('/', checkAuth, board.save)

// update board
router.patch('/:boardId', checkAuth, board.update)

// total delete board
router.delete('/', checkAuth, board.alldelete)

// detail delete board
router.delete('/:boardId', checkAuth, board.detaildelete)

module.exports = router