"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const { getList, creatTodo, updateList, deleteTodo } = require('../controllers/controllers');
router.route('/').get(getList).post(creatTodo);
router.route('/:id').patch(updateList).delete(deleteTodo);
module.exports = router;
