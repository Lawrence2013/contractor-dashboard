import { Router } from 'express';
import { requireContractor } from '../middleware/auth';

const router = Router();
router.use(requireContractor);

router.get('/', (_, res) => {
  res.json([]);
});

export default router;
