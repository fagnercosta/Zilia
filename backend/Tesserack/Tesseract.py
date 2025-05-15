
import pytesseract
import cv2
pytesseract.pytesseract.tesseract_cmd = r'C:\Tesseract-OCR\tesseract.exe'

# Reconhecimento de dígitos na imagem "BinarizadaGausianaAberta.jpg"
imagemOriginal = cv2.imread('ponto_1_tratada_processada_para_leitura.png',1)

if imagemOriginal is None:
    raise ValueError("Não foi possível carregar a imagem")

# Processamento de imagem
gray_image = cv2.cvtColor(imagemOriginal, cv2.COLOR_BGR2GRAY)
imgTratada = cv2.medianBlur(gray_image, 7)
imgTratada = imgTratada[20:880, 380:1100]

# Binarização
th3 = cv2.adaptiveThreshold(imgTratada, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                          cv2.THRESH_BINARY_INV, 19, 2)

# Operações morfológicas
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
th3Open = cv2.dilate(th3, kernel, iterations=20)
th3Open = cv2.erode(th3Open, kernel, iterations=10)

cv2.imwrite('BinarizadaGausianaAberta.jpg', th3Open)

# Encontrar contornos
contornos, _ = cv2.findContours(th3Open, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
recognized_digits = ""

for cnt in contornos:
    x, y, w, h = cv2.boundingRect(cnt)
    roi = th3Open[y:y+h, x:x+w]
    
    # Configuração do Tesseract para dígitos apenas
    custom_config = r'--oem 3 --psm 10 -c tessedit_char_whitelist=0123456789'
    text = pytesseract.image_to_string(roi, config=custom_config)
    
    recognized_digits += text.strip()

print(recognized_digits)