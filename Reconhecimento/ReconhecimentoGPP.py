import cv2
import pytesseract

# Definir o caminho para o executável do Tesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Tesseract-OCR\tesseract.exe'

# Carregar a imagem em escala de cinza
img = cv2.imread("ImagemTeste", cv2.IMREAD_GRAYSCALE)

# Aplicar threshold para binarização
blurred = cv2.GaussianBlur(img, (3, 3), 0)
_, binary = cv2.threshold(blurred, 100, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

# Aplicar morfologia para suavizar caracteres
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))

morphed = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)

#morphed = cv2.resize(morphed, None, fx=2, fy=6, interpolation=cv2.INTER_CUBIC)

# Exibir a imagem após o pré-processamento (opcional, para verificação visual)
cv2.imshow("Morphed Image", morphed)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Configuração do Tesseract para reconhecer apenas dígitos e ponto
custom_config = r'--oem 3 --psm 8 -c tessedit_char_whitelist=0123456789.'

# Realizar OCR na imagem pré-processada
text = pytesseract.image_to_string(morphed, config=custom_config)

# Exibir o resultado do OCR
print(f"Resultado OCR: {text}")