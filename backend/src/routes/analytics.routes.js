import express from 'express';
import {
  getKPIs,
  getSignupsOverTime,
  getEventsOverTime,
  getPurchasesOverTime,
  getBreakdown,
  getAgeGroupBreakdown,
  getMetadata,
} from '../controllers/analytics.controller.js';
import { validateQuery } from '../middlewares/validateQuery.js';

const router = express.Router();

router.get('/kpis', getKPIs);
router.get('/metadata', getMetadata);
router.get('/signups', validateQuery, getSignupsOverTime);
router.get('/events', validateQuery, getEventsOverTime);
router.get('/purchases', validateQuery, getPurchasesOverTime);

router.get('/breakdown/age-group', validateQuery, getAgeGroupBreakdown);
router.get('/breakdown/:type', validateQuery, getBreakdown);

export default router;
