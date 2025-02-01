import os
import cv2
import time
import numpy as np
from opcua import Client, ua
from pypylon import pylon
import paramiko
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

class TensionService:
    def __init__(self, stencil_id):
        self.stencil_id = stencil_id
        self.image_dir = 'ipoints'
        self.clp_url = "opc.tcp://192.168.1.1:4840"
        self.client = Client(self.clp_url)

        # Defina o endereço IP da Raspberry Pi, usuário e senha
        self.raspberry_ip = '192.168.1.98'
        self.username = 'smart'
        self.password = 'smart'

    def take_photo_1(self):
        # Conectar via SSH
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(self.raspberry_ip, username=self.username, password=self.password)

        # Comando para capturar a imagem e salvar na Raspberry Pi
        #stdin, stdout, stderr = ssh.exec_command('libcamera-still -o images/image.jpg')

        stdin, stdout, stderr = ssh.exec_command('sudo fswebcam -r 1920x1080 images/ValuePoint1.jpg')
        error = stderr.read().decode()
        if error:
            print(f"Erro ao capturar imagem: {error}")

        time.sleep(2)  # Aguarda a captura da imagem

        # Transferindo a imagem da Raspberry Pi para o Windows
        sftp = ssh.open_sftp()
        sftp.get('images/ValuePoint1.jpg', "ponto_1.png")
        sftp.close()
        ssh.close()

    def take_photo_2(self):
        # Conectar via SSH
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(self.raspberry_ip, username=self.username, password=self.password)

        # Comando para capturar a imagem e salvar na Raspberry Pi
        #stdin, stdout, stderr = ssh.exec_command('libcamera-still -o images/image.jpg')

        stdin, stdout, stderr = ssh.exec_command('sudo fswebcam -r 1920x1080 images/ValuePoint2.jpg')
        error = stderr.read().decode()
        if error:
            print(f"Erro ao capturar imagem: {error}")

        time.sleep(2)  # Aguarda a captura da imagem

        # Transferindo a imagem da Raspberry Pi para o Windows
        sftp = ssh.open_sftp()
        sftp.get('images/ValuePoint2.jpg', "ponto_1.png")
        sftp.close()
        ssh.close()

    

    def capture_image_raspberry_pi(self):
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
        sftp.get('images/ValuePoint.jpg', 'ValuePoint42.jpg')
        sftp.close()
        ssh.close()
    @staticmethod
    def point3():
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
            sftp.get('images/ValuePoint.jpg', 'ValuePoint42.jpg')
            sftp.close()
            ssh.close()

            # Inicia o processamento da imagem
            imagemOriginal = cv2.imread('ValuePoint42.jpg')

            # Convertendo para escala de cinza
            gray_image = cv2.cvtColor(imagemOriginal, cv2.COLOR_BGR2GRAY)

            # Aplicando filtro de mediana e recorte
            imgTratada = cv2.medianBlur(gray_image, 7)
            imgTratada = imgTratada[290:500, 720:1210]  # Recorte da área desejada

            # Binarizações adaptativas
            th2 = cv2.adaptiveThreshold(imgTratada, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 17, 5)
            th3 = cv2.adaptiveThreshold(imgTratada, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 19, 2)

            # Operações morfológicas para melhorar a imagem
            nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
            th2Open = cv2.dilate(th2, nucleo, iterations=8)
            th2Open = cv2.dilate(th2, nucleo, iterations=8)
            th2Open = cv2.dilate(th2, nucleo, iterations=8)

            for _ in range(7):  # Aplica erosão múltiplas vezes
                th2Open = cv2.erode(th2Open, nucleo)

            th2Open = cv2.dilate(th2, nucleo, iterations=8)
            th2Open = cv2.dilate(th2, nucleo, iterations=8)

            th2Open = cv2.erode(th2Open, nucleo)
            th2Open = cv2.erode(th2Open, nucleo)
            th2Open = cv2.erode(th2Open, nucleo)
            th2Open = cv2.erode(th2Open, nucleo)
            th2Open = cv2.erode(th2Open, nucleo)
            th2Open = cv2.erode(th2Open, nucleo)
            th2Open = cv2.erode(th2Open, nucleo)
            th2Open = cv2.erode(th2Open, nucleo)

            th2Open = cv2.dilate(th2, nucleo, iterations=8)

            th2Open = cv2.erode(th2Open, nucleo)
            th2Open = cv2.erode(th2Open, nucleo)
            th2Open = cv2.erode(th2Open, nucleo)
            th2Open = cv2.erode(th2Open, nucleo)
            th2Open = cv2.erode(th2Open, nucleo)

            # Pegar o caminho da pasta onde o script está sendo executado

            # Salvar as imagens processadas no disco
            caminho_pasta = os.path.dirname(os.path.abspath(__file__))
            cv2.imwrite(f'{caminho_pasta}/BinarizadaGausianaAberta.jpg', th2Open)

            # Reconhecimento de dígitos na imagem "BinarizadaGausianaAberta.jpg"
            contornos, _ = cv2.findContours(th2Open, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            recognized_digits = ""

            for cnt in contornos:
                # Obter a caixa delimitadora do contorno
                x, y, w, h = cv2.boundingRect(cnt)

                # Extração da região de interesse (ROI)
                roi = th2Open[y:y+h, x:x+w]

                # Reconhecer dígitos na região de interesse
                custom_config = r'--oem 3 --psm 6 outputbase digits'
                text = pytesseract.image_to_string(roi, config=custom_config)

                # Adicionar dígitos reconhecidos à variável final
                recognized_digits += text.strip()

            # Retorna os dígitos reconhecidos ou 0 se nenhum for detectado
            if recognized_digits == "":
                return "0"
            else:
                return recognized_digits
    
    def point11(self):
        imagemOriginal = cv2.imread('ValuePoint42.jpg')

        # Convertendo para escala de cinza
        gray_image = cv2.cvtColor(imagemOriginal, cv2.COLOR_BGR2GRAY)

        imgTratada = cv2.medianBlur(gray_image, 7)
        # Definir as coordenadas do corte (y_inicial:y_final, x_inicial:x_final)
        # Exemplo: (50, 200) para y e (100, 300) para x
        imgTratada = imgTratada[285:500, 650:1180]


        th2 = cv2.adaptiveThreshold(imgTratada, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
        th3 = cv2.adaptiveThreshold(imgTratada, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 19, 2)

        nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
        th2Open = cv2.dilate(th2, nucleo, iterations = 8)
        th3Open = cv2.dilate(th3, nucleo, iterations = 8)
        th3Open = cv2.dilate(th3, nucleo, iterations = 8)

        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)

        nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,5))
        th2Open = cv2.dilate(th2Open, nucleo, iterations = 2)

        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.dilate(th2Open, nucleo, iterations = 3)

        # Pegar o caminho da pasta onde o script está sendo executado
        caminho_pasta = os.path.dirname(os.path.abspath(__file__))
            
            # Salvar a imagem no disco
        cv2.imwrite(f'{caminho_pasta}/Tratada.jpg', imgTratada)
        cv2.imwrite(f'{caminho_pasta}/NivelCinza.jpg', gray_image)
        cv2.imwrite(f'{caminho_pasta}/BinarizadaMedia.jpg', th2)
        cv2.imwrite(f'{caminho_pasta}/BinarizadaGausiana.jpg', th3)

        cv2.imwrite(f'{caminho_pasta}/BinarizadaMediaAberta.jpg', th2Open)
        cv2.imwrite(f'{caminho_pasta}/BinarizadaGausianaAberta.jpg', th3Open)

        return th2
    
    def point13(self):
        imagemOriginal = cv2.imread('ValuePoint42.jpg')

        # Convertendo para escala de cinza
        gray_image = cv2.cvtColor(imagemOriginal, cv2.COLOR_BGR2GRAY)

        imgTratada = cv2.medianBlur(gray_image, 7)
        # Definir as coordenadas do corte (y_inicial:y_final, x_inicial:x_final)
        # Exemplo: (50, 200) para y e (100, 300) para x
        imgTratada = imgTratada[285:500, 650:1180]


        th2 = cv2.adaptiveThreshold(imgTratada, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
        th3 = cv2.adaptiveThreshold(imgTratada, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 19, 2)

        nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
        th2Open = cv2.dilate(th2, nucleo, iterations = 8)
        th3Open = cv2.dilate(th3, nucleo, iterations = 8)
        th3Open = cv2.dilate(th3, nucleo, iterations = 8)

        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)

        nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,5))
        th2Open = cv2.dilate(th2Open, nucleo, iterations = 2)

        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.dilate(th2Open, nucleo, iterations = 3)

        # Pegar o caminho da pasta onde o script está sendo executado
        caminho_pasta = os.path.dirname(os.path.abspath(__file__))
            
            # Salvar a imagem no disco
        cv2.imwrite(f'{caminho_pasta}/Tratada.jpg', imgTratada)
        cv2.imwrite(f'{caminho_pasta}/NivelCinza.jpg', gray_image)
        cv2.imwrite(f'{caminho_pasta}/BinarizadaMedia.jpg', th2)
        cv2.imwrite(f'{caminho_pasta}/BinarizadaGausiana.jpg', th3)

        cv2.imwrite(f'{caminho_pasta}/BinarizadaMediaAberta.jpg', th2Open)
        cv2.imwrite(f'{caminho_pasta}/BinarizadaGausianaAberta.jpg', th3Open)

        return th2
    
    def point18(self):
        imagemOriginal = cv2.imread('ValuePoint42.jpg')

        # Convertendo para escala de cinza
        gray_image = cv2.cvtColor(imagemOriginal, cv2.COLOR_BGR2GRAY)

        imgTratada = cv2.medianBlur(gray_image, 7)


        # Definir as coordenadas do corte (y_inicial:y_final, x_inicial:x_final)
        # Exemplo: (50, 200) para y e (100, 300) para x
        imgTratada = imgTratada[285:485, 770:1160]


        th2 = cv2.adaptiveThreshold(imgTratada, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
        th3 = cv2.adaptiveThreshold(imgTratada, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 19, 2)

        nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
        th2Open = cv2.dilate(th2, nucleo, iterations = 8)
        th3Open = cv2.dilate(th3, nucleo, iterations = 8)
        th3Open = cv2.dilate(th3, nucleo, iterations = 4)

        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)
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
        th2Open = cv2.erode(th2Open,nucleo)

        th2Open = cv2.dilate(th2Open, nucleo, iterations = 4)
        th2Open = cv2.erode(th2Open,nucleo)
        th2Open = cv2.erode(th2Open,nucleo)


        # Pegar o caminho da pasta onde o script está sendo executado
        caminho_pasta = os.path.dirname(os.path.abspath(__file__))
            
            # Salvar a imagem no disco
        cv2.imwrite(f'{caminho_pasta}/Tratada.jpg', imgTratada)
        cv2.imwrite(f'{caminho_pasta}/NivelCinza.jpg', gray_image)
        cv2.imwrite(f'{caminho_pasta}/BinarizadaMedia.jpg', th2)
        cv2.imwrite(f'{caminho_pasta}/BinarizadaGausiana.jpg', th3)

        cv2.imwrite(f'{caminho_pasta}/BinarizadaMediaAberta.jpg', th2Open)
        cv2.imwrite(f'{caminho_pasta}/BinarizadaGausianaAberta.jpg', th3Open)

        # Carregar a imagem binarizada
        image_path = 'BinarizadaMediaAberta.jpg'
        img = cv2.imread(image_path)

        # Inverter as cores (se necessário, dependendo do binarizado: fundo preto e números brancos)
            # Neste caso, parece que o fundo é preto, então não é necessário inverter.
        inverted = img

        custom_config = r'--oem 3 --psm 6 outputbase digits'
        text = pytesseract.image_to_string(img, config=custom_config)

                # Exibir a região detectada e os números reconhecidos


        print(f"Números detectados na região: {text.strip()}")
        textoExtraido = text.strip()

        return textoExtraido

    def main(self):
        try:
            self.client.connect()
            print("Conectado ao CLP")

            topLamp = self.client.get_node("ns=2;s=GVL_OPC.xTopLamp")
            bottomLamp = self.client.get_node("ns=2;s=GVL_OPC.xBottomLamp")
            topLamp.set_value(ua.DataValue(ua.Variant(True, ua.VariantType.Boolean)))
            bottomLamp.set_value(ua.DataValue(ua.Variant(True, ua.VariantType.Boolean)))

            completeValue = self.client.get_node("ns=2;s=GVL_OPC.xComplete")
            movingValue = self.client.get_node("ns=2;s=GVL_OPC.xBusy")
            valorDaPosicao = self.client.get_node("ns=2;s=GVL_OPC.uiValue")
            valorDaPosicao.set_value(ua.DataValue(ua.Variant(1, ua.VariantType.UInt16)))
            for posicao in range(1, 21):
                valorDaPosicao.set_value(ua.DataValue(ua.Variant(posicao, ua.VariantType.UInt16)))
                print(f"Movendo para a posição {posicao}")

                while True:
                    complete = completeValue.get_value()
                    moving = movingValue.get_value()
                    print(f"complete: {complete}, busy: {moving}")
                    time.sleep(2)

                    if posicao == 3:
                        if complete and not moving:
                            self.take_photo_1()
                            break



                    time.sleep(1)
                time.sleep(0.5)
            
            valorDaPosicao.set_value(ua.DataValue(ua.Variant(99, ua.VariantType.UInt16)))
            final_image_path = self.combine_images()
            final_image = cv2.imread(final_image_path)
            final_image, scratch_count = self.detect_scratches(final_image)

            return final_image_path, scratch_count

        except Exception as e:
            print(f"Erro: {e}")
        finally:
            self.client.disconnect()
            print("Conexão com o CLP encerrada.")
