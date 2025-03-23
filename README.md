# DocBOOK - Doctor Appointment Booking System

## Overview
DocBOOK is a MERN stack web application that enables users to book doctor appointments seamlessly. The platform provides a user-friendly interface for both patients and administrators, ensuring a smooth booking experience.

## Features
- **User Panel**: Register, login, browse doctors, and book appointments.
- **Admin Panel**: Manage doctors, appointments, and users.
- **Authentication**: JWT-based authentication with role-based access.
- **Payment Integration**: Secure Stripe payment for appointment booking.
- **Real-time Notifications**: Instant booking confirmations with React Toastify.
- **Responsive UI**: Fully optimized for mobile and desktop users.

## Tech Stack
- **Frontend**: React, React Context, Axios, React Toastify
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Styling**: Tailwind CSS
- **Payment**: Stripe Integration

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/DocBOOK.git
   ```
2. Navigate to the project directory:
   ```bash
   cd DocBOOK
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
4. Set up environment variables in `.env` (Refer to `.env.example` for required variables).
5. Start the development server:
   ```bash
   cd client && npm run dev
   cd ../server && npm run dev
   ```

## Usage
- **Users**: Register/login, search for doctors, book appointments, and make payments.
- **Admins**: Manage doctors, users, and appointments.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

## Acknowledgments
- **Stripe** for payment integration
- **React Toastify** for notifications

