import paramiko
import time
import cv2
import pytesseract
import os
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def capture_image_in_cam(numero):
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
        #cv2.imshow('Imagem Capturada', frame)

        # Pegar o caminho da pasta onde o script está sendo executado
        caminho_pasta = os.path.dirname(os.path.abspath(__file__))
        
        # Salvar a imagem no disco
        cv2.imwrite(f'{caminho_pasta}/medicao/point.jpg', frame)
        print(f"Imagem salva em: {caminho_pasta}")

        # Esperar uma tecla ser pressionada para fechar a janela
        #cv2.waitKey(0)

    # Liberar a câmera e fechar as janelas abertas
    camera.release()
    

count = 1

while(count < 4):
    capture_image_in_cam(count)
    count+1

# Processamento e extração do número
#extracted_number = process_image_and_extract_number()
#print(f'O número extraído é: {extracted_number}')
