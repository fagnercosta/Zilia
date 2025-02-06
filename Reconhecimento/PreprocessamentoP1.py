import cv2
import numpy as np

import os


imagemOriginal = cv2.imread('ponto_1.png')
imagemOriginal = imagemOriginal[540:700,800:1210]

cv2.imwrite(f'ImagemTesteCORTADA.png', imagemOriginal)

# Convertendo para escala de cinza
gray_image = cv2.cvtColor(imagemOriginal, cv2.COLOR_BGR2GRAY)

imgTratada = cv2.medianBlur(gray_image, 7)


# Definir as coordenadas do corte (y_inicial:y_final, x_inicial:x_final)
# Exemplo: (50, 200) para y e (100, 300) para x
#


th2 = cv2.adaptiveThreshold(imgTratada, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
th3 = cv2.adaptiveThreshold(imgTratada, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 19, 2)

nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
th2Open = cv2.dilate(th2, nucleo, iterations = 2)


th2Open = cv2.erode(th2Open,nucleo)
th2Open = cv2.erode(th2Open,nucleo)
th2Open = cv2.erode(th2Open,nucleo)


nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,5))
th2Open = cv2.dilate(th2Open, nucleo, iterations = 7)

th2Open = cv2.erode(th2Open,nucleo)
th2Open = cv2.erode(th2Open,nucleo)
th2Open = cv2.erode(th2Open,nucleo)

th2Open = cv2.erode(th2Open,nucleo)
th2Open = cv2.erode(th2Open,nucleo)
th2Open = cv2.erode(th2Open,nucleo)

th2Open = cv2.erode(th2Open,nucleo)


th2Open = cv2.dilate(th2Open, nucleo, iterations = 2)






cv2.imwrite(f'ImagemTeste.png', th2Open)





# Pegar o caminho da pasta onde o script está sendo executado
caminho_pasta = os.path.dirname(os.path.abspath(__file__))
    
    # Salvar a imagem no disco
