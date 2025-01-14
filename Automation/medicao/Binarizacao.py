import cv2
import os

def binarizar():
    # Carregar a imagem em escala de cinza
    image_path = 'Imagem2.jpg'
    image = cv2.imread(image_path)

    # Convertendo para escala de cinza
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Aplicar binarização para melhorar a detecção
    _, binary_image = cv2.threshold(gray_image, 118, 255, cv2.THRESH_BINARY_INV)

    # Pegar o caminho da pasta onde o script está sendo executado
    caminho_pasta = os.path.dirname(os.path.abspath(__file__))
    
    # Salvar a imagem no disco
    cv2.imwrite(f'{caminho_pasta}/cinza.jpg', gray_image)
    cv2.imwrite(f'{caminho_pasta}/Binarizada.jpg', binary_image)

binarizar()

