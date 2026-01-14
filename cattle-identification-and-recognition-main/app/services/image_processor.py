def process_image(file_bytes: bytes):
    import numpy as np
    import cv2
    data = np.frombuffer(file_bytes, dtype=np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError('invalid_image')
    green = img[:, :, 1]
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(green)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    morph = cv2.morphologyEx(enhanced, cv2.MORPH_OPEN, kernel, iterations=1)
    gauss = cv2.GaussianBlur(morph, (5, 5), 0)
    median = cv2.medianBlur(gauss, 3)
    _, thresh = cv2.threshold(median, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)
    return thresh
