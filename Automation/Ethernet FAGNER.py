import paramiko
import time
import cv2
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def capture_image_raspberry_pi():
    # Defina o endereço IP da Raspberry Pi, usuário e senha
    raspberry_ip = '192.168.1.98'
    username = 'smart'
    password = 'smart'

    # Conectar via SSH
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(raspberry_ip, username=username, password=password)

    # Comando para capturar a imagem e salvar na Raspberry Pi
    #stdin, stdout, stderr = ssh.exec_command('libcamera-still -o images/image.jpg')

    stdin, stdout, stderr = ssh.exec_command('sudo fswebcam -r 1920x1080 images/ValuePoint.jpg')
    error = stderr.read().decode()
    if error:
        print(f"Erro ao capturar imagem: {error}")

    time.sleep(2)  # Aguarda a captura da imagem

    # Transferindo a imagem da Raspberry Pi para o Windows
    sftp = ssh.open_sftp()
    sftp.get('images/ValuePoint.jpg', 'Imagem4.jpg')
    sftp.close()
    ssh.close()

def process_image_and_extract_number():
    # Carregar a imagem em escala de cinza
    image_path = 'image.jpg'
    image = cv2.imread(image_path)

    # Convertendo para escala de cinza
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Aplicar binarização para melhorar a detecção
    _, binary_image = cv2.threshold(gray_image, 128, 255, cv2.THRESH_BINARY_INV)

    # Use o Tesseract OCR para extrair texto da imagem
    custom_config = r'--oem 3 --psm 6'  # Configuração personalizada para OCR
    extracted_text = pytesseract.image_to_string(binary_image, config=custom_config)

    # Mostre o texto extraído no terminal
    print("Texto extraído:", extracted_text)

    # Exibindo a imagem binarizada (opcional)
    cv2.imshow('Binarized Image', binary_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()



capture_image_raspberry_pi()
    


# Processamento e extração do número
#extracted_number = process_image_and_extract_number()
#print(f'O número extraído é: {extracted_number}')
