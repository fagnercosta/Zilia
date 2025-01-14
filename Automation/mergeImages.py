import os
import cv2
import numpy as np

# Defina o caminho para o diretório com as imagens
image_dir = 'images'

# Número de linhas e colunas da matriz de imagens
rows = 8
cols = 6

# Defina a resolução final da imagem
final_width = 1280
final_height = 720

# Defina a resolução das imagens individuais na matriz
img_width = final_width // cols
img_height = final_height // rows

# Inicialize a imagem final (1920x1080)
final_image = np.zeros((final_height, final_width, 3), dtype=np.uint8)

# Liste todas as imagens no diretório (ordenadas corretamente)
image_files = sorted([f for f in os.listdir(image_dir) if f.endswith(('.png', '.jpg', '.jpeg'))])

# Itere sobre as imagens e as posicione na matriz
for i in range(rows):
    for j in range(cols):
        # Calcule o índice da imagem atual
        img_idx = i * cols + j
        
        if img_idx < len(image_files):
            # Carregue a imagem
            img = cv2.imread(os.path.join(image_dir, image_files[img_idx]))
            
            # Redimensione a imagem para caber na célula da matriz
            img_resized = cv2.resize(img, (img_width, img_height))
            
            # Defina a posição da célula na imagem final
            y = i * img_height
            x = j * img_width
            
            # Coloque a imagem redimensionada na célula
            final_image[y:y + img_height, x:x + img_width] = img_resized

# Exiba a imagem final
cv2.imshow('Imagem Combinada', final_image)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Salve a imagem final se necessário
cv2.imwrite('imagem_combinada_1920x1080.jpg', final_image)
