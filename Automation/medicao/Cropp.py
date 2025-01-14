import cv2

# Carrega a imagem
imagem = cv2.imread('01.jpeg')

# Definir as coordenadas do corte (y_inicial:y_final, x_inicial:x_final)
# Exemplo: (50, 200) para y e (100, 300) para x
imagem_recortada = imagem[240:500, 600:1250]

# Exibir a imagem recortada
cv2.imshow('Imagem Recortada', imagem_recortada)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Opcional: Salvar a imagem recortada
cv2.imwrite('imagem_recortada.jpg', imagem_recortada)

