import { faker } from '@faker-js/faker';
import fs from 'fs';

const USERS = 10000;
const users = [];
const events = [];
const transactions = [];

const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 3);

for (let i = 0; i < USERS; i++) {
  const userId = faker.string.uuid();
  const signupDate = faker.date.between({ from: startDate, to: new Date() });

  users.push({
    user_id: userId,
    signup_date: { "$date": signupDate.toISOString() },
    age: faker.number.int({ min: 18, max: 60 }),
    gender: faker.helpers.arrayElement(['male', 'female', 'other']),
    country: faker.helpers.arrayElement(['India', 'USA', 'UK', 'Germany']),
    device_type: faker.helpers.arrayElement(['web', 'android', 'ios']),
    acquisition_channel: faker.helpers.arrayElement(['organic', 'ads', 'referral']),
    plan_type: faker.helpers.arrayElement(['free', 'trial', 'paid'])
  });

  const eventCount = faker.number.int({ min: 5, max: 30 });

  for (let j = 0; j < eventCount; j++) {
    events.push({
      event_id: faker.string.uuid(),
      user_id: userId,
      event_name: faker.helpers.arrayElement(['login', 'view', 'add_to_cart', 'purchase']),
      event_timestamp: { "$date": faker.date.between({ from: signupDate, to: new Date() }).toISOString() }
    });
  }

  if (Math.random() < 0.3) {
    transactions.push({
      transaction_id: faker.string.uuid(),
      user_id: userId,
      amount: faker.number.int({ min: 10, max: 500 }),
      transaction_date: { "$date": faker.date.recent({ days: 90 })},
      payment_status: faker.helpers.arrayElement(['success', 'failed'])
    });
  }
}

fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
fs.writeFileSync('events.json', JSON.stringify(events, null, 2));
fs.writeFileSync('transactions.json', JSON.stringify(transactions, null, 2));

// Now these generated files can be dumped to mongodb using mongoimport or use import in mongodb compass
