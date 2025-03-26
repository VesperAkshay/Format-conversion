from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import uvicorn
import multiprocessing
import redis
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

from app.routers import conversion_router, chat_router
from app.utils.file_manager import FileManager

# Initialize file manager
file_manager = FileManager()

# Create upload and output directories if they don't exist
os.makedirs(file_manager.base_upload_dir, exist_ok=True)
os.makedirs(file_manager.base_output_dir, exist_ok=True)

# Determine optimal number of workers based on CPU cores
cpu_count = multiprocessing.cpu_count()
thread_workers = min(32, cpu_count * 2)  # 2 threads per CPU core, max 32
process_workers = max(1, cpu_count - 1)  # Leave one CPU core free for system tasks

# Create thread and process pool executors for parallel processing
thread_pool = ThreadPoolExecutor(max_workers=thread_workers)
process_pool = ProcessPoolExecutor(max_workers=process_workers)

# Initialize Redis connection
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.from_url(redis_url)

app = FastAPI(
    title="Format Conversion API",
    description="API for converting between various file formats",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware for request processing optimization
@app.middleware("http")
async def add_process_time_header(request, call_next):
    response = await call_next(request)
    return response

# Mount static files directories
app.mount("/uploads", StaticFiles(directory=file_manager.base_upload_dir), name="uploads")
app.mount("/outputs", StaticFiles(directory=file_manager.base_output_dir), name="outputs")

# Include routers
app.include_router(conversion_router.router)
app.include_router(chat_router.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Format Conversion API"}

# Health check endpoint
@app.get("/health")
async def health_check():
    # Check Redis connection
    try:
        redis_client.ping()
        redis_status = "ok"
    except Exception as e:
        redis_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "redis": redis_status,
        "workers": {
            "thread_pool": thread_workers,
            "process_pool": process_workers
        }
    }

# Provide the thread and process pools to the application state
@app.on_event("startup")
async def startup_event():
    app.state.thread_pool = thread_pool
    app.state.process_pool = process_pool
    app.state.redis = redis_client
    app.state.file_manager = file_manager
    print(f"Server started with {thread_workers} thread workers and {process_workers} process workers")

# Shutdown the thread and process pools when the application stops
@app.on_event("shutdown")
async def shutdown_event():
    app.state.thread_pool.shutdown()
    app.state.process_pool.shutdown()
    print("Server shutting down, cleaning up resources")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 