# Format Conversion App Frontend

A modern React frontend for the Format Conversion application.

## Features

- Clean, responsive UI built with Material-UI
- File upload with drag-and-drop support
- Support for various conversion types:
  - Text
  - Document
  - Image
  - Audio
  - Video
  - Compressed files
- Real-time conversion status updates
- Easy file download after conversion

## Setup

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Navigate to the frontend directory
2. Install dependencies:

```bash
npm install
```

### Running the Development Server

```bash
npm start
```

The development server will start at http://localhost:3000

### Building for Production

```bash
npm run build
```

This will create a production-ready build in the `build` directory.

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── FileUploader.js
│   │   ├── ConversionResult.js
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── ConversionPage.js
│   │   └── AboutPage.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## API Integration

The frontend communicates with the backend API using Axios. The API service is defined in `src/services/api.js` and includes the following functions:

- `getSupportedFormats()`: Fetches supported formats for all conversion types
- `convertFile(file, targetFormat, conversionType)`: Converts a file to the specified format
- `getDownloadUrl(filename)`: Gets the URL to download a converted file

## Deployment

The frontend can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages. For production deployment, make sure to set up the correct API URL in the `src/services/api.js` file.

## License

MIT 