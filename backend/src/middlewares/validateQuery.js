import User from '../models/user.model.js';

export const validateQuery = async (req, res, next) => {
  const { from, to, gender, country, device_type } = req.query;

  if (!from || !to) {
    return res.status(400).json({ message: 'from and to dates are required' });
  }

  const isValidDateString = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

  if (!isValidDateString(from) || !isValidDateString(to)) {
    return res.status(400).json({
      message: 'Invalid date format. Expected YYYY-MM-DD',
    });
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);
  const today = new Date();

  if (isNaN(fromDate) || isNaN(toDate)) {
    return res.status(400).json({
      error: 'Invalid date format',
    });
  }

  if (fromDate > toDate) {
    return res
      .status(400)
      .json({ message: 'from date cannot be greater than to date' });
  }

  if (fromDate > today || toDate > today) {
    return res.status(400).json({ message: 'future dates are not allowed' });
  }

  const [countries, genders, devices] = await Promise.all([
    User.distinct('country'),
    User.distinct('gender'),
    User.distinct('device_type'),
  ]);

  if (gender && !genders.includes(gender)) {
    return res.status(400).json({ message: 'invalid gender value' });
  }

  if (device_type && !devices.includes(device_type)) {
    return res.status(400).json({ message: 'invalid device value' });
  }

  if (country) {
    if (!countries.includes(country)) {
      return res.status(400).json({ message: 'invalid country value' });
    }
  }

  next();
};
