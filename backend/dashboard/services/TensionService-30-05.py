import os
import cv2
import re
import time
import numpy as np
from opcua import Client, ua
from pypylon import pylon
import paramiko
import pytesseract



import easyocr
from dashboard.text_reconize.TextExtract import ExtractTextInImage # Importe ResolverDigists


class TensionService:
    def __init__(self, stencil_id):
        self.stencil_id = stencil_id
        self.final_image_dir = 'images_final'
        self.clp_url = "opc.tcp://192.168.1.1:4840"
        self.client = Client(self.clp_url)
        #TROQUE AQUI PARA TRUE SE FOR ROBO  
        self.robo = False #TROQUE AQUI PARA TRUE SE FOR ROBO
        # Defina o endereço IP da Raspberry Pi, usuário e senha
        self.raspberry_ip = '192.168.1.98'
        self.username = 'smart'
        self.password = 'smart'

    def getFotos(self):
        path_p1 = os.path.join(self.final_image_dir, f"ponto_1_bin.png")
        path_p2 = os.path.join(self.final_image_dir, f"ponto_2_bin.png")
        path_p3 = os.path.join(self.final_image_dir, f"ponto_3_bin.png") 
        path_p4 = os.path.join(self.final_image_dir, f"ponto_4_bin.png")
        
       
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
        destination_path_image = os.path.join(self.final_image_dir,"ponto_2.png") 
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

        imagemOriginal2 = imagemOriginal[300:500,650:1300]
        #imagemOriginal = imagemOriginal[510:720,800:1210]
        #imagemOriginal = imagemOriginal[500:750,840:1280]
        imagemOriginal = imagemOriginal[300:530,620:1280]
        

        

        # Passo 3: Reduzir ruído com um leve desfoque
        denoised = imagemOriginal
        novo_tamanho = (denoised.shape[1] * 2, denoised.shape[0] * 2)

        
         # Passo 3: Reduzir ruído com um leve desfoque
        denoised = cv2.GaussianBlur(imagemOriginal, (7, 7), 0)
        novo_tamanho = (denoised.shape[1] * 2, denoised.shape[0] * 2)

        denoised2 = cv2.resize(denoised, novo_tamanho, interpolation=cv2.INTER_NEAREST)

        '''
        BINARIZANDO A IMAGEM
        '''
         # Pré-processamento
        gray = cv2.cvtColor(denoised, cv2.COLOR_BGR2GRAY)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
        nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        thresh = cv2.dilate(thresh, nucleo, iterations=12)
        thresh = cv2.erode(thresh, nucleo, iterations=5)

        path_binaria = "images_final/ponto_1_tratada_processada_para_leitura_binaria.png"
        cv2.imwrite(path_binaria, thresh)                                                                                                                               

        '''FIM DA BINAREIZAÇAO'''

        path = "images_final/ponto_1_tratada_processada_para_leitura.png"
        cv2.imwrite(path, denoised)

        
        # Usa ExtractTextInImage para extrair o texto
        extrator = ExtractTextInImage(path,1)
        resultado = extrator.extract_text(image=path, image_path_original=imagemOriginal2, image_binaria=path_binaria)     
        textoResposta = extrator.normalize_text(resultado)
        
        print(f"RESPOSTA PONT0 {1} :", textoResposta)
        self.binarizar("images_final/ponto_1.png", 1)
        
        return textoResposta

    

    def prepare_images2(self):
        imagemOriginal = cv2.imread('images_final/ponto_2.png') 
        '''imagemOriginal2 = imagemOriginal[300:500,650:1300]
        #imagemOriginal = imagemOriginal[510:720,800:1210]
        #imagemOriginal = imagemOriginal[500:750,840:1280]
        imagemOriginal = imagemOriginal[300:500,650:1300]'''
        imagemOriginal2 = imagemOriginal[300:500,650:1280]
        #imagemOriginal = imagemOriginal[510:720,800:1210]
        #imagemOriginal = imagemOriginal[500:750,840:1280]
        #imagemOriginal = imagemOriginal[300:500,650:1300]
        imagemOriginal = imagemOriginal[300:530,620:1280]
         
       
        # Passo 3: Reduzir ruído com um leve desfoque
        denoised = cv2.GaussianBlur(imagemOriginal, (7, 7), 0)
        novo_tamanho = (denoised.shape[1] * 2, denoised.shape[0] * 2)

        denoised2 = cv2.resize(denoised, novo_tamanho, interpolation=cv2.INTER_NEAREST)

        '''
        BINARIZANDO A IMAGEM
        '''
         # Pré-processamento
        gray = cv2.cvtColor(denoised, cv2.COLOR_BGR2GRAY)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
        nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        thresh = cv2.dilate(thresh, nucleo, iterations=7)

        path_binaria = "images_final/ponto_2_tratada_processada_para_leitura_binaria.png"
        cv2.imwrite(path_binaria, thresh)                                                                                                                               

        '''FIM DA BINAREIZAÇAO'''

        path = "images_final/ponto_2_tratada_processada_para_leitura.png"
        cv2.imwrite(path, denoised)
        
        # Usa ExtractTextInImage para extrair o texto
        extrator = ExtractTextInImage(path,2)
        resultado = extrator.extract_text(image=path, image_path_original=imagemOriginal2, image_binaria=path_binaria)
        
        textoResposta = extrator.normalize_text(resultado)
        
        print("RESPOSTA PONTO 02", textoResposta)
        self.binarizar("images_final/ponto_2.png", 2)
        
        return textoResposta
        
    
    def prepare_images3(self):
        imagemOriginal = cv2.imread('images_final/ponto_3.png') 
        imagemOriginal2 = imagemOriginal[300:500,650:1300]
        
        imagemOriginal = imagemOriginal[300:530,620:1280]

        
       
        # Passo 3: Reduzir ruído com um leve desfoque
        denoised = cv2.GaussianBlur(imagemOriginal, (7, 7), 0)
        novo_tamanho = (denoised.shape[1] * 2, denoised.shape[0] * 2)
 
        '''
        BINARIZANDO A IMAGEM
        '''
         # Pré-processamento
        gray = cv2.cvtColor(denoised, cv2.COLOR_BGR2GRAY)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
        nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        thresh = cv2.dilate(thresh, nucleo, iterations=12)
        thresh = cv2.erode(thresh, nucleo, iterations=5)

        path_binaria = "images_final/ponto_3_tratada_processada_para_leitura_binaria.png"
        cv2.imwrite(path_binaria, thresh)                                                                                                                               

        '''FIM DA BINAREIZAÇAO'''


        path = "images_final/ponto_3_tratada_processada_para_leitura.png"
        cv2.imwrite(path, denoised)
        
        # Usa ExtractTextInImage para extrair o texto
        extrator = ExtractTextInImage(path,3)
        resultado = extrator.extract_text(image=path, image_path_original=imagemOriginal2, image_binaria=path_binaria)
        
        textoResposta = extrator.normalize_text(resultado)
        
        print("RESPOSTA PONTO 03", textoResposta)
        self.binarizar("images_final/ponto_3.png", 3)
        
        return textoResposta
    
    def prepare_images4(self):
        imagemOriginal = cv2.imread('images_final/ponto_4.png') 
        imagemOriginal2 = imagemOriginal[300:500,650:1300]
        #imagemOriginal = imagemOriginal[510:720,800:1210]
        #imagemOriginal = imagemOriginal[500:750,840:1280]
        imagemOriginal = imagemOriginal[270:550,600:1300]

        
       
        # Passo 3: Reduzir ruído com um leve desfoque
        denoised = cv2.GaussianBlur(imagemOriginal, (7, 7), 0)
        novo_tamanho = (denoised.shape[1] * 2, denoised.shape[0] * 2)

        '''
        BINARIZANDO A IMAGEM
        '''
         # Pré-processamento
        gray = cv2.cvtColor(denoised, cv2.COLOR_BGR2GRAY)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
        nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        thresh = cv2.dilate(thresh, nucleo, iterations=7)

        path_binaria = "images_final/ponto_4_tratada_processada_para_leitura_binaria.png"
        cv2.imwrite(path_binaria, thresh)                                                                                                                               

        '''FIM DA BINAREIZAÇAO'''
 

        path = "images_final/ponto_4_tratada_processada_para_leitura.png"
        cv2.imwrite(path, denoised)
        
        # Usa ExtractTextInImage para extrair o texto
        extrator = ExtractTextInImage(path,4)
        resultado = extrator.extract_text(image=path, image_path_original=imagemOriginal2, image_binaria=path_binaria)
        
        textoResposta = extrator.normalize_text(resultado)
        
        print("RESPOSTA PONTO 04", textoResposta)
        self.binarizar("images_final/ponto_4.png", 4)
        
        return textoResposta
    

    def recortarImagem(self, img,x,y,w,h):
        return img[y:y+h, x:x+w]

    def binarizar(self, path,point):
        img = cv2.imread(path)
        image = img
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
        thresh =cv2.rectangle(thresh, (800,500), (1270, 760),  (0, 255, 0), 20)

        cv2.imwrite(f"{self.final_image_dir}/ponto_{point}_bin.png", thresh)


    def equalizarHistograma(self, image):
        return cv2.equalizeHist(image) 
    
    def processarRobo(self):
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

                #while True:
                complete = completeValue.get_value()
                moving = movingValue.get_value()
                print(f"complete: {complete}, busy: {moving}")
                time.sleep(2)
                    
                if posicao == 3:
                    time.sleep(2)
                    print("Tirando foto 01")
                    self.take_photo_1()
                    #time.sleep(2)

                   #
                            
                            
                if posicao == 8:  
                    print("Tirando foto 02")
                    time.sleep(2)
                    self.take_photo_2()
                    time.sleep(2)
                            
                if posicao == 13:
                        print("Tirando foto 03")
                        time.sleep(4)
                        self.take_photo_3()
                        time.sleep(2)
                            

                if posicao == 18:
                        time.sleep(4)
                        print("Tirando foto 04")
                        self.take_photo_4()
                        time.sleep(2)
                            

                time.sleep(2)
               
            
            valorDaPosicao.set_value(ua.DataValue(ua.Variant(99, ua.VariantType.UInt16)))
            final_image_path_p1, final_image_path_p2,final_image_path_p3, final_image_path_p4 = self.getFotos()
           

            textoP1 = self.prepare_images1()   
            textoP2 = self.prepare_images2()
            textoP3 = self.prepare_images3()
            textoP4 = self.prepare_images4() 
                
            final_image_path_p1 , final_image_path_p2, final_image_path_p3, final_image_path_p4 = self.getFotos()
            
            return final_image_path_p1, final_image_path_p2, final_image_path_p3, final_image_path_p4, textoP1, textoP2, textoP3, textoP4
        except Exception as e:
            print(f"Erro: {e}")
        finally:
            self.client.disconnect()
            print("Conexão com o CLP encerrada.") 


    def processarLocal(self):
        final_image_path_p1, final_image_path_p2,final_image_path_p3, final_image_path_p4 = self.getFotos()
           

        textoP1 = self.prepare_images1()   
        textoP2 = self.prepare_images2()
        textoP3 = self.prepare_images3()
        textoP4 = self.prepare_images4() 
                
        final_image_path_p1 , final_image_path_p2, final_image_path_p3, final_image_path_p4 = self.getFotos()
            

        return final_image_path_p1, final_image_path_p2, final_image_path_p3, final_image_path_p4, textoP1, textoP2, textoP3, textoP4
   
    def main(self):
        if self.robo:
            return self.processarRobo()
        else:
            return self.processarLocal()
        
            
                  
       
