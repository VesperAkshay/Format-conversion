# Format Conversion Application

A powerful application for converting files between various formats, built with FastAPI, React, Redis, and Celery.

## Features

- Convert between various file formats:
  - Text: TXT, MD, HTML, XML, JSON, CSV, YAML, etc.
  - Documents: PDF, DOCX, TXT, HTML, MD, etc.
  - Images: JPG, PNG, GIF, BMP, TIFF, WEBP, SVG, etc.
  - Audio: MP3, WAV, OGG, FLAC, AAC, etc.
  - Video: MP4, AVI, MKV, MOV, WEBM, GIF, etc.
  - Compressed Files: ZIP, TAR, GZ, 7Z, etc.
- Modern, responsive UI with animations
- Asynchronous processing with Celery
- Caching with Redis for improved performance
- Dockerized deployment for easy setup

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