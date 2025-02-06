import cv2
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Tesseract-OCR\tesseract.exe'

# Carregar a imagem binarizada
image_path = 'Teste.png'
img = cv2.imread(image_path)



nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7,7))



th2Open = cv2.dilate(img,nucleo)
cv2.imwrite('Teste2.png', th2Open)

img2 = cv2.imread("Teste2.png")


#custom_config = r'--oem 3 --psm 6 outputbase numers'
#text = pytesseract.image_to_string(img2, config=custom_config)
custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789'
text = pytesseract.image_to_string(img2, config=custom_config)


    # Exibir a região detectada e os números reconhecidos


print(f"Números detectados na região: {text.strip()}")

