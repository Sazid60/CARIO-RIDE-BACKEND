# RIDE MANAGEMENT APP - BACKEND

#### Live Link : [link](https://b5-a5-sazid.vercel.app)

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

## Key Features

### **_Authentication & Role Management_**

- Secure JWT-based login system
- Passwords hashed using bcrypt
- Role-based access control for **ADMIN**, **RIDER**, and **DRIVER**
- Google OAuth 2.0 login support and manual registration/login
- Set password route available after Google login
- Forgot password sends email with reset link containing temporary token
- Reset password and change password with proper access control
- Token refresh via `/auth/refresh-token`
- Logout clears tokens from cookies for secure sign-out

---

### **_Rider Capabilities_**

- Request ride (only if no ongoing ride and user is not blocked)
- Fare calculated dynamically using Haversine formula × base rate (`100 BDT/km`)
- Cancel ride if:
  - Not yet accepted
  - Fewer than 3 cancellations in the last 24 hours
- View ride history:
  - All rides via `/all-rides-rider`
  - Specific ride via `/my-ride/:id`
- Discover nearby drivers within 1 km using pickup coordinates
- Submit feedback & rate drivers post-ride
  - Driver’s average rating dynamically updates

---

### **Driver Capabilities**

- Register as driver with vehicle details & driving license (via `form-data`)
- Update driver profile with new vehicle/license info (also via `form-data`)
- View own driver profile (`/drivers/me`)
- Go online (location submitted & saved); go offline (location removed)
- Discover nearby ride requests within 1 km
- Accept(Only when not engaged in another ride) or reject ride requests (based on current status)
- Progress ride statuses:
  - `ACCEPTED → PICKED_UP → IN_TRANSIT → COMPLETED`
- View:
  - Ride history via `/all-rides-driver`
  - Earnings via `/stats/earning-history`
- Upon ride completion:
  - Driver income updated
  - Rider's current location set to destination
  - All statuses reset

---

### **Admin Controls**

- Approve/Suspend drivers: `/drivers/status/:id`
- Block/Unblock users: `/users/change-status/:id`
- View:
  - All users
  - Single user
  - All drivers
  - Single driver
  - All rides in the system
- Generate system-wide ride and earnings report via `/stats/earning-history`

---

### **System Architecture**

- Modular folder structure: `auth/`, `users/`, `drivers/`, `rides/`, `stats/`
- Robust Zod validation & centralized `AppError`-based error handling
- JWT-based route protection with role-based guards
- Geospatial ride matching:
  - Uses `GeoJSON` + `Haversine-distance`
- Full ride lifecycle tracking with timestamps per status transition
- Tokens stored in `HTTP-only cookies`; logout clears tokens securely
- Password, token, and status logic properly handled for Google login users

## Admin Login Credentials 

```
ADMIN_EMAIL= admin@gmail.com
ADMIN_PASSWORD= Admin123@

```
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

#### **_Set All the .env configurations_**

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

#### **_Install The Dependencies_**

```
npm install
```

#### **_Run the Project_**

```
npm run dev
```

### I Recommend To use my postman collection in the postman_collection folder for testing this project and for clarities check all detailed Api Endpoints here.

# API Endpoints with Proper Explanations

## USER AND AUTH RELATED API

- ### **_Create User (Register)_**

**_Endpoint:_**

```
api/v1/users/register
```

**_Method:_** `POST`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/users/register
```

**_Access:_** Everyone can Access this Route

**_Description:_** By default the user role will be RIDER

**_Special Notes :_** N/A

**_Required Fields:_**

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

- ### **_User Login (Credentials Login)_**

**_Endpoint:_**

```
api/v1/auth/login
```

**_Method:_** `POST`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/auth/login
```

**_Access:_** Everyone can Access this Route

**_Description:_** The Login Information will go through validations like exists or not, password matches or not and In return It Will Give us a access token and a refresh token

**_Special Notes:_** N/A

**_Required Fields:_**

```json
{
  "email": "driver@gmail.com",
  "password": "Driver@123a"
}
```

- ### **_User Login (Google Login)_**

```
https://b5-a5-sazid.vercel.app/api/v1/auth/google
```

- Hit This route in your browser this will redirect you to the google consent screen

**_Special Notes:_** `As There Is No Frontend The token will not be set using the google login for now! You have to set Password Additionally If You have Logged In usinmg google ! `

