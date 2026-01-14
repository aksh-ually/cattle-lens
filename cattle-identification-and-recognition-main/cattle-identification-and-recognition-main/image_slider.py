import time
import cv2
import numpy as np
import glob
from fcmeans import FCM
from jax import device_get
from skimage.segmentation import chan_vese

class ImageSlider:
   
    def __init__(self, imgs_path):
        self.img = self.create_stack_images(imgs_path)
        self.sliders = {}
        self.INIT = True
        self.last_time = None
        self.numpy_vertical = np.zeros((100, 100))
        if self.img is None:
            print("Error: Unable to load image.")
            exit(1)

        self.create_sliders()
        self.process_image()

    def create_stack_images(self, img_path):
        
        # load random images from the filesystem
        images_path = glob.glob(img_path+"/*/*")[:5] 
        print(images_path)

        images = [cv2.resize(cv2.imread(img),(480,480)) for img in images_path]
       # Define padding (white color)
        padding = np.ones((images[0].shape[0], 5, 3), dtype=np.uint8) * 255

        # Create list to hold images and padding
        images_with_padding = []

        for image in images:
            images_with_padding.append(image)
            images_with_padding.append(padding)
        # Remove the last padding
        images_with_padding = images_with_padding[:-1]
        # Horizontally stack images with padding in between
        stacked_image = np.hstack(images_with_padding)
        return stacked_image

    def create_sliders(self):
        cv2.namedWindow('Modified Image', cv2.WINDOW_NORMAL)

        slider_names = [
            # CLAHE parameters
            'CLAHE-Clip-Limit', 'CLAHE-Tile-Grid-Size',

            # Morphological Block 1
            'Morphology-Block-1:Kernel-Size', 'Morphology-Block-1:Iterations',

            # Morphological Block 2
            'Morphology-Block-2:Kernel-Size', 'Morphology-Block-2:Iterations',

            # Morphological Block 3
            'Morphology-Block-3:Kernel-Size', 'Morphology-Block-3:Iterations',

            # Segmentation Method
            'Segmentation-Method(0-cmeans,1-kmeans,2-levelset)', 'Segmentation-Iterations'
        ]

        slider_ranges = [
            (1, 100), (1, 100),
            (1, 100), (1, 100), 
            (1, 100), (1, 100), 
            (1, 100), (1, 100),
            (0, 2),  # 0 for fuzzy_c_mean, 1 for k_mean, and 2 for level_set
            (1, 500)
        ]

        for slider_name, slider_range in zip(slider_names, slider_ranges):
            cv2.createTrackbar(slider_name, 'Modified Image', slider_range[0], slider_range[1], self.update_slider)
            self.update_slider(0)

    def update_slider(self, value):
        if self.INIT :
            # Initialize sliders with default values
            self.sliders['CLAHE-Clip-Limit'] = 2
            self.sliders['CLAHE-Tile-Grid-Size'] = 8 
            self.sliders['Segmentation-Iterations'] = 1
            self.sliders['Segmentation-Method(0-cmeans,1-kmeans,2-levelset)'] = 0
            self.sliders['Morphology-Block-1:Kernel-Size'] = 5
            self.sliders['Morphology-Block-2:Kernel-Size'] = 11
            self.sliders['Morphology-Block-3:Kernel-Size'] = 23
            self.sliders['Morphology-Block-1:Iterations'] = 4
            self.sliders['Morphology-Block-2:Iterations'] = 3
            self.sliders['Morphology-Block-3:Iterations'] = 2
            self.INIT = False
        for slider_name in self.sliders:
            self.sliders[slider_name] = cv2.getTrackbarPos(slider_name, 'Modified Image')
        self.process_image()
    
    def morphology_diff(self, image):

        iter_1  = self.sliders['Morphology-Block-1:Iterations']
        iter_2  = self.sliders['Morphology-Block-2:Iterations']
        iter_3  = self.sliders['Morphology-Block-3:Iterations']
        k1 = (self.sliders['Morphology-Block-1:Kernel-Size'],self.sliders['Morphology-Block-1:Kernel-Size'])
        k2 = (self.sliders['Morphology-Block-2:Kernel-Size'],self.sliders['Morphology-Block-2:Kernel-Size'])
        k3 = (self.sliders['Morphology-Block-3:Kernel-Size'],self.sliders['Morphology-Block-3:Kernel-Size'])
        
        open1 = cv2.morphologyEx(image, cv2.MORPH_OPEN,   cv2.getStructuringElement(cv2.MORPH_ELLIPSE,k1), iterations = iter_1)
        close1 = cv2.morphologyEx(open1, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE,k1), iterations = iter_1)
        #2nd
        open2 = cv2.morphologyEx(close1, cv2.MORPH_OPEN,  cv2.getStructuringElement(cv2.MORPH_ELLIPSE,k2), iterations = iter_2)
        close2 = cv2.morphologyEx(open2, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE,k2), iterations = iter_2)
        #3rd
        open3 = cv2.morphologyEx(close2, cv2.MORPH_OPEN,  cv2.getStructuringElement(cv2.MORPH_ELLIPSE,k3), iterations = iter_3)
        close3 = cv2.morphologyEx(open3, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE,k3), iterations = iter_3)	

        return close3
    
    def filter_shapes(self,image, contour_area_min, contour_area_max):

        vessel_mask = np.ones(image.shape[:2], dtype="uint8") * 255
        
        vessel_contours, _ = cv2.findContours(image.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        
        for contour in vessel_contours:
            perimeter = cv2.arcLength(contour, True)
            polygon = cv2.approxPolyDP(contour, 0.04 * perimeter, False)
            if len(polygon) > 4 and contour_area_min <= cv2.contourArea(contour) <= contour_area_max:
                cv2.drawContours(vessel_mask, [contour], -1, 0, -1)
        # subtract noise from image
        clean_image = cv2.bitwise_and(image, image, mask=vessel_mask)        
        return clean_image


    def fuzzy_c_mean(self,image,n_clusters=2,max_iter=4,m=2):
        fcm = FCM(n_clusters=n_clusters,max_iter=max_iter,m=m)  
        X = image.reshape((-1,len(image.shape)))
        fcm.fit(X)
        labeld_X = fcm.predict(X)
        transformed_X = fcm.centers[labeld_X]   
        quatized_array = device_get(transformed_X.astype('uint8').reshape((image.shape)))
        return quatized_array

    def k_mean(self,image,k=2,max_iter=4):
        pixel_vals = image.reshape((-1,len(image.shape)))
        pixel_vals = np.float32(pixel_vals)
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, max_iter, 0.85)
        retval, labels, centers = cv2.kmeans(pixel_vals, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
        centers = np.uint8(centers)
        segmented_data = centers[labels.flatten()]
        segmented_image = segmented_data.reshape((image.shape))
        return segmented_image

    def level_set(self,image,max_iter=200):
        segmented_image = chan_vese(image, mu=0.01, lambda1=1, lambda2=1, tol=1e-3,max_num_iter=max_iter).astype(np.uint8)
        return segmented_image

    def apply_filter(self, image):

        # get the green channel
        blue, green, red = cv2.split(image)

        # Contrast limited adaptive histogram equalization (CLAHE)
        clipLimit = self.sliders['CLAHE-Clip-Limit']
        tileGridSize = (self.sliders['CLAHE-Tile-Grid-Size'], self.sliders['CLAHE-Tile-Grid-Size'])
        clahe = cv2.createCLAHE(clipLimit=clipLimit,tileGridSize=tileGridSize).apply(green)

        # Morphological operations
        morphology_img = self.morphology_diff(clahe)
      
        # subtract
        subtracted = cv2.subtract(morphology_img, clahe)

        # noise filter
        noise_removed  = self.filter_shapes(subtracted, contour_area_max=500, contour_area_min=1)
        

        # segmentation
        segmentation_method = self.sliders['Segmentation-Method(0-cmeans,1-kmeans,2-levelset)']
        if segmentation_method == 0:
            segmented_image  = self.fuzzy_c_mean(noise_removed, n_clusters=2, max_iter=self.sliders['Segmentation-Iterations'])
            _, segmented_image = cv2.threshold(segmented_image, 1, 255, cv2.THRESH_BINARY)
            

        elif segmentation_method == 1:
            segmented_image = self.k_mean(noise_removed,max_iter=self.sliders['Segmentation-Iterations']) 
            _, segmented_image = cv2.threshold(segmented_image, 1, 255, cv2.THRESH_BINARY)

        elif segmentation_method == 2:
            segmented_image = self.level_set(noise_removed,max_iter=self.sliders['Segmentation-Iterations'])
            _, segmented_image = cv2.threshold(segmented_image, 0, 255, cv2.THRESH_BINARY_INV)   
        
        return segmented_image,green
    
    def run_every_second(self):
        current_time = time.time()
        if self.last_time is None:
            self.last_time = current_time
            return False
        elif current_time - self.last_time >= 1:
            self.last_time = current_time
            return True
        else:
            return False
   
    def process_image(self):
        try:
            modified_img, green = self.apply_filter(self.img.copy())
            self.numpy_vertical = np.vstack((green, modified_img))
            cv2.imshow('Modified Image', self.numpy_vertical)
        except:
            pass

    
    def run(self):
        while True:
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q') or key == 27:  # 27: ESC key
                break
        cv2.destroyAllWindows()

if __name__ == '__main__':
    path = "/clean_dataset_325"

    app = ImageSlider(path)
    app.run()
