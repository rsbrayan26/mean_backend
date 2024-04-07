import express, { Request, Response } from 'express';
import userController from '../controller/userController';
import { checkAuth } from '../middlewares/auth-middlewares';
const router = express.Router();

router.get('/', checkAuth, userController.getUsers);
router.get('/:id', checkAuth, userController.getUser);
router.post('/', userController.postUser);
router.put('/:id', checkAuth, userController.putUser);
router.delete('/:id', checkAuth, userController.deleteUser);
router.post('/login', userController.login);

export default { router };
