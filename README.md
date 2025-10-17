# Backend Wizards - Stage 0 Task

A dynamic profile API endpoint that returns user information along with random cat facts from an external API.

## 🚀 Features

- GET `/me` endpoint with profile data and dynamic cat facts
- Real-time UTC timestamps in ISO 8601 format
- External API integration with Cat Facts API
- Graceful error handling and fallback mechanisms
- CORS enabled
- Health check endpoint

## 🛠 Tech Stack

- **Backend**: Node.js + Express.js
- **HTTP Client**: Axios
- **Testing**: Jest + Supertest
- **Environment Management**: dotenv

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd dynamic-profile-api