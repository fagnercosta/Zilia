import cv2
import numpy as np


# Caminho do arquivo
image_path = "BinarizadaFINAL.jpg"

# Carregar a imagem em escala de cinza
image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

# Encontrar contornos
contours, _ = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)





# Iterar sobre cada contorno encontrado
for cnt in contours:
    # Obter a caixa delimitadora do contorno
    x, y, w, h = cv2.boundingRect(cnt)
    print("Contorno encontrado na posicao: ", x, y, w, h)
