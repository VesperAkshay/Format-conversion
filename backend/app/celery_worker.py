import os
from celery import Celery
from celery.utils.log import get_task_logger

# Initialize logger
logger = get_task_logger(__name__)

# Get Redis URL from environment variable or use default
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Create Celery instance
celery = Celery(
    "format_conversion",
    broker=os.getenv("CELERY_BROKER_URL", redis_url),
    backend=os.getenv("CELERY_RESULT_BACKEND", redis_url),
    include=["app.tasks"]
)

# Configure Celery
celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    worker_prefetch_multiplier=1,  # Prevent worker from prefetching too many tasks
    task_acks_late=True,  # Acknowledge tasks after they are executed
    task_track_started=True,  # Track when tasks are started
    worker_max_tasks_per_child=200,  # Restart worker after processing 200 tasks
    task_time_limit=3600,  # 1 hour time limit for tasks
    task_soft_time_limit=3000,  # 50 minutes soft time limit
)

# Optional: Add periodic tasks
celery.conf.beat_schedule = {
    "cleanup-old-files": {
        "task": "app.tasks.cleanup_old_files",
        "schedule": 3600.0,  # Run every hour
    },
}

if __name__ == "__main__":
    celery.start() 