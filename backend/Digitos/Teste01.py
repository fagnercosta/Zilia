import cv2
import numpy as np

# Specify the full path to the image
image_path = 'image3.png'

# Load the image
image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

if image is None:
    print(f"Error: Could not load image at {image_path}. Check the file path or integrity.")
    exit()

# Step 1: Increase contrast using histogram equalization
equalized = cv2.equalizeHist(image)

# Step 2: Sharpen the image
kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
sharpened = cv2.filter2D(equalized, -1, kernel)

# Step 3: Reduce noise with a slight blur
denoised = cv2.GaussianBlur(sharpened, (7, 7), 0)

# Step 4: Apply thresholding with a different value
thresh = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5) # Adjusted threshold to 100

# Step 5: Apply dilation to thicken the digits
kernel_dilate = np.ones((2, 2), np.uint8)  # Small kernel for dilation
dilated = cv2.dilate(thresh, kernel_dilate, iterations=1)

# Save the enhanced image
cv2.imwrite('enhanced_image_v2.jpg', dilated)

print("Image processing complete. Enhanced image saved as 'enhanced_image_v2.jpg'.")