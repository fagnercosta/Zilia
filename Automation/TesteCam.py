import cv2
import os

# Acessar a câmera (0 para a câmera padrão)
camera = cv2.VideoCapture(1)

# Verificar se a câmera foi aberta corretamente
if not camera.isOpened():
    print("Erro ao abrir a câmera")
    exit()

# Ler um quadro da câmera
ret, frame = camera.read()

# Verificar se o quadro foi capturado corretamente
if ret:
    # Exibir a imagem capturada em uma janela
    cv2.imshow('Imagem Capturada', frame)

    # Pegar o caminho da pasta onde o script está sendo executado
    caminho_pasta = os.path.dirname(os.path.abspath(__file__))
    
    # Salvar a imagem no disco
    cv2.imwrite(f'{caminho_pasta}/medicao/imagem_capturada.jpg', frame)

    # Esperar uma tecla ser pressionada para fechar a janela
    cv2.waitKey(0)

# Liberar a câmera e fechar as janelas abertas
camera.release()
cv2.destroyAllWindows()
