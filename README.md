# Real-Time Cryptocurrency Tracker

A simple and powerful application for tracking real-time cryptocurrency prices. Built using Node.js, Express, WebSocket, and Redis.

## Features
- Real-time price tracking for multiple cryptocurrencies.
- Price alerts via email.
- User authentication (Register/Login).
- Price data caching using Redis to reduce API calls.

## Technologies Used
- **Backend**: Node.js, Express.js
- **WebSocket**: For real-time data streaming from Binance API.
- **Redis**: For caching the latest cryptocurrency prices for 10 seconds.
- **MongoDB**: For storing user data.
- **Email**: Send price alerts when threshold is reached.
  
## Setup

### Prerequisites
- Node.js (v14 or above)
- Docker (for Redis and MongoDB setup)
- Redis (Local or Dockerized)
- MongoDB URI

### Steps to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/Adarsh-Mishra15/basic_apis.git
   cd basic_apis
