from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database.db import get_db, Cattle, RetinalImages
from app.config import settings
from app.services.image_processor import process_image
from app.services.feature_extractor import extract_features
import os
import io
import numpy as np

router = APIRouter(prefix='/api/cattle', tags=['cattle'])

@router.get('')
def list_cattle(q: Optional[str] = None, breed: Optional[str] = None, farm_id: Optional[str] = None, page: int = 1, page_size: int = 20, db: Session = Depends(get_db)):
    query = db.query(Cattle)
    if q:
        query = query.filter(Cattle.name.ilike(f'%{q}%'))
    if breed:
        query = query.filter(Cattle.breed == breed)
    if farm_id:
        query = query.filter(Cattle.farm_id == farm_id)
    total = query.count()
    items = query.order_by(Cattle.id.desc()).offset((page-1)*page_size).limit(page_size).all()
    return {'total': total, 'page': page, 'page_size': page_size, 'items': [
        {'id': c.id, 'name': c.name, 'breed': c.breed, 'dob': str(c.dob) if c.dob else None, 'farm_id': c.farm_id, 'tags': c.tags}
        for c in items
    ]}

@router.get('/{id}')
def get_cattle(id: int, db: Session = Depends(get_db)):
    c = db.query(Cattle).filter(Cattle.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail='not_found')
    return {
        'id': c.id,
        'name': c.name,
        'breed': c.breed,
        'dob': str(c.dob) if c.dob else None,
        'farm_id': c.farm_id,
        'tags': c.tags,
        'images': [{'id': i.id, 'eye_type': i.eye_type, 'image_path': i.image_path} for i in c.images]
    }

@router.post('')
async def create_cattle(name: str = Form(...), breed: Optional[str] = Form(None), dob: Optional[str] = Form(None), farm_id: Optional[str] = Form(None), tags: Optional[str] = Form(None), left_eye: Optional[UploadFile] = File(None), right_eye: Optional[UploadFile] = File(None), db: Session = Depends(get_db)):
    c = Cattle(name=name, breed=breed, farm_id=farm_id, tags=tags)
    db.add(c)
    db.flush()
    for eye, f in [('left', left_eye), ('right', right_eye)]:
        if f:
            data = await f.read()
            if len(data) > settings.max_file_size:
                raise HTTPException(status_code=400, detail='file_too_large')
            img = process_image(data)
            des = extract_features(img)
            buf = io.BytesIO()
            np.save(buf, des)
            path = os.path.join(settings.upload_folder, f'{c.id}_{eye}_{f.filename}')
            with open(path, 'wb') as w:
                w.write(data)
            ri = RetinalImages(cattle_id=c.id, eye_type=eye, image_path=path, feature_vector=buf.getvalue())
            db.add(ri)
    db.commit()
    return {'id': c.id}

@router.put('/{id}')
async def update_cattle(id: int, name: Optional[str] = Form(None), breed: Optional[str] = Form(None), dob: Optional[str] = Form(None), farm_id: Optional[str] = Form(None), tags: Optional[str] = Form(None), db: Session = Depends(get_db)):
    c = db.query(Cattle).filter(Cattle.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail='not_found')
    if name is not None:
        c.name = name
    if breed is not None:
        c.breed = breed
    if farm_id is not None:
        c.farm_id = farm_id
    if tags is not None:
        c.tags = tags
    db.commit()
    return {'id': c.id}

@router.delete('/{id}')
def delete_cattle(id: int, db: Session = Depends(get_db)):
    c = db.query(Cattle).filter(Cattle.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail='not_found')
    db.delete(c)
    db.commit()
    return {'deleted': True}

@router.get('/{id}/history')
def history(id: int, db: Session = Depends(get_db)):
    from app.database.db import IdentificationLog
    logs = db.query(IdentificationLog).filter(IdentificationLog.identified_cattle_id == id).order_by(IdentificationLog.timestamp.desc()).limit(100).all()
    return {'items': [
        {'id': l.id, 'confidence': l.confidence, 'timestamp': l.timestamp, 'processing_time': l.processing_time}
        for l in logs
    ]}
