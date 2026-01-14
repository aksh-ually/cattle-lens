import numpy as np
import cv2
from sklearn.cluster import KMeans

def kmeans_segment(img: np.ndarray, k: int = 2) -> np.ndarray:
    flat = img.reshape(-1, 1).astype(np.float32)
    km = KMeans(n_clusters=k, n_init=5)
    labels = km.fit_predict(flat)
    seg = labels.reshape(img.shape).astype(np.uint8) * (255 // max(1, k-1))
    return seg

def extract_sift(img: np.ndarray) -> np.ndarray:
    sift = cv2.SIFT_create()
    kp, des = sift.detectAndCompute(img, None)
    if des is None:
        return np.empty((0, 128), dtype=np.float32)
    norms = np.linalg.norm(des, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    des = des / norms
    return des.astype(np.float32)

def extract_features(img: np.ndarray, use_kmeans: bool = True) -> np.ndarray:
    base = img
    if use_kmeans:
        seg = kmeans_segment(base, k=2)
        base = cv2.bitwise_and(base, seg)
    des = extract_sift(base)
    return des
