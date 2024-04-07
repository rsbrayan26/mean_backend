import express, { Request, Response } from 'express';
import productController from '../controller/productController';
import { checkAuth, checkIp } from '../middlewares/auth-middlewares';
const router = express.Router();

router.get('/', checkAuth, productController.getProducts);
router.get('/:id', checkAuth, productController.getProduct);
router.post('/', checkAuth, productController.postProduct);
router.put('/:id', checkAuth, productController.putProduct);
router.delete('/:id', checkAuth, productController.deleteProduct);

export default { router };
