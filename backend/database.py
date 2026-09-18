from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Fallback to SQLite since Docker is not available on this machine
SQLALCHEMY_DATABASE_URL = "sqlite:///./polarops.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
