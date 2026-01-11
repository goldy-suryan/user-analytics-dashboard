
# User Analytics Dashboard

A full-stack web application that visualizes user analytics for ~10,000 users over the last 3 months.
Built using Node.js, Express, MongoDB, Angular, and Docker.

This project demonstrates backend analytics APIs, frontend data visualization, filtering, and containerized deployment.

<br>

## Tech Stack

#### Backend
* Node.js
* Express.js
* MongoDB
* Mongoose
* Faker.js (data generation)

#### Frontend
* Angular 17
* ng2-charts
* Chart.js

#### DevOps
* Docker
* Docker Compose

<br>

## Features

#### KPIs
* Total Users
* Active Users (last 30 days)
* Total Purchases
* Total Revenue
* Conversion Rate

#### Charts
* Signups over time
* Events over time
* Purchases & revenue over time

#### User Breakdown
* Age group
* Gender
* Country
* Device type

#### Filters
* Date range
* Gender
* Country
* Device type
* Clear filters option

<br>

## Running the Project with Docker (Recommended)

#### Prerequisites

* Docker
* Docker Compose

#### Single Command Setup

```
docker-compose up --build
```

#### What This Does

* Starts MongoDB
* Seeds database with 10,000 synthetic users automatically
* Starts backend API
* Builds and serves Angular frontend via Nginx

#### Access the Application
* Frontend: http://localhost:4200
* Backend APIs: http://localhost:4000/api/analytics
* MongoDB: localhost:27017

<br>

## Running the Project WITHOUT Docker

#### Prerequisites

* Node.js (v18+)
* MongoDB (local or Atlas)

#### 1. Start MongoDB

If running locally:

```
mongod
```

Or ensure MongoDB is running and accessible.


#### 2. Backend Setup
```
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=mongodb://localhost:27017/analytics
PORT=4000
```

#### Seed Database (one time)
```
npm run seed
```

##### Start Backend Server
```
npm start
```

Backend will run on:
```
http://localhost:4000
```

#### 3. Frontend Setup
```
cd frontend
npm install
npm start
```

Frontend will run on:
```
http://localhost:4200
```
<br>

## Sample API Endpoints

```
GET /api/analytics/kpis
GET /api/analytics/signups
GET /api/analytics/events
GET /api/analytics/purchases
GET /api/analytics/breakdown/gender
GET /api/analytics/breakdown/country
GET /api/analytics/breakdown/device_type
GET /api/analytics/breakdown/age-group
```


All endpoints support query filters:
```
from, to, gender, country, device_type
```

### Notes

* Docker setup is recommended for consistent environment and easy evaluation.
* Non-Docker setup is provided for local development and debugging.
