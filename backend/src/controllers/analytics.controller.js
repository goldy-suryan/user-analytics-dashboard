import { asyncHandler } from '../middlewares/asyncHandler.js';
import {
  getKPIsService,
  getSignupsOverTimeService,
  getEventsOverTimeService,
  getPurchasesOverTimeService,
  getBreakdownService,
  getAgeGroupBreakdownService,
  getMetadataService,
} from '../services/analytics.service.js';

export const getKPIs = asyncHandler(async (req, res) => {
  const data = await getKPIsService();
  res.status(200).json(data);
});

export const getMetadata = asyncHandler(async (req, res) => {
  const { countries, genders, devices } = await getMetadataService();

  res.status(200).json({
    countries,
    genders,
    devices,
  });
});

export const getSignupsOverTime = asyncHandler(async (req, res) => {
  const data = await getSignupsOverTimeService(req.query);
  res.status(200).json(data);
});

export const getEventsOverTime = asyncHandler(async (req, res) => {
  const data = await getEventsOverTimeService(req.query);
  res.status(200).json(data);
});

export const getPurchasesOverTime = asyncHandler(async (req, res) => {
  const data = await getPurchasesOverTimeService(req.query);
  res.status(200).json(data);
});

export const getBreakdown = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const data = await getBreakdownService(type, req.query);
  res.status(200).json(data);
});

export const getAgeGroupBreakdown = asyncHandler(async (req, res) => {
  const data = await getAgeGroupBreakdownService(req.query);
  res.status(200).json(data);
});
