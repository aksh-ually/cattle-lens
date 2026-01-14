import cv2
import numpy as np
from fcmeans import FCM
from jax import device_get
from skimage.segmentation import chan_vese



def show_img(name="image",image=None):
    while True:
        cv2.imshow(name, image)
        if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    cv2.destroyAllWindows()

def morphology_diff(image,parameters):

    open1 = cv2.morphologyEx(image, cv2.MORPH_OPEN,   cv2.getStructuringElement(cv2.MORPH_ELLIPSE,parameters["kernel_1"]), iterations = parameters["morph_iter_1"])
    close1 = cv2.morphologyEx(open1, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE,parameters["kernel_1"]), iterations = parameters["morph_iter_1"])
    open2 = cv2.morphologyEx(close1, cv2.MORPH_OPEN,  cv2.getStructuringElement(cv2.MORPH_ELLIPSE,parameters["kernel_2"]), iterations = parameters["morph_iter_2"])
    close2 = cv2.morphologyEx(open2, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE,parameters["kernel_2"]), iterations = parameters["morph_iter_2"])
    open3 = cv2.morphologyEx(close2, cv2.MORPH_OPEN,  cv2.getStructuringElement(cv2.MORPH_ELLIPSE,parameters["kernel_3"]), iterations = parameters["morph_iter_3"])
    close3 = cv2.morphologyEx(open3, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE,parameters["kernel_3"]), iterations = parameters["morph_iter_3"])	
    return close3

def fuzzy_c_mean(image,n_clusters=2,max_iter=4,m=2):
    fcm = FCM(n_clusters=n_clusters,max_iter=max_iter,m=m)  
    X = image.reshape((-1,len(image.shape)))
    fcm.fit(X)
    labeld_X = fcm.predict(X)
    transformed_X = fcm.centers[labeld_X]
    quatized_array = device_get(transformed_X.astype('uint8').reshape((image.shape)))
    return quatized_array

def k_mean(image,k=2,max_iter=4):
    pixel_vals = image.reshape((-1,len(image.shape)))
    pixel_vals = np.float32(pixel_vals)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, max_iter, 0.85)
    retval, labels, centers = cv2.kmeans(pixel_vals, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    centers = np.uint8(centers)
    segmented_data = centers[labels.flatten()]
    segmented_image = segmented_data.reshape((image.shape))
    return segmented_image

def level_set(image,max_iter=200):
    segmented_image = chan_vese(image, mu=0.1, lambda1=1, lambda2=1, tol=1e-3,max_num_iter=max_iter).astype(np.uint8)
    return segmented_image

def filter_shapes(image, contour_area_min, contour_area_max):
    vessel_mask = np.ones(image.shape[:2], dtype="uint8") * 255
    vessel_contours, _ = cv2.findContours(image.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    for contour in vessel_contours:
        perimeter = cv2.arcLength(contour, True)
        polygon = cv2.approxPolyDP(contour, 0.04 * perimeter, False)
        if len(polygon) > 4 and contour_area_min <= cv2.contourArea(contour) <= contour_area_max:
            cv2.drawContours(vessel_mask, [contour], -1, 0, -1)
    clean_image = cv2.bitwise_and(image, image, mask=vessel_mask)        
    return clean_image

def apply_filter(image_path,parameters={},method="cmean"):
    
    # read image
    image = cv2.imread(image_path)
    
    # resize the image as height=512 and width=aspect_ratio*height
    aspect_ratio = image.shape[1] / image.shape[0]
    new_width = int(512 * aspect_ratio)
    resized_image = cv2.resize(image, (new_width, 512))

    # get the green channel
    b, green, r = cv2.split(resized_image)
   
    # Contrast limited adaptive histogram equalization (CLAHE)
    clipLimit = parameters["clipLimit"]
    tileGridSize = parameters["tileGridSize"]
    clahe = cv2.createCLAHE(clipLimit=clipLimit,tileGridSize=tileGridSize).apply(green)

    # Morphological operations
    morphology_img = morphology_diff(clahe,parameters["morph"])

    # subtract
    subtracted = cv2.subtract(morphology_img, clahe)

    # noise filter
    noise_removed  = filter_shapes(subtracted, contour_area_max=parameters["contour_area_max"], contour_area_min=parameters["contour_area_min"])

    # segmentation
    if method == "c_mean":
        segmented_image  = fuzzy_c_mean(noise_removed,n_clusters=2,max_iter=parameters["method_iter"])
        _, segmented_image = cv2.threshold(segmented_image, 1, 255, cv2.THRESH_BINARY)
    elif method == "k_mean":
        segmented_image  = k_mean(noise_removed,k=2,max_iter=parameters["method_iter"])
        _, segmented_image = cv2.threshold(segmented_image, 1, 255, cv2.THRESH_BINARY)
    elif method == "level_set":
        segmented_image  = level_set(noise_removed,max_iter=parameters["method_iter"])  
        _, segmented_image = cv2.threshold(segmented_image, 0, 255, cv2.THRESH_BINARY)  
    else:
        raise Exception("Method must be cmean, kmean or level_set")

    return [resized_image,green,clahe,morphology_img,subtracted,noise_removed,segmented_image]


if __name__ == '__main__':  

    parameters = {
        "clipLimit":2.0,
        "tileGridSize":(8,8),
        "morph":{
            "morph_iter_1":4,
            "morph_iter_2":3,
            "morph_iter_3":2,
            "kernel_1":(5,5),
            "kernel_2":(11,11),
            "kernel_3":(23,23),
        },
        "method_iter":200,
        "contour_area_min": 0,
        "contour_area_max": 1000,
    }

    image_path = '/157L/157_01.2.008-0.00_L-02.JPG'
    image_name = image_path.split("/")[-1]

    methods = ["c_mean","k_mean","level_set"]
    names = ["image","green","clahe","morphology_img","subtracted","noise_removed","segmented_image"]
    
    output_images = apply_filter(image_path, parameters, method=methods[0])
    
  
    for idx in range(len(output_images)):
        show_img(name=names[idx] ,image= output_images[idx])