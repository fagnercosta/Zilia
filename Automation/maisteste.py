from opcua import Client, ua
from pypylon import pylon
import cv2  # Para salvar e exibir a imagem
import os
import time
import numpy as np

def take_photo():
    # Conectar à câmera Basler
    camera = pylon.InstantCamera(pylon.TlFactory.GetInstance().CreateFirstDevice())

    # Iniciar a câmera
    camera.StartGrabbing(pylon.GrabStrategy_LatestImageOnly)
    converter = pylon.ImageFormatConverter()

    # Converter para o formato OpenCV (BGR)
    converter.OutputPixelFormat = pylon.PixelType_BGR8packed
    converter.OutputBitAlignment = pylon.OutputBitAlignment_MsbAligned

    # Capturar uma imagem
    grabResult = camera.RetrieveResult(5000, pylon.TimeoutHandling_ThrowException)

    img = None
    if grabResult.GrabSucceeded():
        # Acessar os dados da imagem
        image = converter.Convert(grabResult)
        img = image.GetArray()

    # Finalizar a câmera
    camera.StopGrabbing()

    return img

def save_photo(img, pos):
    # Diretório onde as fotos serão armazenadas
    image_dir = "images"
    os.makedirs(image_dir, exist_ok=True)  # Cria o diretório, se não existir

    # Define o nome do arquivo com base na posição
    image_path = os.path.join(image_dir, f"foto_posicao_{pos}.png")

    # Salva a imagem
    if img is not None:
        cv2.imwrite(image_path, img)
        return image_path
    return None


# --- Parte do robô e CLP ---

clp_url = "opc.tcp://192.168.1.1:4840"  

# Cria uma instância do cliente OPC UA
clp_client = Client(clp_url)

try:
    # Conecta ao CLP
    clp_client.connect()
    print("Conectado ao CLP")

    # Referência ao nó OPC UA
    topLamp = clp_client.get_node("ns=2;s=GVL_OPC.xTopLamp")
    bottomLamp = clp_client.get_node("ns=2;s=GVL_OPC.xBottomLamp")
    topLamp.set_value(ua.DataValue(ua.Variant(True, ua.VariantType.Boolean)))
    bottomLamp.set_value(ua.DataValue(ua.Variant(True, ua.VariantType.Boolean)))


    completeValue = clp_client.get_node("ns=2;s=GVL_OPC.xComplete")
    movingValue = clp_client.get_node("ns=2;s=GVL_OPC.xBusy")
    valorDaPosicao = clp_client.get_node("ns=2;s=GVL_OPC.uiValue")


    # Lista das posições específicas
    posicoes = [38, 39, 40, 41, 42, 45, 46, 47, 48, 51, 52, 53, 54, 57, 58, 59, 60, 63, 64, 65, 66, 69, 70, 71, 72]

    for posicao in posicoes:
        # Mover o robô para a nova posição
        valorDaPosicao.set_value(ua.DataValue(ua.Variant(posicao, ua.VariantType.UInt16)))
        print(f"Movendo para a posição {posicao}")

        # Aguardar até que o movimento seja concluído
        while True:
            complete = completeValue.get_value()  # True se o movimento foi concluído
            moving = movingValue.get_value()      # True se o robô está em movimento
            print(f"complete: {complete}, busy: {moving}")
            time.sleep(3)

            if complete and not moving:
                # Movimento concluído, tirar a foto
                img = take_photo()

                # Salva a foto no diretório "images"
                image_path = save_photo(img, posicao)

                # Verifica se a foto foi salva com sucesso
                if image_path:
                    print(f"Foto salva em {image_path}")
                else:
                    print(f"Erro ao tirar a foto na posição {posicao}")
                break

            time.sleep(1)

        time.sleep(0.5)

except ValueError:
    print("Por favor, insira um número inteiro válido.")
except Exception as e:
    print(f"Erro ao enviar posição para o CLP: {e}")
except KeyboardInterrupt:
    print("\nOperação cancelada pelo usuário.")
