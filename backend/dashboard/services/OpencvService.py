import os
import cv2
import time
import numpy as np
from opcua import Client, ua
from pypylon import pylon

class OpencvService:
    def __init__(self, stencil_id):
        self.stencil_id = stencil_id
        self.image_dir = 'images'
        self.final_image_dir = 'images_final'
        self.clp_url = "opc.tcp://192.168.1.1:4840"
        self.client = Client(self.clp_url)

        self.erro = "Erro ao conectar ao CLP"

    def take_photo(self):
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

    def save_photo(self, img, pos):
        os.makedirs(self.image_dir, exist_ok=True)
        image_path = os.path.join(self.image_dir, f"foto_posicao_{pos}.png")
        if img is not None:
            cv2.imwrite(image_path, img)
            return image_path
        return None

    def combine_images(self):
        rows, cols = 8, 6
        final_width, final_height = 1280, 720
        img_width, img_height = final_width // cols, final_height // rows
        final_image = np.zeros((final_height, final_width, 3), dtype=np.uint8)

        image_files = sorted([f for f in os.listdir(self.image_dir) if f.endswith(('.png', '.jpg', '.jpeg'))])

        for i in range(rows):
            for j in range(cols):
                img_idx = i * cols + j
                if img_idx < len(image_files):
                    img = cv2.imread(os.path.join(self.image_dir, image_files[img_idx]))
                    img_resized = cv2.resize(img, (img_width, img_height))
                    y, x = i * img_height, j * img_width
                    final_image[y:y + img_height, x:x + img_width] = img_resized

        os.makedirs(self.final_image_dir, exist_ok=True)
        final_image_path = os.path.join(self.final_image_dir, f"final_image_stencil_{self.stencil_id}.png")
        cv2.imwrite(final_image_path, final_image)

        return final_image_path

    def detect_scratches(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        edges = cv2.Canny(blurred, 50, 150)

        # Detectar linhas usando Transformada de Hough
        lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=50, minLineLength=50, maxLineGap=10)
        
        scratch_count = 0
        if lines is not None:
            for line in lines:
                x1, y1, x2, y2 = line[0]
                # Desenhar as linhas dos arranhões em vermelho
                cv2.line(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
            scratch_count = len(lines)

        return image, scratch_count
    
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
            valorDaPosicao.set_value(ua.DataValue(ua.Variant(31, ua.VariantType.UInt16)))
            for posicao in range(31, 79):
                valorDaPosicao.set_value(ua.DataValue(ua.Variant(posicao, ua.VariantType.UInt16)))
                print(f"Movendo para a posição {posicao}")

                while True:
                    complete = completeValue.get_value()
                    moving = movingValue.get_value()
                    print(f"complete: {complete}, busy: {moving}")
                    time.sleep(2)

                    if complete and not moving:
                        img = self.take_photo()
                        self.save_photo(img, posicao)
                        break

                    time.sleep(1)
                time.sleep(0.5)
            
            valorDaPosicao.set_value(ua.DataValue(ua.Variant(99, ua.VariantType.UInt16)))
            final_image_path = self.combine_images()
            final_image = cv2.imread(final_image_path)
            final_image, scratch_count = self.detect_scratches(final_image)

            return final_image_path, scratch_count

        except Exception as e:
            return self.erro
        finally:
            self.client.disconnect()
            print("Conexão com o CLP encerrada.")
