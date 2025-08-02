# RIDE MANAGEMENT APP - BACKEND

#### Live Link

### Project Overview

This is a full-featured backend API developed for a ride-sharing platform, enabling riders to book and manage rides, drivers to handle trips and availability, and admins to oversee the entire system. The project emphasizes security, scalability, and a modular architecture, with clear role-based access control.

Built using typescript, Express.js and MongoDB, Mongoose, the system implements JWT-based authentication, bcrypt for password hashing, GeoJSON location queries and haversine-distance to match nearby drivers and riders, for email sending purpose nodemailer is used, for validation Zod is used, for authentication passportjs is used and for maintaining the tokens JWT is used. It supports a full ride lifecycle, from request to completion, with real-time status updates, role-specific permissions, and admin-level user and driver management. Driver document uploads are handled via Multer, and the API is fully tested and documented using Postman.

### Technologies Used

- **Node.js + Express.js** – Server-side development and API routing
- **TypeScript** – Adds static typing for better scalability and developer experience
- **MongoDB + Mongoose** – Database to store users, rides, and system data
- **JWT** – Secure token-based authentication for protected routes
- **bcryptjs** – Password hashing for user security
- **Zod** – Request validation and schema enforcement
- **Passport.js** – User authentication local and Google OAuth support was used
- **cookie-parser + express-session** – Session handling and cookie management
- **Multer + Cloudinary** – File uploads driver documents
- **haversine-distance** – Calculate distance between pickup and driver location
- **nodemailer** – Send emails in case like password reset links
- **CORS + dotenv** – Environment config and cross-origin requests handling
- **ts-node-dev** – Auto reload server during development
- **ESLint** – Enforce consistent code quality

### Key Features

#### Authentication & Role Management

- Secure JWT-based login system
- Passwords hashed using bcrypt
- Role-based access control for admin, rider, driver
- Google authentication and as well as Local Registration
- Forgot password, set password, change password, reset password functionality

#### Rider Capabilities

- Request Ride only if any other ride is not ongoing and the user is not blocked
- cancel rides only before driver accepts the ride
- View ride history(cancelled, Requested and completed rides)
- View specific ride info
- Discover nearby drivers using location data
- Submit feedback and ratings after ride completion

#### Driver Capabilities

- Accept or reject ride requests
- Update ride status through: Picked Up → In Transit → Completed
- Go online taking the current location
- Go offline removing the current location
- View ride and earnings history

#### Admin Controls

- Approve or suspend drivers
- Block or unblock users
- Access over user and ride data
- Generate system-wide earnings reports

#### System Architecture

- Modular folder structure: auth/, users/, drivers/, rides/
- Centralized role-based route protection
- Full ride lifecycle tracking with timestamps for each status change

### Project Structure

