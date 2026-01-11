import {
  getKPIsService,
  getSignupsOverTimeService,
  getEventsOverTimeService,
  getPurchasesOverTimeService,
  getBreakdownService,
  getAgeGroupBreakdownService,
} from '../services/analytics.service.js';

export const getKPIs = async (req, res) => {
  try {
    const data = await getKPIsService();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSignupsOverTime = async (req, res) => {
  try {
    const data = await getSignupsOverTimeService(req.query);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventsOverTime = async (req, res) => {
  try {
    const data = await getEventsOverTimeService(req.query);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPurchasesOverTime = async (req, res) => {
  try {
    const data = await getPurchasesOverTimeService(req.query);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBreakdown = async (req, res) => {
  const { type } = req.params;
  try {
    const data = await getBreakdownService(type, req.query);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAgeGroupBreakdown = async (req, res) => {
  try {
    const data = await getAgeGroupBreakdownService(req.query);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
