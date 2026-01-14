import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

class Settings:
    def __init__(self):
        self.database_url = os.getenv('DATABASE_URL', 'postgresql://user:pass@localhost:5432/cattle_db')
        self.secret_key = os.getenv('SECRET_KEY', 'change-me')
        self.upload_folder = os.getenv('UPLOAD_FOLDER', 'uploads')
        self.allowed_origins = [o.strip() for o in os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',') if o.strip()]
        self.max_file_size = 10 * 1024 * 1024

settings = Settings()