```
├─ .gitignore
├─ Postman_Collection
│  └─ B5-A5_Postman_Collection.json
├─ Readme.md
├─ eslint.config.mjs
├─ package-lock.json
├─ package.json
├─ src
│  ├─ app.ts
│  ├─ app
│  │  ├─ config
│  │  │  ├─ cloudinary.config.ts
│  │  │  ├─ env.ts
│  │  │  ├─ multer.config.ts
│  │  │  └─ passport.ts
│  │  ├─ constants.ts
│  │  ├─ errorHelpers
│  │  │  └─ AppError.ts
│  │  ├─ helpers
│  │  │  ├─ handleCastError.ts
│  │  │  ├─ handleDuplicateError.ts
│  │  │  ├─ handleValidationError.ts
│  │  │  └─ handleZodError.ts
│  │  ├─ interfaces
│  │  │  ├─ error.types.ts
│  │  │  └─ index.d.ts
│  │  ├─ middlewares
│  │  │  ├─ checkAuth.ts
│  │  │  ├─ globalErrorHandler.ts
│  │  │  ├─ notFound.ts
│  │  │  └─ validateRequest.ts
│  │  ├─ modules
│  │  │  ├─ auth
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  ├─ auth.route.ts
│  │  │  │  └─ auth.service.ts
│  │  │  ├─ driver
│  │  │  │  ├─ driver.controller.ts
│  │  │  │  ├─ driver.interface.ts
│  │  │  │  ├─ driver.model.ts
│  │  │  │  ├─ driver.route.ts
│  │  │  │  ├─ driver.service.ts
│  │  │  │  └─ driver.validation.ts
│  │  │  ├─ ride
│  │  │  │  ├─ ride.controller.ts
│  │  │  │  ├─ ride.interface.ts
│  │  │  │  ├─ ride.model.ts
│  │  │  │  ├─ ride.route.ts
│  │  │  │  ├─ ride.service.ts
│  │  │  │  └─ ride.validation.ts
│  │  │  ├─ stats
│  │  │  │  ├─ stats.controller.ts
│  │  │  │  ├─ stats.route.ts
│  │  │  │  └─ stats.service.ts
│  │  │  └─ user
│  │  │     ├─ user.constant.ts
│  │  │     ├─ user.controller.ts
│  │  │     ├─ user.interface.ts
│  │  │     ├─ user.model.ts
│  │  │     ├─ user.route.ts
│  │  │     ├─ user.service.ts
│  │  │     └─ user.validation.ts
│  │  ├─ routes
│  │  │  └─ index.ts
│  │  └─ utils
│  │     ├─ QueryBuilder.ts
│  │     ├─ calculateDistanceAndFare.ts
│  │     ├─ catchAsync.ts
│  │     ├─ jwt.ts
│  │     ├─ seedAdmin.ts
│  │     ├─ sendEmail.ts
│  │     ├─ sendResponse.ts
│  │     ├─ setCookie.ts
│  │     ├─ templates
│  │     │  └─ forgetPassword.ejs
│  │     └─ userToken.ts
│  └─ server.ts
├─ tsconfig.json
└─ vercel.json
```

### How to Run the Project In Your Local Machine ?

#### Clone the Repository

```
git clone https://github.com/Sazid60/Ride-Booking-App-Backend-Sazid.git

```

#### Go inside the folder

```
cd Ride-Booking-App-Backend-Sazid

```

#### Eet All the .env configurations

```
PORT=
DB_URL=
NODE_ENV=
BCRYPT_SALT_ROUND=
JWT_ACCESS_EXPIRES=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES=
ADMIN_EMAIL=
ADMIN_PASSWORD=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
EXPRESS_SESSION_SECRET=
FRONTEND_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

```

#### Install The Dependencies

```
npm install
```

#### Run the Project

```
npm run dev
```

### API Endpoints with Proper Explanations



#### Create User (Register)

**Endpoint:** `api/v1/users/register`
**Method:** `POST`

**URL:** `https://b5-a5-sazid.vercel.app/api/v1/users/register`

**Access Control:** Everyone can Access this Route 

**Description:** By default the user role will be RIDER

**Special Notes :** N/A

**Required Fields:**

```json
{
  "name": "Rider",
  "email": "shahnawazsazid69@gmail.com",
  "password": "Rider@123",
  "location": {
    "type": "Point",
    "coordinates": [90.4125, 23.8103]
  },
  "phone": "+8801787654321"
}
```

#### User Login (Credentials Login)

**Endpoint:** `api/v1/auth/login`
**Method:** `POST`

**URL:** `https://b5-a5-sazid.vercel.app/api/v1/auth/login`

**Access Control:** Everyone can Access this Route 

**Description:** The Login Information will go through validations like exists or not, password matches or not and In return It Will Give us a access token and a refresh token

**Special Notes:** N/A

**Required Fields:** 

```json 
{
  "email": "driver@gmail.com",
  "password": "Driver@123a"
}
```

#### User Login (Google Login)

```
https://b5-a5-sazid.vercel.app/api/v1/auth/google

```
- Hit This route this will redirect you to the google consent screen

**Special Notes:**  `As There Is No Frontend The token will not be set using the google login for now!`

#### Get Your Own Profile 

**Endpoint:** `api/v1/users/me`
**Method:** `GET`

**URL:** `https://b5-a5-sazid.vercel.app/api/v1/users/me`

**Description:** Will retrieve the logged In User information using the token. 

**Special Notes:** `Token Must Needed As userId From The Token Will be Used to search The User`

**Required Fields:** Set the access token after login in the authorization 