- ### **_Set Password For Google Logged in User_**

**_Endpoint:_**

```
/api/v1/auth/set-password
```

**_Method:_** `POST`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/auth/set-password
```

**_Access:_** Everyone can Access this Route

**_Description:_** The Google Logged in user can set their password as for google login not password is set.

**_Special Notes:_** Set the Access token retrieved from frontend inside the header Authorization

**_Required Fields:_**

```json
{
  "password": "Shakil33@"
}
```

- ### **_Forgot Password_**

**_Endpoint:_**

```
/api/v1/auth/forgot-password
```

**_Method:_** `POST`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/auth/forgot-password
```

**_Access:_** Everyone can Access this Route

**_Description:_** This will send an email with a button named reset. by clicking the button it will redirect to a frontend url in the url there will be a access token (10 minute validation) and the userId. with this information Hit The reset password route for reset password

**_Special Notes:_** N/A

**_Required Fields:_**

```json
{
  "email": "shahnawazsazid69@gmail.com"
}
```

- ### **_Reset Password_**

**_Endpoint:_**

```
/api/v1/auth/reset-password
```

**_Method:_** `POST`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/auth/reset-password
```

**_Access:_** Who have requested for forget password

**_Description:_** After Hitting forget-password route set the access token(short time access token) in header Authorization and id newPassword in body and this will validate and reset the password.

**_Special Notes:_** `Set the access token from the frontend url in the header Authorization`

**_Required Fields:_**

```json
{
  "id": "688ce948d9111e28bdc2331f",
  "newPassword": "Rider123@"
}
```

- ### **_Change Password_**

**_Endpoint:_**

```
/api/v1/auth/change-password
```

**_Method:_** `POST`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/auth/change-password
```

**_Access:_** Every User has This Route Access

**_Description:_**

**_Special Notes:_** Set The Access token to the header to access this route if everything is valid it will change the password

**_Required Fields:_**

```json
{
  "oldPassword": "Rider@123",
  "newPassword": "Rider123@"
}
```

- ### **_Get Your Own Profile_**

**_Endpoint:_**

```
api/v1/users/me
```

**_Method:_** `GET`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/users/me
```

**_Access:_** Every Logged In User has This Route Access

**_Description:_** Will retrieve the logged In User information using the token.

**_Special Notes:_** `Token Must Needed As userId From The Token Will be Used to search The User`

**_Required Fields:_** N/A

- ### **_Update User_**

**_Endpoint:_**

```
/api/v1/users/:id
```

**_This Id Will be the \_id of a user from the user collection_**

**_Method:_** `PATCH`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/users/688ce948d9111e28bdc2331f
```

**_Access:_** Every Logged In User has This Route Access

**_Description:_** this will update the desired fields that user wants to update. Data sanitization will be done here because sensitive information that a user has no right to change will be prevented.

**_Special Notes:_** `Set the access token after login in the authorization  As userId From The Token Will be Used to search The User`

**_Required Fields:_**

```js
{
    "phone": "+8801639768727",
    "location": {
        "type": "Point",
        "coordinates": [
            90.4125,
            23.8103
        ]
    }
}
```

- ### **_Get All Users List_**

**_Endpoint:_**

```
/api/v1/users/all-users
```

**_Method:_** `GET`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/users/all-users
```

**_Access:_** Only Logged In `Admin` has this route access

**_Description:_** If there is valid token of admin inside the header authorization it will retrieve all users information

**_Special Notes:_** `Set the access token after login in the authorization  As userId From The Token Will be Used to search The User`

**_Required Fields:_** N/A

- ### **_Get Single User Information_**

**_Endpoint:_**

```
/api/v1/users/688ce8b3ae33ed0887c79358
```

**_Method:_** `GET`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/users/688ce8b3ae33ed0887c79358
```

**_Access:_** Only Logged In `Admin` has this route access

**_Description:_** If there is valid token of admin inside the header authorization it will retrieve all users information

**_Special Notes:_** `Set the access token after login in the authorization  As userId From The Token Will be Used to search The User`

**_Required Fields:_** N/A

- ### **_Block/Unblock User_**

**_Endpoint:_**

```
/api/v1/users/:id
```

**_This Id Will be the \_id of a user from the user collection_**

