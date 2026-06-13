#  Distributed API Gateway
 
> A production-grade API Gateway built from scratch in Node.js — no Express — featuring reverse proxying, JWT/RBAC auth, Redis rate limiting, circuit breaking, structured logging, health check metrics, and a real-time monitoring dashboard.
 
---
 
##  Why This Project?
 
An API Gateway is the **single entry point** for all client requests in a microservices architecture. Instead of clients talking to multiple services directly, they talk to one gateway that handles everything: authentication, routing, rate limiting, circuit breaking, and observability — all before a request ever reaches your upstream services.
 
Built this to deeply understand what happens *under the hood* of tools like **Kong**, **AWS API Gateway**, and **NGINX** — and to prove I could build one from scratch.
 
---
 
##  Tech Stack
 
| Layer             | Technology                                          |
|-------------------|-----------------------------------------------------|
| Runtime           | Node.js (native `http` module, no Express)          |
| Auth              | JWT + RBAC middleware                               |
| Rate Limiting     | Redis (INCR/TTL + sliding window)                   |
| Reverse Proxy     | `http-proxy` package                                |
| Circuit Breaker   | Custom 3-state (CLOSED / OPEN / HALF-OPEN)          |
| Logging           | Custom color-coded logger + file persistence        |
| Health Checks     | Parallel checks via `Promise.all`                   |
| Real-time UI      | Socket.io + React + Tailwind CSS                    |
| Persistence       | MongoDB Atlas (TTL-indexed request logs)            |
| Config Reload     | MongoDB Change Streams (hot reload, no restart)     |
| Containerization  | Docker + Docker Compose                             |
 
---

##  System Architecture

![Architecture](./assets/architecture.png)

---


##  Features
 
- **Reverse Proxy** — Routes incoming requests to the correct downstream microservice using `http-proxy`
- **JWT + RBAC Auth** — Verifies tokens and enforces role-based access control per route before forwarding
- **Redis Rate Limiting** — Per-IP sliding window rate limiting using Redis INCR/TTL; blocks requests that exceed the threshold
- **Circuit Breaker** — Custom 3-state machine (CLOSED → OPEN → HALF-OPEN) that stops forwarding to unhealthy services and auto-recovers
- **Structured Logging** — Color-coded console output with request metadata (method, path, status, latency) + file persistence for every request and error
- **Health Check Metrics** — Periodic parallel health checks via `Promise.all` across all upstream services, exposing per-service latency, status (UP/DOWN), and surfacing results live on the dashboard
- **Custom Header Injection** — Attaches metadata headers (e.g. `X-Request-ID`, `X-Forwarded-For`) before forwarding to upstream services
- **Hot Config Reload** — Live route/config updates via MongoDB Change Streams — no server restart needed
- **Request Log Persistence** — All request logs stored in MongoDB Atlas with TTL indexes for automatic expiry
- **Real-time Dashboard** — Socket.io + React dashboard showing live traffic, latency, error rates, circuit breaker state, and service health
- **Dockerized** — Gateway, microservices, Redis, and dashboard all orchestrated with Docker Compose
---

##  File Structure

```
api-gateway/
├── gateway/
│   ├── index.js                  
│   ├── socket.js 
│   ├── health.js
│   ├── db.js
│   ├── circuitBreaker.js
│   ├── scripts/
│   │   └── seedRoutes.js
│   ├── models/
│   │   └── RequestLogs.js
│   │   └── Route.js
│   ├── config/  
│   │   └── routeManager.js  
│   │     
├── middleware/
│   ├── auth.js                  
│   ├── logger.js 
│   ├── rateLimiter.js
│   |
│
├── services/
│   ├── order/
│   │   └── index.js
│   │   └── Dockerfile              
│   ├── product/
│   │   └── index.js 
│   │   └── Dockerfile             
│   └── user/
│   |    └── index.js
│   │    └── Dockerfile              
│
├── dashboard/                    
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── CircuitPanel.jsx
│   │       ├── LiveChart.jsx
│   │       └── RequestLog.jsx
│   │       └── StatGrid.jsx
│   │       └── TopBar.jsx
│   │       └── TopRoutes.jsx
│   └── Dockerfile
│
├── gateway/Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```
 
---


 
