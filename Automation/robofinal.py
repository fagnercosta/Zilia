from opcua import Client, ua
from pypylon import pylon
import cv2
import os
import time
import numpy as np

# Função para tirar uma foto com a câmera Basler
def take_photo():
    camera = pylon.InstantCamera(pylon.TlFactory.GetInstance().CreateFirstDevice())
    camera.StartGrabbing(pylon.GrabStrategy_LatestImageOnly)
    converter = pylon.ImageFormatConverter()
    converter.OutputPixelFormat = pylon.PixelType_BGR8packed
    converter.OutputBitAlignment = pylon.OutputBitAlignment_MsbAligned
    grabResult = camera.RetrieveResult(5000, pylon.TimeoutHandling_ThrowException)

    img = None
    if grabResult.GrabSucceeded():
        image = converter.Convert(grabResult)
        img = image.GetArray()

    camera.StopGrabbing()
    return img

# Função para salvar a foto tirada
def save_photo(img, pos):
    image_dir = "images"
    os.makedirs(image_dir, exist_ok=True)
    image_path = os.path.join(image_dir, f"foto_posicao_{pos}.png")
    if img is not None:
        cv2.imwrite(image_path, img)
        return image_path
    return None

# Função para juntar todas as fotos em uma única imagem
def combine_images():
    image_dir = 'images'
    rows = 8
    cols = 6
    final_width = 1280
    final_height = 720
    img_width = final_width // cols
    img_height = final_height // rows
    final_image = np.zeros((final_height, final_width, 3), dtype=np.uint8)

    image_files = sorted([f for f in os.listdir(image_dir) if f.endswith(('.png', '.jpg', '.jpeg'))])

    for i in range(rows):
        for j in range(cols):
            img_idx = i * cols + j
            if img_idx < len(image_files):
                img = cv2.imread(os.path.join(image_dir, image_files[img_idx]))
                img_resized = cv2.resize(img, (img_width, img_height))
                y = i * img_height
                x = j * img_width
                final_image[y:y + img_height, x:x + img_width] = img_resized

    return final_image

# Função para detectar arranhões usando Transformada de Hough (sem desenhar traços)
def detect_scratches(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)

    # Detectar linhas usando Transformada de Hough
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=50, minLineLength=50, maxLineGap=10)
    
    scratch_count = 0
    if lines is not None:
        scratch_count = len(lines)

    return image, scratch_count

# Função para exibir a quantidade de arranhões na imagem com uma fonte muito grande
def add_scratch_count_to_image(image, scratch_count):
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 3  # Tamanho grande da fonte
    font_color = (0, 255, 0)  # Cor verde
    font_thickness = 5

    # Adicionar o texto na parte superior esquerda da imagem
    cv2.putText(image, f'Scratches: {scratch_count}', (50, 100), font, font_scale, font_color, font_thickness)

    return image

# --- Parte do robô e CLP ---
clp_url = "opc.tcp://192.168.1.1:4840"
clp_client = Client(clp_url)

try:
    clp_client.connect()
    print("Conectado ao CLP")

    topLamp = clp_client.get_node("ns=2;s=GVL_OPC.xTopLamp")
    bottomLamp = clp_client.get_node("ns=2;s=GVL_OPC.xBottomLamp")
    topLamp.set_value(ua.DataValue(ua.Variant(True, ua.VariantType.Boolean)))
    bottomLamp.set_value(ua.DataValue(ua.Variant(True, ua.VariantType.Boolean)))

    completeValue = clp_client.get_node("ns=2;s=GVL_OPC.xComplete")
    movingValue = clp_client.get_node("ns=2;s=GVL_OPC.xBusy")
    valorDaPosicao = clp_client.get_node("ns=2;s=GVL_OPC.uiValue")

    # Loop para mover o robô e tirar fotos em cada posição
    for posicao in range(31, 79):
        valorDaPosicao.set_value(ua.DataValue(ua.Variant(posicao, ua.VariantType.UInt16)))
        print(f"Movendo para a posição {posicao}")

        while True:
            complete = completeValue.get_value()
            moving = movingValue.get_value()
            print(f"complete: {complete}, busy: {moving}")
            time.sleep(2)

            if complete and not moving:
                img = take_photo()
                image_path = save_photo(img, posicao)

                if image_path:
                    print(f"Foto salva em {image_path}")
                else:
                    print(f"Erro ao tirar a foto na posição {posicao}")
                break

            time.sleep(1)
        time.sleep(0.5)

    # Após tirar todas as fotos, combinar as imagens
    final_image = combine_images()

    # Detectar arranhões na imagem combinada
    _, scratch_count = detect_scratches(final_image)

    # Adicionar a quantidade de arranhões na parte superior esquerda (sem traços vermelhos)
    final_image_with_count = add_scratch_count_to_image(final_image, scratch_count)

    # Exibir a imagem final com a quantidade de arranhões
    cv2.imshow('Quantidade de Arranhões', final_image_with_count)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    # Salvar a imagem final com a contagem
    cv2.imwrite('imagem_com_quantidade_arranhoes.jpg', final_image_with_count)
    print(f"Imagem combinada com {scratch_count} arranhões detectados foi salva com sucesso.")

except ValueError:
    print("Por favor, insira um número inteiro válido.")
except Exception as e:
    print(f"Erro ao enviar posição para o CLP: {e}")
except KeyboardInterrupt:
    print("\nOperação cancelada pelo usuário.")
finally:
    clp_client.disconnect()
    print("Conexão com o CLP encerrada.")
