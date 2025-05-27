FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    libpq-dev \
    ffmpeg \
    poppler-utils \
    tesseract-ocr \
    libreoffice \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install uv and move to PATH
RUN curl -Ls https://astral.sh/uv/install.sh | bash && \
    cp /root/.local/bin/* /usr/local/bin/

# Copy requirements and install using uv
COPY requirements.txt .
RUN uv pip install --system -r requirements.txt

# Copy app code
COPY . .

# Create folders
RUN mkdir -p uploads outputs shared_data

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
