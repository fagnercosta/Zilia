import easyocr
import cv2 

reader = easyocr.Reader(['pt'], gpu=True)   
image = cv2.imread('ponto_1_tratada.png')
#image = cv2.resize(image, (700, 400))
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
thresh = cv2.dilate(thresh, nucleo, iterations = 6)
cv2.imwrite('ponto_1-PROCESSADA.png', thresh)
resultados = reader.readtext(thresh)    


for resultado in resultados:
    print(f"{resultado[1]} -  {resultado[0]}")