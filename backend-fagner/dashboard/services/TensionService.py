import os
import cv2
import time
import numpy as np
from opcua import Client, ua
from pypylon import pylon
import paramiko
import pytesseract

import easyocr
pytesseract.pytesseract.tesseract_cmd = r'C:\Tesseract-OCR\tesseract.exe'

class TensionService:
    def __init__(self, stencil_id):
        self.stencil_id = stencil_id
        self.image_points_dir = 'images_final'
        self.clp_url = "opc.tcp://192.168.1.1:4840"
        self.client = Client(self.clp_url)

        # Defina o endereço IP da Raspberry Pi, usuário e senha
        self.raspberry_ip = '192.168.1.98'
        self.username = 'smart'
        self.password = 'smart'

    def getFotos(self):
        path_p1 = os.path.join(self.image_points_dir, f"ponto_1_bin.png")
        path_p2 = os.path.join(self.image_points_dir, f"ponto_2_bin.png")
        path_p3 = os.path.join(self.image_points_dir, f"ponto_3_bin.png") 
        path_p4 = os.path.join(self.image_points_dir, f"ponto_4_bin.png")
        
       
        return path_p1.replace("\\", "/"), path_p2.replace("\\", "/"), path_p3.replace("\\", "/"), path_p4.replace("\\", "/")

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
        destination_path_image = os.path.join(self.final_image_dir,"ponto_1.png") 
        sftp.get('images/ValuePoint1.jpg', destination_path_image)
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
        destination_path_image = os.path.join(self.final_image_dir,"ponto_1.png") 
        sftp.get('images/ValuePoint2.jpg', destination_path_image)
        sftp.close()
        ssh.close()

    def take_photo_3(self):
        # Conectar via SSH
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(self.raspberry_ip, username=self.username, password=self.password)

        # Comando para capturar a imagem e salvar na Raspberry Pi
        #stdin, stdout, stderr = ssh.exec_command('libcamera-still -o images/image.jpg')

        stdin, stdout, stderr = ssh.exec_command('sudo fswebcam -r 1920x1080 images/ValuePoint3.jpg')
        error = stderr.read().decode()
        if error:
            print(f"Erro ao capturar imagem: {error}")

        time.sleep(2)  # Aguarda a captura da imagem

        # Transferindo a imagem da Raspberry Pi para o Windows
        sftp = ssh.open_sftp()
        destination_path_image = os.path.join(self.final_image_dir,"ponto_3.png") 
        sftp.get('images/ValuePoint3.jpg', destination_path_image)
        sftp.close()
        ssh.close()

    def take_photo_4(self):
        # Conectar via SSH
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(self.raspberry_ip, username=self.username, password=self.password)

        # Comando para capturar a imagem e salvar na Raspberry Pi
        #stdin, stdout, stderr = ssh.exec_command('libcamera-still -o images/image.jpg')

        stdin, stdout, stderr = ssh.exec_command('sudo fswebcam -r 1920x1080 images/ValuePoint4.jpg')
        error = stderr.read().decode()
        if error:
            print(f"Erro ao capturar imagem: {error}")

        time.sleep(2)  # Aguarda a captura da imagem

        # Transferindo a imagem da Raspberry Pi para o Windows
        sftp = ssh.open_sftp()
        destination_path_image = os.path.join(self.final_image_dir,"ponto_4.png") 
        sftp.get('images/ValuePoint4.jpg', destination_path_image)
        sftp.close()
        ssh.close()

        



    
    def prepare_images1(self):
        imagemOriginal = cv2.imread('images_final/ponto_1.png') 
        imagemOriginal = imagemOriginal[540:700,800:1210]

        path_p1 = "images_final/ponto_1_tratada.png"
        cv2.imwrite(path_p1, imagemOriginal)

        reader = easyocr.Reader(['pt'])
        results = reader.readtext(
            image=path_p1
        )   

        text=''
        textoResposta = ''
        for result in results:
            print(result[1])
            text = result[1]

        for i, l in enumerate(text):
            if i  <= 1:
                textoResposta += l
            else:
                textoResposta += "."+l

        print("RESPOSTA", textoResposta)

        self.binarizar("images_final/ponto_1.png",1)
            
        
        return  textoResposta

    

    def prepare_images2(self):
        imagemOriginal = cv2.imread('images_final/ponto_2.png') 
        imagemOriginal = imagemOriginal[520:720,800:1210]

        path_p1 = "images_final/ponto_2_tratada.png"
        cv2.imwrite(path_p1, imagemOriginal)

        reader = easyocr.Reader(['pt'])
        results = reader.readtext(
            image=path_p1
        )   

        text=''
        textoResposta = ''
        for result in results:
            print(result[1])
            text = result[1]

        for i, l in enumerate(text):
            if i  <= 1:
                textoResposta += l
            else:
                textoResposta += "."+l

        print("RESPOSTA", textoResposta)
        self.binarizar("images_final/ponto_2.png",2) 
        
        return  textoResposta
        
    
    def prepare_images3(self):
        imagemOriginal = cv2.imread('images_final/ponto_3.png') 
        imagemOriginal = imagemOriginal[520:720,800:1210]

        path_p1 = "images_final/ponto_3_tratada.png"
        cv2.imwrite(path_p1, imagemOriginal)

        reader = easyocr.Reader(['pt'])
        results = reader.readtext(
            image=path_p1
        )   

        text=''
        textoResposta = ''
        for result in results:
            print(result[1])
            text = result[1]

        for i, l in enumerate(text):
            if i  <= 1:
                textoResposta += l
            else:
                textoResposta += "."+l

        print("RESPOSTA", textoResposta)
        self.binarizar("images_final/ponto_3.png",3)   
        
        return  textoResposta
    
    def prepare_images4(self):
        imagemOriginal = cv2.imread('images_final/ponto_4.png') 
        imagemOriginal = imagemOriginal[520:720,800:1210]

        path_p1 = "images_final/ponto_4_tratada.png"
        cv2.imwrite(path_p1, imagemOriginal)

        reader = easyocr.Reader(['pt'])
        results = reader.readtext(
            image=path_p1
        )   

        text=''
        textoResposta = ''
        for result in results:
            print(result[1])
            text = result[1]

        for i, l in enumerate(text):
            if i  <= 1:
                textoResposta += l
            else:
                textoResposta += "."+l

        print("RESPOSTA", textoResposta)
            
        self.binarizar("images_final/ponto_4.png",4)
        return  textoResposta
    

    def binarizar(self, path,point):
        img = cv2.imread(path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
        cv2.imwrite(f"{self.image_points_dir}/ponto_{point}_bin.png", thresh)
        

    def main(self):
        '''try:
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
                    if posicao == 8:
                        if complete and not moving:
                            self.take_photo_2()
                            break
                    if posicao == 13:
                        if complete and not moving:
                            self.take_photo_2()
                            break

                    if posicao == 18:
                        if complete and not moving:
                            self.take_photo_2()
                            break



                    time.sleep(1)
                time.sleep(0.5)
            
            valorDaPosicao.set_value(ua.DataValue(ua.Variant(99, ua.VariantType.UInt16)))
            final_image_path_p1 = self.combine_images()
            final_image_path_p2 = self.combine_images()
            final_image_path_p3 = self.combine_images()
            final_image_path_p4 = self.combine_images()
            
           

            return final_image_path_p1, final_image_path_p2, final_image_path_p3, final_image_path_p4

        except Exception as e:
            print(f"Erro: {e}")
        finally:
            self.client.disconnect()
            print("Conexão com o CLP encerrada.")'''
        
        textoP1 = self.prepare_images1()   
        textoP2 = self.prepare_images2()
        textoP3 = self.prepare_images3()
        textoP4 = self.prepare_images4() 
            
        final_image_path_p1 , final_image_path_p2, final_image_path_p3, final_image_path_p4 = self.getFotos()
        

        return final_image_path_p1, final_image_path_p2, final_image_path_p3, final_image_path_p4, textoP1, textoP2, textoP3, textoP4
