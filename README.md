# WhatsApp Messaging Application

## Project Description
This project is a WhatsApp messaging application that allows users to send messages through the WhatsApp Web API.

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd whatsapp-bot
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Run the server:
   ```bash
   cd server
   npm run dev
   ```

5. Run the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Usage
- Access the frontend at `http://localhost:3000`.
- Available API endpoints:
  - `/wa`: WhatsApp functionality.
  - `/auth`: Authentication.

## Scripts
- **Server**:
  - `dev`: Start the server in development mode using nodemon.
  
- **Frontend**:
  - `dev`: Start the frontend development server using Vite.
  - `build`: Build the frontend for production.
  - `lint`: Lint the frontend code.

## Dependencies
- **Server**:
  - Express
  - CORS
  - WhatsApp Web.js
  
- **Frontend**:
  - React
  - React Router
  - Vite

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the ISC License.
