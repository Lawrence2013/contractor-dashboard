import { Router } from 'express';
import { requireContractor } from '../middleware/auth';
import * as controller from '../controllers/orders';

const router = Router();
router.use(requireContractor);

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.patch('/:id/accept', controller.accept);
router.patch('/:id/reject', controller.reject);

export default router;
