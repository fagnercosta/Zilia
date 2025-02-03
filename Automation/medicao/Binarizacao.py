import cv2
import os



def binarizar():
    # Carregar a imagem em escala de cinza
    image_path = 'foto_posicao_47.png'
    image = cv2.imread(image_path)

    imgTratada = image[50:660, 300:1000]

    # Convertendo para escala de cinza
    gray_image = cv2.cvtColor(imgTratada, cv2.COLOR_BGR2GRAY)

    # Aplicar binarização para melhorar a detecção
    _, binary_image = cv2.threshold(gray_image, 180, 255, cv2.THRESH_BINARY)

    # Pegar o caminho da pasta onde o script está sendo executado
    caminho_pasta = os.path.dirname(os.path.abspath(__file__))
    
    # Salvar a imagem no disco
    cv2.imwrite(f'{caminho_pasta}/cinzaFINAL.jpg', gray_image)
    cv2.imwrite(f'{caminho_pasta}/BinarizadaFINAL.jpg', binary_image)

   

binarizar()