**_Method:_** `PATCH`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/users/change-status/688ce948d9111e28bdc2331f
```

**_Access:_** Only Logged In `Admin` has this route access

**_Description:_** If there is valid token of admin inside the header authorization it will change the status from blocked to unblocked and unblocked to blocked.

**_Special Notes:_** `Set the access token after login in the authorization  As userId From The Token Will be Used to search The User`

**_Required Fields:_**

```json
{
  "isBlocked": "BLOCKED"
}
```

- ### **_Refresh Token_**

**_Endpoint:_**

```
/api/v1/auth/:id
```

**_Method:_** `POST`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/auth/refresh-token
```

**_Access:_** Every User has This Route Access

**_Description:_** If login token is expired use this route to generate new access token

**_Special Notes:_** N/A

**_Required Fields:_**

```js
{
    "email": "driver@gmail.com",
    "password": "Driver@123"
}
```

- ### **_Logout User_**

**_Endpoint:_**

```
/api/v1/auth/logout
```

**_Method:_** `POST`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/auth/logout
```

**_Access:_** Every User has This Route Access

**_Description:_** If user is logged in hit this route to logout the user. It will remove the tokens from the cookies

**_Special Notes:_** N/A

**_Required Fields:_** N/A

## DRIVER MODEL RELATED API

- ### **_Register as a Driver_**

**_Endpoint:_**

```
/api/v1/drivers/register
```

**_Method:_** `POST`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/drivers/register
```

**_Access:_** Every User has This Route Access

**_Description:_** If a user/rider Want He can register as a driver. A user have to give `vehicle information` and upload his `drivingLicense`.

**_Special Notes:_** You have to set the login access token in header authorization to access this route. And remember you have to put the information in form data and upload an image of driving license.

**_Required Fields:_**

```json
// add in form data - > data
{
  "vehicle": {
    "vehicleNumber": "ABC-1234",
    "vehicleType": "BIKE"
  }
}

// upload driving license image in form data -> file
```

- ### **_Admin Approve The Driver_**

**_Endpoint:_**

```
https://b5-a5-sazid.vercel.app/api/v1/drivers/status/:id
```

**_Method:_** `PATCH`

**_This Id Will be the \_id of a driver from the Driver collection_**

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/drivers/status/688cf801d38ee39b116d95ea
```

**_Access:_** Only `Admin` has The Access of This Route

**_Description:_** If Admin hits this route with te status in the body admin can `APPROVED`, `SUSPENDED` a driver.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_**

```json
{
  "driverStatus": "APPROVED"
  // SUSPENDED
}
```

- ### **_See Single Driver Information_**

**_Endpoint:_**

```
/api/v1/drivers/:id
```

**_Method:_** `GET`

**_This Id Will be the \_id of a driver from the Driver collection_**

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/drivers/688cf4e7fb36356243740aa1
```

**_Access:_** Only `Admin` has The Access of This Route

**_Description:_** This will give the single driver information

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

- ### **See All Drivers List**

**_Endpoint:_**

```
/api/v1/drivers/all-drivers
```

**_Method:_** `GET`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/drivers/all-drivers
```

**_Access:_** Only `Admin` has The Access of This Route

**_Description:_** Admin can see all the Drivers by hitting this route

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

#### **_After Approval The User Who have Requested to be a driver will have to login gain or refresh the token asd Token do not get automatically refreshed_**

- ### **_See My Own Driver Profile_**

**_Endpoint:_**

```
/api/v1/drivers/me
```

**_Method:_** `GET`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/drivers/me
```

**_Access:_** Only `Driver` has The Access of This Route

**_Description:_** This will give the single driver information

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

- ### **_Update My Driver Profile_**

**_Endpoint:_**

```
/api/v1/drivers/update-my-driver-profile
```

**_Method:_** `PATCH`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/drivers/update-my-driver-profile
```

**_Access:_** Only `Driver` has The Access of This Route

**_Description:_** Driver can Update his vehicle information and Driving License from here.

**_Special Notes:_** You have to set the login access token in header authorization to access this route. And remember you have to put the information in form data and upload an image of driving license.

**_Required Fields:_**

```json
// add in form data - > data
{
  "vehicle": {
    "vehicleNumber": "ABC-1234",
    "vehicleType": "BIKE"
  }
}

// upload driving license image in form data -> file
```

- ### **_Driver Going Online_**

**_Endpoint:_**

```
/api/v1/drivers/go-online
```

**_Method:_** `PATCH`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/drivers/go-online
```