finally:
    # Desconecta do CLP
    clp_client.disconnect()
    print("Conexão com o CLP encerrada.")
from opcua import Client, ua
from pypylon import pylon
import cv2  # Para salvar e exibir a imagem
import os
import time
import numpy as np

def take_photo():
    # Conectar à câmera Basler
    camera = pylon.InstantCamera(pylon.TlFactory.GetInstance().CreateFirstDevice())

    # Iniciar a câmera
    camera.StartGrabbing(pylon.GrabStrategy_LatestImageOnly)
    converter = pylon.ImageFormatConverter()

    # Converter para o formato OpenCV (BGR)
    converter.OutputPixelFormat = pylon.PixelType_BGR8packed
    converter.OutputBitAlignment = pylon.OutputBitAlignment_MsbAligned

    # Capturar uma imagem
    grabResult = camera.RetrieveResult(5000, pylon.TimeoutHandling_ThrowException)

    img = None
    if grabResult.GrabSucceeded():
        # Acessar os dados da imagem
        image = converter.Convert(grabResult)
        img = image.GetArray()

    # Finalizar a câmera
    camera.StopGrabbing()

    return img

def save_photo(img, pos):
    # Diretório onde as fotos serão armazenadas
    image_dir = "images"
    os.makedirs(image_dir, exist_ok=True)  # Cria o diretório, se não existir

    # Define o nome do arquivo com base na posição
    image_path = os.path.join(image_dir, f"foto_posicao_{pos}.png")

    # Salva a imagem
    if img is not None:
        cv2.imwrite(image_path, img)
        return image_path
    return None


# --- Parte do robô e CLP ---

clp_url = "opc.tcp://192.168.1.1:4840"  

# Cria uma instância do cliente OPC UA
clp_client = Client(clp_url)

try:
    # Conecta ao CLP
    clp_client.connect()
    print("Conectado ao CLP")

    # Referência ao nó OPC UA
    topLamp = clp_client.get_node("ns=2;s=GVL_OPC.xTopLamp")
    bottomLamp = clp_client.get_node("ns=2;s=GVL_OPC.xBottomLamp")
    topLamp.set_value(ua.DataValue(ua.Variant(True, ua.VariantType.Boolean)))
    bottomLamp.set_value(ua.DataValue(ua.Variant(True, ua.VariantType.Boolean)))


    completeValue = clp_client.get_node("ns=2;s=GVL_OPC.xComplete")
    movingValue = clp_client.get_node("ns=2;s=GVL_OPC.xBusy")
    valorDaPosicao = clp_client.get_node("ns=2;s=GVL_OPC.uiValue")


    # Lista das posições específicas

    for posicao in range(31,78):
        # Mover o robô para a nova posição
        valorDaPosicao.set_value(ua.DataValue(ua.Variant(posicao, ua.VariantType.UInt16)))
        print(f"Movendo para a posição {posicao}")

        # Aguardar até que o movimento seja concluído
        while True:
            complete = completeValue.get_value()  # True se o movimento foi concluído
            moving = movingValue.get_value()      # True se o robô está em movimento
            print(f"complete: {complete}, busy: {moving}")
            time.sleep(3)

            if complete and not moving:
                # Movimento concluído, tirar a foto
                img = take_photo()

                # Salva a foto no diretório "images"
                image_path = save_photo(img, posicao)

                # Verifica se a foto foi salva com sucesso
                if image_path:
                    print(f"Foto salva em {image_path}")
                else:
                    print(f"Erro ao tirar a foto na posição {posicao}")
                break


        time.sleep(0.5)

except ValueError:
    print("Por favor, insira um número inteiro válido.")
except Exception as e:
    print(f"Erro ao enviar posição para o CLP: {e}")
except KeyboardInterrupt:
    print("\nOperação cancelada pelo usuário.")
finally:
    # Desconecta do CLP
    clp_client.disconnect()
    print("Conexão com o CLP encerrada.")
