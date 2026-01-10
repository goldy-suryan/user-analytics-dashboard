import express from 'express';
import {
  getKPIs,
  getSignupsOverTime,
  getEventsOverTime,
  getPurchasesOverTime,
  getBreakdown,
  getAgeGroupBreakdown
} from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/kpis', getKPIs);
router.get('/signups', getSignupsOverTime);
router.get('/events', getEventsOverTime);
router.get('/purchases', getPurchasesOverTime);

router.get('/breakdown/age-group', getAgeGroupBreakdown);
router.get('/breakdown/:type', getBreakdown);

export default router;
