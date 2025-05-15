import pytesseract
import cv2

# Configuração do Tesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Tesseract-OCR\tesseract.exe'

# Carregar a imagem
imagemOriginal = cv2.imread('2.png', 1)

if imagemOriginal is None:
    raise ValueError("Não foi possível carregar a imagem")

# Processamento de imagem
gray_image = cv2.cvtColor(imagemOriginal, cv2.COLOR_BGR2GRAY)
imgTratada = cv2.medianBlur(gray_image, 3)  # Desfoque leve
imgTratada = imgTratada[20:880, 380:1100]

# Binarização adaptativa com ajuste nos parâmetros
th3 = cv2.adaptiveThreshold(imgTratada, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                           cv2.THRESH_BINARY_INV, 21, 3)

# Operações morfológicas com menos iterações
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
th3Open = cv2.dilate(th3, kernel, iterations=25)
th3Open = cv2.erode(th3Open, kernel, iterations=10)

cv2.imwrite('BinarizadaGausianaAberta.jpg', th3Open)

# Tentar reconhecimento direto na imagem binarizada
custom_config = r'--oem 3 --psm 7 -c tessedit_char_whitelist=0123456789.'
recognized_digits = pytesseract.image_to_string(th3Open, config=custom_config).strip()

print("Dígitos reconhecidos (direto):", recognized_digits)

  
