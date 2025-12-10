# Booking Metting Room 
## Run backend
- run in development (npm run dev)
- backend should run on http://localhost:3000

## Run Frontend
- start frontend (npm run dev)
-  This starts Vite de server (default: localhost:5173)

## Booking conflict logic explained
when new booking overlaps an existing booking in the same room 
The rule used
-  Two bookings conflict if their time ranges overlap — even partially

 Existing.start < New.end
 
AND

Existing.end > New.start

## Authentication Flow
- JWT for user Login
- Admin and user roles
- Protected routes using middleware

### JWT Middleware
Every protected backend route requirs 

Authorization: Bearer <token>


### Admin Routs
- Create rooms(post  /rooms)
- View all booking (GET /admin/bookings)

### User Roles
- view itself booking
- booking Room
- Edit booking
  








