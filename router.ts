import { Router } from 'express';
import integration from './phonepeintegration'
const router = Router();

router.post('/payment',integration.newPayment)
router.get('/payment/checkStatus/:txnId',integration.checkStatus)

export default router;