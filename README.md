# Format Conversion with Groq AI Chatbot

This project is a file format conversion web application that includes a Groq AI-powered chatbot to assist users.

## Features

- Convert between various file formats (documents, images, audio, video, etc.)
- User authentication and profile management
- Groq AI-powered chatbot for assistance with file conversions

## Chatbot Integration

The application includes a powerful conversational AI assistant powered by Groq. The chatbot can:

- Help users understand file conversion options
- Answer questions about supported formats
- Provide assistance with conversion tasks
- Guide users through the application

## Setup Instructions

### Prerequisites

- Node.js and npm for the frontend
- Python 3.8+ for the backend
- [Groq API key](https://console.groq.com/) for the chatbot

### Configuration

1. Clone the repository
2. Set up the backend:
   ```
   cd backend
   pip install -r requirements.txt
   ```
3. Add your Groq API key to the `.env` file:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
4. Start the backend:
   ```
   uvicorn app.main:app --reload
   ```
5. Set up the frontend:
   ```
   cd frontend
   npm install
   ```
6. Start the frontend:
   ```
   npm start
   ```

## Chatbot Usage

The chatbot is available from any page in the application by clicking the chat button in the bottom-right corner. Users can:

- Ask questions about file conversion
- Get help with specific conversion tasks
- Adjust AI model settings (temperature, model selection)
- Use conversation starters for common questions

## Technologies Used

- **Frontend**: React, Material UI
- **Backend**: FastAPI, Python
- **AI**: Groq API (LLaMA, Mixtral models)
- **Authentication**: Firebase Authentication

## Architecture

The application consists of the following components:

- **Frontend**: React application with Material UI and Tailwind CSS
- **Backend API**: FastAPI application for handling conversion requests
- **Celery Workers**: For processing conversions asynchronously
- **Redis**: For caching and as a message broker for Celery
- **Nginx**: For serving the frontend and proxying requests to the backend

## Prerequisites

- Docker and Docker Compose
- Git

## Deployment

### 1. Clone the repository

```bash
git clone <repository-url>
cd format-conversion
```

### 2. Build and start the application

```bash
docker-compose up -d
```

This will start the following services:
- Frontend (accessible at http://localhost:3000)
- Backend API (accessible at http://localhost:8000)
- Redis
- Celery Worker

### 3. Monitor the application

You can monitor the Celery tasks using Flower:

```bash
docker-compose exec celery-worker celery -A app.celery_worker.celery flower --port=5555
```

Then access the Flower dashboard at http://localhost:5555

### 4. Scaling

To scale the number of Celery workers:

```bash
docker-compose up -d --scale celery-worker=3
```

## Development

### Backend

The backend is built with FastAPI and uses the following libraries:
- FastAPI for the API framework
- Celery for asynchronous task processing
- Redis for caching and as a message broker
- Various libraries for file conversion (Pillow, FFmpeg, etc.)

### Frontend

The frontend is built with React and uses the following libraries:
- Material UI for components
- Tailwind CSS for styling
- Framer Motion for animations

## API Endpoints

- `POST /api/convert/file`: Convert a file synchronously
- `POST /api/convert/file/async`: Convert a file asynchronously
- `GET /api/convert/status/{task_id}`: Get the status of an asynchronous conversion
- `GET /api/convert/download/{filename}`: Download a converted file
- `GET /api/convert/supported-formats`: Get a list of supported conversion formats

## License

This project is licensed under the MIT License - see the LICENSE file for details. 