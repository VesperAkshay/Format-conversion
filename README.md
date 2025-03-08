# Format Conversion App

A full-stack application for converting files between various formats. The application consists of a FastAPI backend and a React frontend.

## Features

- Convert between multiple file formats:
  - **Text**: txt, md, html, xml, json, csv, yaml, etc.
  - **Documents**: pdf, docx, txt, html, md, etc.
  - **Images**: jpg, png, gif, bmp, tiff, webp, svg, etc.
  - **Audio**: mp3, wav, ogg, flac, aac, etc.
  - **Video**: mp4, avi, mkv, mov, webm, gif, etc.
  - **Compressed Files**: zip, tar, gz, 7z, etc.
- Modern, responsive UI built with React and Material-UI
- Asynchronous processing with FastAPI
- Automatic file cleanup after conversion

## Project Structure

```
format-conversion/
├── backend/
│   ├── app/
│   │   ├── convertors/
│   │   │   ├── text/
│   │   │   ├── document/
│   │   │   ├── image/
│   │   │   ├── audio/
│   │   │   ├── video/
│   │   │   └── compressed/
│   │   ├── routers/
│   │   ├── utils/
│   │   └── main.py
│   ├── uploads/
│   ├── outputs/
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Prerequisites

- Python 3.8+
- Node.js 14+
- FFmpeg (for audio and video conversion)
- Tesseract OCR (optional, for OCR functionality)

## Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/macOS
python -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```

The backend API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

## API Documentation

Once the backend server is running, you can access the interactive API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

### Backend Deployment

The backend can be deployed using various methods:

- Docker container
- Cloud platforms like Heroku, AWS, or Google Cloud
- Traditional VPS with Nginx and Gunicorn

### Frontend Deployment

The frontend can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

For production deployment, make sure to set up the correct API URL in the frontend's `src/services/api.js` file.

## License

MIT 