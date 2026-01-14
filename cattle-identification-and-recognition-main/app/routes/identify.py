from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Request
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.database.db import get_db, IdentificationLog
from app.config import settings
from app.services.image_processor import process_image
from app.services.feature_extractor import extract_features
from app.models.ml_model import ModelStore
import time

router = APIRouter(prefix='/api', tags=['identify'])
store = ModelStore()
rate: Dict[str, List[float]] = {}

def limit(request: Request, max_req: int = 30, per_seconds: int = 60):
    ip = request.client.host
    now = time.time()
    bucket = rate.get(ip, [])
    bucket = [t for t in bucket if now - t < per_seconds]
    if len(bucket) >= max_req:
        raise HTTPException(status_code=429, detail='rate_limited')
    bucket.append(now)
    rate[ip] = bucket

@router.post('/identify')
async def identify(request: Request, file: UploadFile = File(...), db: Session = Depends(get_db)):
    limit(request)
    if file.content_type not in ['image/jpeg', 'image/png']:
        raise HTTPException(status_code=400, detail='invalid_file_type')
    data = await file.read()
    if len(data) > settings.max_file_size:
        raise HTTPException(status_code=400, detail='file_too_large')
    start = time.time()
    img = process_image(data)
    des = extract_features(img)
    matches = store.top_matches(des, db, top_n=5)
    elapsed = time.time() - start
    log = IdentificationLog(query_image=file.filename, identified_cattle_id=(matches[0]['cattle_id'] if matches else None), confidence=(matches[0]['confidence'] if matches else None), processing_time=float(elapsed))
    db.add(log)
    db.commit()
    return {'results': matches, 'timestamp': int(time.time())}

@router.post('/identify-batch')
async def identify_batch(request: Request, files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    limit(request)
    results: List[Dict[str, Any]] = []
    for f in files:
        if f.content_type not in ['image/jpeg', 'image/png']:
            results.append({'file': f.filename, 'error': 'invalid_file_type'})
            continue
        data = await f.read()
        if len(data) > settings.max_file_size:
            results.append({'file': f.filename, 'error': 'file_too_large'})
            continue
        start = time.time()
        try:
            img = process_image(data)
            des = extract_features(img)
            matches = store.top_matches(des, db, top_n=5)
            elapsed = time.time() - start
            log = IdentificationLog(query_image=f.filename, identified_cattle_id=(matches[0]['cattle_id'] if matches else None), confidence=(matches[0]['confidence'] if matches else None), processing_time=float(elapsed))
            db.add(log)
            results.append({'file': f.filename, 'results': matches})
        except Exception:
            results.append({'file': f.filename, 'error': 'processing_error'})
    db.commit()
    return {'items': results, 'timestamp': int(time.time())}
