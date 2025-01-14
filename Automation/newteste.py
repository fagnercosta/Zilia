import cv2
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


# Configure o caminho para o executável do Tesseract OCR, se necessário
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Carregue a imagem
image_path = 'image.jpg'
image = cv2.imread(image_path)

# Convertendo para escala de cinza
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Aplicar binarização para melhorar a detecção
_, binary_image = cv2.threshold(gray_image, 128, 255, cv2.THRESH_BINARY_INV)

# Use o Tesseract OCR para extrair texto da imagem
custom_config = r'--oem 3 --psm 6'  # Configuração personalizada para OCR
extracted_text = pytesseract.image_to_string(binary_image, config=custom_config)

# Mostre o texto extraído no terminal
print("Texto extraído:", extracted_text)

# Exibindo a imagem binarizada (opcional)
cv2.imshow('Binarized Image', binary_image)
cv2.waitKey(0)
cv2.destroyAllWindows()
