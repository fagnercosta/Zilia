import cv2
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


# Carregar a imagem binarizada
image_path = 'BinarizadaMedia.jpg'
img = cv2.imread(image_path)

# Inverter as cores (se necessário, dependendo do binarizado: fundo preto e números brancos)
# Neste caso, parece que o fundo é preto, então não é necessário inverter.
inverted = img



# Utilizar o Tesseract para reconhecer os dígitos apenas na região de interesse
custom_config = r'--oem 3 --psm 6 outputbase digits'
text = pytesseract.image_to_string(img, config=custom_config)

    # Exibir a região detectada e os números reconhecidos
print(f"Números detectados na região: {text.strip()}")