import  {Router } from 'express';
const router = Router();
const { getList, creatTodo, updateList, deleteTodo} = require('../controllers/controllers');

router.route('/').get(getList).post(creatTodo);
router.route('/:id').patch(updateList).delete(deleteTodo);

module.exports = router;