# Format Conversion API

A robust and scalable FastAPI backend for converting between various file formats.

## Features

- Convert between multiple file formats:
  - **Text**: txt, md, html, xml, json, csv, yaml, etc.
  - **Documents**: pdf, docx, txt, html, md, etc.
  - **Images**: jpg, png, gif, bmp, tiff, webp, svg, etc.
  - **Audio**: mp3, wav, ogg, flac, aac, etc.
  - **Video**: mp4, avi, mkv, mov, webm, gif, etc.
  - **Compressed Files**: zip, tar, gz, 7z, etc.
- Asynchronous processing
- Clean API design
- Automatic file cleanup

## Setup

### Prerequisites

- Python 3.8+
- FFmpeg (for audio and video conversion)
- Tesseract OCR (optional, for OCR functionality)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Create and activate a virtual environment:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/macOS
python -m venv venv
source venv/bin/activate
```

4. Install the dependencies:

```bash
pip install -r requirements.txt
```

### Running the Server

```bash
cd backend
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

## API Documentation

Once the server is running, you can access the interactive API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Convert a File

```
POST /api/convert/file
```

Parameters:
- `file`: The file to convert (form-data)
- `target_format`: The format to convert to (form-data)
- `conversion_type`: The type of conversion (text, document, image, audio, video, compressed) (form-data)

### Download a Converted File

```
GET /api/convert/download/{filename}
```

### Get Supported Formats

```
GET /api/convert/supported-formats
```

## Development

### Project Structure

```
backend/
├── app/
│   ├── convertors/
│   │   ├── text/
│   │   ├── document/
│   │   ├── image/
│   │   ├── audio/
│   │   ├── video/
│   │   └── compressed/
│   ├── routers/
│   ├── utils/
│   └── main.py
├── uploads/
├── outputs/
├── requirements.txt
└── README.md
```

### Adding New Converters

To add support for a new format:

1. Identify the appropriate converter class (text, document, image, etc.)
2. Add the format to the `_input_formats` and/or `_output_formats` lists
3. Implement the conversion logic in the converter class

## License

MIT 