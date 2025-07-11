import { Router } from 'express';
import { requireContractor } from '../middleware/auth';
import * as controller from '../controllers/services';

const router = Router();

router.use(requireContractor);

router.get('/', controller.list);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