**_Access:_** Only `Driver` has The Access of This Route

**_Description:_** Driver have to put the location coordinate to go online this will be set as current Location.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_**

```json
{
  "type": "Point",
  "coordinates": [90.4015, 23.751]
}
```

- ### **Driver Going Offline**

**_Endpoint:_**

```
/api/v1/drivers/go-offline
```

**_Method:_** `PATCH`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/drivers/go-offline
```

**_Access:_** Only `Driver` has The Access of This Route

**_Description:_** If Driver Hits This Route Driver status will be Offline and the Current Location will be removed And neo one can see this driver.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

## RIDE MODEL RELATED API

- ### **_Rider Request a Ride_**

**_Endpoint:_**

```
/api/v1/rides/request
```

**_Method:_** `POST`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/request
```

**_Access:_** Only `RIDER` has The Access of This Route

**_Description:_** If The ride is requested the distance between pickup location and destination will be calculated accordingly the distance and the base ride price.

**_Special Notes:_** You have to set the login access token in header authorization to access this route. the base fare price is kept `baseFarePerKm = 100`

**_Required Fields:_**

```json
{
  "pickupLocation": {
    "type": "Point",
    "coordinates": [90.4015, 23.751]
  },
  "destination": {
    "type": "Point",
    "coordinates": [90.39148, 23.75096]
  }
}
```

- ### **Rider Cancel a Ride**

**_Endpoint:_**

```
/api/v1/rides/cancel-ride/:id
```

**_Method:_** `PATCH`

**_This Id Will be the \_id of a Ride from the Ride collection_**

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/cancel-ride/688cfa6fd38ee39b116d9634
```

**_Access:_** Only `RIDER` has The Access of This Route

**_Description:_** A Rider can cancel a ride he has created. The logic is `if the ride is already accepted the rid can not be cancelled`. `And a rider can not cancel more than 3 rides in a day `

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

- ### **_See Drivers Around Me_**

**_Endpoint:_**

```
/api/v1/rides/drivers-near
```

**_Method:_** `GET`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/drivers-near
```

**_Access:_** Only `RIDER` has The Access of This Route

**_Description:_** A rider can see the drivers around his pickup location (within 1 km). This pickup location will match the current location of driver who are with in 1 km of the pickup location.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

- ### **_See My Requested Ride Info_**

**_Endpoint:_**

```
/api/v1/rides/my-ride/:id
```

**_This Id Will be the \_id of a Ride from the Ride collection_**

**_Method:_** `GET`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/my-ride/688cf90bd38ee39b116d95fe
```

**_Access:_** Only `RIDER` has The Access of This Route

**_Description:_** The requested Ride Info will be retrieved if the ride's riderId and The user requested user id matches.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

- ### **_See All My Rides Info_**

**_Endpoint:_**

```
/api/v1/rides/all-rides-rider
```

**_Method:_** `GET`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/all-rides-rider
```

**_Access:_** Only `RIDER` has The Access of This Route

**_Description:_** All the rides Info will be retrieved if the ride's riderId and The user requested user id matches.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

- ### **_See Riders Around Me (Driver)_**

**_Endpoint:_**

```
/api/v1/rides/rides-near
```

**_Method:_** `GET`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/rides-near
```

**_Access:_** Only `DRIVER` has The Access of This Route

**_Description:_** A driver can see the rides around him within 1 km. This will be matched accordingly with the driver `currentLocation` and rider `pickupLocation`
**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

- ### **_Reject Ride Request (Driver)_**

**_Endpoint:_**

```
/api/v1/rides/reject-ride/:id
```

**_This Id Will be the \_id of a Ride from the Ride collection_**

**_Method:_** `PATCH`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/reject-ride/688cf90bd38ee39b116d95fe
```

**_Access:_** Only `DRIVER` has The Access of This Route

**_Description:_** A Driver can reject a ride only if its not already accepted or already in a ride. If rejected any ride the ride will not more show around him and the rider can not also even see the driver around him.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

- ### **_Accept Ride Request (Driver)_**

**_Endpoint:_**

```
/api/v1/rides/accept-ride/:id
```

**_This Id Will be the \_id of a Ride from the Ride collection_**

