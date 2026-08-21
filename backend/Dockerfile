FROM python:3.13-slim

# Install Linux libraries required by OpenCV / MediaPipe
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libgles2 \
        libgl1 \
        libegl1 \
        libglib2.0-0 \
        libstdc++6 \
        libgomp1 && \
    rm -rf /var/lib/apt/lists/*

# Backend working directory
WORKDIR /app

# Copy backend files
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 10000

# Render provides the PORT environment variable
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"