const express = require('express')
const { getTodos, createTodo, editTodos, deleteTodos } = require('../controllers/todoController')
const { requireAuth } = require('../miiddleware/requireAuth')

const router = express.Router()


router.get('/:userEmail',requireAuth,getTodos)

router.post('/', requireAuth, createTodo)

router.put('/:id', requireAuth, editTodos)

router.delete('/:id',requireAuth, deleteTodos)

module.exports = router