# File Management System

This document describes the file management system implemented in the Format Conversion API.

## Overview

The file management system uses a structured directory approach with unique identifiers to ensure efficient file storage, retrieval, and deduplication. The system is implemented in the `FileManager` class located in `app/utils/file_manager.py`.

## Key Features

### 1. Structured Directory System

#### Date-Based Directories

Files are organized by date in a hierarchical structure:
```
uploads/
  ├── document/
  │   ├── 2023/
  │   │   ├── 03/
  │   │   │   ├── 10/
  │   │   │   │   ├── document1_abc123_def456.docx
  │   │   │   │   └── document2_ghi789_jkl012.pdf
```

This makes it easier to locate files based on when they were uploaded and simplifies cleanup of old files.

#### User-Based Directories

When user information is available, files are stored in user-specific directories:
```
uploads/
  ├── document/
  │   ├── user_123/
  │   │   ├── 2023/
  │   │   │   ├── 03/
  │   │   │   │   ├── 10/
  │   │   │   │   │   ├── document1_abc123_def456.docx
```

This separation improves security and makes user-specific operations more efficient.

### 2. Unique Identifiers

#### UUIDs

Each file is assigned a UUID when uploaded, ensuring uniqueness even when filenames might otherwise conflict.

#### Content Hashing

Files are hashed (MD5) upon upload, and this hash is used:
1. As part of the filename to identify file content
2. For deduplication to avoid storing identical files multiple times
3. For caching conversion results

### 3. Filename Structure

Filenames follow this pattern:
```
original_filename_[first 8 chars of hash]_[first 8 chars of UUID].extension
```

For example:
```
report_a1b2c3d4_5e6f7g8h.pdf
```

This ensures:
- Original filenames are preserved for user recognition
- Files can be uniquely identified
- Content-based identification is possible
- Filenames remain reasonably short

## Implementation Details

### File Upload Process

1. When a file is uploaded, a UUID is generated
2. The first 1MB of the file is hashed for content identification
3. The appropriate directory structure is created based on date and user ID (if available)
4. The file is saved with the structured filename
5. If an identical file (same hash) already exists, the existing file path is returned

### File Conversion Output

1. Output files are stored in a similar directory structure
2. The hash and UUID from the input file are preserved in the output filename
3. The file extension is changed to match the target format

### File URLs

The system generates URLs for both uploaded and converted files, making them accessible via the API.

### Deduplication

Files with identical content (same hash) are stored only once, saving storage space.

## Benefits

- **Organization**: Files are logically organized by date and user
- **Uniqueness**: No filename conflicts due to UUID and hash usage
- **Deduplication**: Storage efficiency through content-based file identification
- **Cleanup**: Easy identification and removal of old files
- **Security**: User isolation through user-specific directories
- **Caching**: Efficient caching of conversion results based on file content

## Usage

The `FileManager` class is used throughout the application to handle file operations:

```python
# Save an uploaded file
file_path, file_hash, unique_id = await file_manager.save_uploaded_file(
    file=file,
    conversion_type=conversion_type,
    user_id=user_id
)

# Get an output path for a converted file
output_path = file_manager.get_output_path(
    original_filename=output_filename,
    target_format=target_format,
    file_hash=file_hash,
    unique_id=unique_id,
    user_id=user_id
)

# Get a URL for a file
download_url = file_manager.get_file_url(file_path)
``` 