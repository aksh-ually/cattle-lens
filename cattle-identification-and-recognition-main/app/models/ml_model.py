import numpy as np
import cv2
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.database.db import RetinalImages
import io

class Matcher:
    def __init__(self, use_flann: bool = True):
        if use_flann:
            index_params = dict(algorithm=1, trees=5)
            search_params = dict(checks=50)
            self.matcher = cv2.FlannBasedMatcher(index_params, search_params)
            self.is_flann = True
        else:
            self.matcher = cv2.BFMatcher(cv2.NORM_L2, crossCheck=False)
            self.is_flann = False

    def match(self, des1: np.ndarray, des2: np.ndarray) -> float:
        if des1.size == 0 or des2.size == 0:
            return 0.0
        matches = self.matcher.knnMatch(des1, des2, k=2)
        good = []
        for m in matches:
            if len(m) == 2:
                a, b = m
                if a.distance < 0.75 * b.distance:
                    good.append(a)
        if not good:
            return 0.0
        score = sum(1.0 - (g.distance / 200.0) for g in good)
        return float(score / len(good))

class ModelStore:
    def __init__(self):
        self.cache: Dict[int, np.ndarray] = {}
        self.matcher = Matcher(use_flann=True)

    def load_features(self, db: Session) -> None:
        rows = db.query(RetinalImages).filter(RetinalImages.feature_vector.isnot(None)).all()
        for r in rows:
            try:
                des = np.load(io.BytesIO(r.feature_vector))
            except Exception:
                des = None
            if des is not None:
                self.cache[r.id] = des

    def set_features(self, image_id: int, des: np.ndarray) -> None:
        self.cache[image_id] = des

    def top_matches(self, query: np.ndarray, db: Session, top_n: int = 5) -> List[Dict[str, Any]]:
        if not self.cache:
            self.load_features(db)
        scores: List[Tuple[int, float, int]] = []
        for img_id, des in self.cache.items():
            s = self.matcher.match(query, des)
            scores.append((img_id, s, des.shape[0]))
        scores.sort(key=lambda x: x[1], reverse=True)
        result = []
        for img_id, s, cnt in scores[:top_n]:
            row = db.query(RetinalImages).filter(RetinalImages.id == img_id).first()
            if row:
                result.append({
                    'retinal_image_id': row.id,
                    'cattle_id': row.cattle_id,
                    'eye_type': row.eye_type,
                    'image_path': row.image_path,
                    'confidence': s,
                    'feature_count': cnt
                })
        return result