**_Method:_** `PATCH`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/accept-ride/688d0ca1ef2ee7a54fb72d5f
```

**_Access:_** Only `DRIVER` has The Access of This Route

**_Description:_** A Driver can reject a ride only if its not already accepted or already in a ride. If rejected any ride the ride will not more show around him and the rider can not also even see the driver around him.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

- ### **_Pickup Rider (Driver)_**

**_Endpoint:_**

```
/api/v1/rides/pickup-rider/:id
```

**_This Id Will be the \_id of a Ride from the Ride collection_**

**_Method:_** `PATCH`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/pickup-rider/688d0ca1ef2ee7a54fb72d5f
```

**_Access:_** Only `DRIVER` has The Access of This Route

**_Description:_** If the ride is accepted by the driver trying to pickup will be allowed to pickup the rider.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

- ### **_Start Ride (Driver)_**

**_Endpoint:_**

```
/api/v1/rides/start-ride/:id
```

**_This Id Will be the \_id of a Ride from the Ride collection_**

**_Method:_** `PATCH`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/start-ride/688dd2d202a28032cbfcca3f
```

**_Access:_** Only `DRIVER` has The Access of This Route

**_Description:_** If the rider is picked up the driver can start the ride.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

- ### **_Complete Ride (Driver)_**

**_Endpoint:_**

```
/api/v1/rides/complete-ride/:id
```

**_This Id Will be the \_id of a Ride from the Ride collection_**

**_Method:_** `PATCH`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/complete-ride/688dd2d202a28032cbfcca3f
```

**_Access:_** Only `DRIVER` has The Access of This Route

**_Description:_** Driver can Hit Complete the ride. This will add the fare amount to diver Income and driver all status will be reset and the rider status will be reset as well.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

### **_Remember After Completion of a Ride The Rider Current Location will be the destination Of The Ride_**

- ### **_Feedback and Rate a Ride (Rider)_**

**_Endpoint:_**

```
/api/v1/rides/feedback/:id
```

**_This Id Will be the \_id of a Ride from the Ride collection_**

**_Method:_** `POST`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/feedback/688d0ca1ef2ee7a54fb72d5f
```

**_Access:_** Only `RIDER` has The Access of This Route

**_Description:_** A rider can give feedback to the ride and rate the ride. the rating will be dynamically adjusted wih the current rating of the driver

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_**

```json
{
  "feedback": "Vey Nice",
  "rating": 4.5
}
```

- ### **_See all My Rides (driver)_**

**_Endpoint:_**

```
/api/v1/rides/all-rides-driver
```

**_Method:_** `GET`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/all-rides-driver
```

**_Access:_** Only `DRIVER` has The Access of This Route

**_Description:_** A rider can see all the rides associated by him.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

- ### **_See all Rides of the system (Admin)_**

**_Endpoint:_**

```
/api/v1/rides/all-rides-admin
```

**_Method:_** `GET`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/rides/all-rides-admin
```

**_Access:_** Only `ADMIN` has The Access of This Route

**_Description:_** A rider can see all the rides created by users.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

## STATISTICS RELATED API

- ### **_Generate Rides Reports (Admin)_**

**_Endpoint:_**

```
/api/v1/stats/earning-history
```

**_Method:_** `GET`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/stats/earning-history
```

**_Access:_** Only `ADMIN` has The Access of This Route

**_Description:_** Admin can see all the summary on rides collections. can see summary of completed, cancelled, Requested rides, total revenue, total riders, total drivers, average fare.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

- ### **_Generate Rides Reports for Driver (Driver)_**

**_Endpoint:_**

```
/api/v1/stats/earning-history
```

**_Method:_** `GET`

**_URL:_**

```
https://b5-a5-sazid.vercel.app/api/v1/stats/earning-history
```

**_Access:_** Only `DRIVER` has The Access of This Route

**_Description:_** Admin can see all the summary on rides collections. can see summary of completed, cancelled, total Earnings.

**_Special Notes:_** You have to set the login access token in header authorization to access this route.

**_Required Fields:_** N/A

# API ENDPOINT SUMMARY

## AUTH / USER API

