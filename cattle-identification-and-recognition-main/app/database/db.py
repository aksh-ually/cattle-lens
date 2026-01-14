from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey, LargeBinary, Float, DateTime, Index, func
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from app.config import settings
import os

Base = declarative_base()

class Cattle(Base):
    __tablename__ = 'cattle'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    breed = Column(String(255), index=True, nullable=True)
    dob = Column(Date, nullable=True)
    farm_id = Column(String(255), index=True, nullable=True)
    tags = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    images = relationship('RetinalImages', back_populates='cattle', cascade='all, delete-orphan')

Index('idx_cattle_name', Cattle.name)

class RetinalImages(Base):
    __tablename__ = 'retinal_images'
    id = Column(Integer, primary_key=True, index=True)
    cattle_id = Column(Integer, ForeignKey('cattle.id', ondelete='CASCADE'), index=True)
    eye_type = Column(String(16), nullable=False)
    image_path = Column(String(1024), nullable=False)
    feature_vector = Column(LargeBinary, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    cattle = relationship('Cattle', back_populates='images')

Index('idx_retinal_eye_type', RetinalImages.eye_type)

class IdentificationLog(Base):
    __tablename__ = 'identification_log'
    id = Column(Integer, primary_key=True, index=True)
    query_image = Column(String(1024), nullable=True)
    identified_cattle_id = Column(Integer, ForeignKey('cattle.id'), nullable=True)
    confidence = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    processing_time = Column(Float, nullable=True)

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

def init_db():
    os.makedirs(settings.upload_folder, exist_ok=True)
    try:
        Base.metadata.create_all(bind=engine)
    except Exception:
        pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