| Method | Endpoint                          | Access          | Body Parameters                        | Description                   |
| ------ | --------------------------------- | --------------- | -------------------------------------- | ----------------------------- |
| POST   | `/api/v1/users/register`          | Everyone        | name, email, password, location, phone | Register as Rider             |
| POST   | `/api/v1/auth/login`              | Everyone        | email, password                        | Login with credentials        |
| POST   | `/api/v1/auth/set-password`       | Google Users    | password                               | Set password for Google login |
| POST   | `/api/v1/auth/forgot-password`    | Everyone        | email                                  | Request password reset        |
| POST   | `/api/v1/auth/reset-password`     | Requested Users | id, newPassword                        | Reset password using token    |
| POST   | `/api/v1/auth/change-password`    | Logged-in users | oldPassword, newPassword               | Change current password       |
| GET    | `/api/v1/users/me`                | Logged-in users | –                                      | Get logged-in user profile    |
| PATCH  | `/api/v1/users/:id`               | Logged-in users | phone, location                        | Update user info              |
| GET    | `/api/v1/users/all-users`         | Admin           | –                                      | Get all users                 |
| GET    | `/api/v1/users/:id`               | Admin           | –                                      | Get user by ID                |
| PATCH  | `/api/v1/users/change-status/:id` | Admin           | isBlocked                              | Block or unblock user         |
| POST   | `/api/v1/auth/refresh-token`      | Logged-in users | email, password                        | Refresh access token          |
| POST   | `/api/v1/auth/logout`             | Logged-in users | –                                      | Logout and clear cookies      |

## DRIVER API

| Method | Endpoint                                   | Access | Body Parameters                             | Description            |
| ------ | ------------------------------------------ | ------ | ------------------------------------------- | ---------------------- |
| POST   | `/api/v1/drivers/register`                 | User   | vehicle (form-data), driving license (file) | Register as driver     |
| PATCH  | `/api/v1/drivers/status/:id`               | Admin  | driverStatus                                | Approve/Suspend driver |
| GET    | `/api/v1/drivers/:id`                      | Admin  | –                                           | Get single driver      |
| GET    | `/api/v1/drivers/all-drivers`              | Admin  | –                                           | Get all drivers        |
| GET    | `/api/v1/drivers/me`                       | Driver | –                                           | Get own driver profile |
| PATCH  | `/api/v1/drivers/update-my-driver-profile` | Driver | vehicle (form-data), driving license (file) | Update driver profile  |
| PATCH  | `/api/v1/drivers/go-online`                | Driver | type, coordinates                           | Set driver online      |
| PATCH  | `/api/v1/drivers/go-offline`               | Driver | –                                           | Set driver offline     |

## RIDE API

| Method | Endpoint                          | Access | Body Parameters             | Description              |
| ------ | --------------------------------- | ------ | --------------------------- | ------------------------ |
| POST   | `/api/v1/rides/request`           | Rider  | pickupLocation, destination | Request a ride           |
| PATCH  | `/api/v1/rides/cancel-ride/:id`   | Rider  | –                           | Cancel a ride            |
| GET    | `/api/v1/rides/drivers-near`      | Rider  | –                           | Find drivers nearby      |
| GET    | `/api/v1/rides/my-ride/:id`       | Rider  | –                           | Get single ride          |
| GET    | `/api/v1/rides/all-rides-rider`   | Rider  | –                           | Get all rides by rider   |
| GET    | `/api/v1/rides/rides-near`        | Driver | –                           | Get nearby ride requests |
| PATCH  | `/api/v1/rides/reject-ride/:id`   | Driver | –                           | Reject ride request      |
| PATCH  | `/api/v1/rides/accept-ride/:id`   | Driver | –                           | Accept a ride            |
| PATCH  | `/api/v1/rides/pickup-rider/:id`  | Driver | –                           | Pickup the rider         |
| PATCH  | `/api/v1/rides/start-ride/:id`    | Driver | –                           | Start the ride           |
| PATCH  | `/api/v1/rides/complete-ride/:id` | Driver | –                           | Complete the ride        |
| POST   | `/api/v1/rides/feedback/:id`      | Rider  | feedback, rating            | Submit feedback & rating |
| GET    | `/api/v1/rides/all-rides-driver`  | Driver | –                           | Get all driver rides     |
| GET    | `/api/v1/rides/all-rides-admin`   | Admin  | –                           | Get all system rides     |

## STATISTICS API

| Method | Endpoint                        | Access | Body Parameters | Description                                  |
| ------ | ------------------------------- | ------ | --------------- | -------------------------------------------- |
| GET    | `/api/v1/stats/earning-history` | Admin  | –               | Full system stats (rides, earnings, revenue) |
| GET    | `/api/v1/stats/earning-history` | Driver | –               | Driver-specific ride stats and earnings      |
