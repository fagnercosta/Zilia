import cv2
import easyocr
import re

import numpy as np

class ResolveDigists:

    SEVEN_TEXT = '7'
    ONE_TEXT = '1'
    def __init__(self, image_path=None, point=0):
        self.image_path = image_path  # Pode ser None se você passar diretamente a imagem
        self.point = point

    def resolve_digits(self):
        # Inicializar o leitor EasyOCR
        reader = easyocr.Reader(['pt'], gpu=True)

       
        if self.image_path is None:
            print("Erro: Não foi possível carregar a imagem.")
            exit()

        # Pré-processamento
        gray = cv2.cvtColor(self.image_path, cv2.COLOR_BGR2GRAY)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
        nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        thresh = cv2.dilate(thresh, nucleo, iterations=4)

        # Redimensionar a imagem para melhorar a detecção (aumentar 2x)
        novo_tamanho = (thresh.shape[1] * 2, thresh.shape[0] * 2)
        thresh = cv2.resize(thresh, novo_tamanho, interpolation=cv2.INTER_NEAREST)

        # Salvar a imagem processada (para debug)
        cv2.imwrite(f'ponto_1-PROCESSADA-RESOLVE- - - 7--{self.point}.png', thresh)

        # Rodar OCR na imagem processada
        resultados = reader.readtext(thresh, detail=1, allowlist='0123456789', paragraph=False, text_threshold=0.6)

        # Imprimir os resultados brutos
        for idx, (bbox, text, prob) in enumerate(resultados):
            print(f"Processando dígito na posição {idx + 1}: {text}, Confiança: {prob}")

        # Verificar se o EasyOCR detectou uma única string com 3 dígitos
        if len(resultados) == 1 and len(resultados[0][1]) == 3:
            print("EasyOCR detectou os 3 dígitos como uma única string. Separando...")
            bbox, text, prob = resultados[0]  # Ex.: "315"
            
            # Dividir a bounding box em 3 partes (aproximadamente)
            (top_left, top_right, bottom_right, bottom_left) = bbox
            width = (top_right[0] - top_left[0]) // 3  # Dividir a largura em 3
            
            # Criar novas bounding boxes para cada dígito
            new_resultados = []
            for i in range(3):
                new_top_left = (top_left[0] + i * width, top_left[1])
                new_top_right = (top_left[0] + (i + 1) * width, top_right[1])
                new_bottom_right = (top_left[0] + (i + 1) * width, bottom_right[1])
                new_bottom_left = (top_left[0] + i * width, bottom_left[1])
                new_bbox = (new_top_left, new_top_right, new_bottom_right, new_bottom_left)
                new_resultados.append((new_bbox, text[i], prob))
            
            resultados = new_resultados
        else:
            # Se não for uma única string com 3 dígitos, ordenar e garantir 3 dígitos
            resultados = sorted(resultados, key=lambda x: x[0][0][0])
            if len(resultados) < 3:
                print(f"Aviso: Menos de 3 dígitos detectados ({len(resultados)}). Preenchendo com zeros à esquerda.")
                while len(resultados) < 3:
                    resultados.append((None, '0', 0.0))
            elif len(resultados) > 3:
                print(f"Aviso: Mais de 3 dígitos detectados ({len(resultados)}). Pegando os 3 primeiros.")
                resultados = resultados[:3]

        # Pós-processamento para corrigir confusão entre "1" e "7" para cada dígito
        corrected_result = []
        for idx, (bbox, text, prob) in enumerate(resultados):
            print(f"\nTEXTO RECEBIDO NA POSIÇÃO {idx + 1}: {text}")
            position = idx + 1  # 1º, 2º ou 3º dígito
            print(f"\nProcessando dígito na posição {position}: {text}, Confiança: {prob}")

            # Se bbox for None (caso preenchido com zero), não há região para analisar
            if bbox is None:
                print(f"Dígito na posição {position} é um zero fictício.")
                corrected_result.append(text)
                continue

            # Extrair a região do dígito
            (top_left, top_right, bottom_right, bottom_left) = bbox
            x_min, y_min = int(top_left[0]), int(top_left[1])
            x_max, y_max = int(bottom_right[0]), int(bottom_right[1])
            digit_region = thresh[y_min:y_max, x_min:x_max]

            # Corrigir confusão entre "1" e "7" para este dígito
            if text == ResolveDigists.SEVEN_TEXT or text == ResolveDigists.ONE_TEXT:
                print(f"Verificando dígito na posição {position}...")
                top_region = digit_region[0:int((y_max-y_min)/4), :]  # Parte superior do dígito
                white_pixels = cv2.countNonZero(top_region)
                total_pixels = top_region.shape[0] * top_region.shape[1]
                white_ratio = white_pixels / total_pixels if total_pixels > 0 else 0
                print(f"White ratio na região superior (posição {position}): {white_ratio}")

                if white_ratio < 0.15:
                    print(f"Corrigindo na posição {position}: {text} para 1")
                    text = '1'
                else:
                    print(f"Confirmando na posição {position}: {text} como 7")
                    text = '7'


            corrected_result.append(text)

        return corrected_result


class ExtractTextInImage:
    def __init__(self, image_path=None,point=0):
        self.image_path = image_path  # Pode ser None se você passar diretamente a imagem
        self.point = point
        
    
    def extract_text(self, image=None, image_path_original=None):
        """Extrai texto de uma imagem (pode ser um array NumPy ou um caminho de arquivo)."""
        if image is None:
            if self.image_path is None:
                raise ValueError("Nenhuma imagem ou caminho de imagem fornecido.")
            image = cv2.imread(self.image_path)
            if image is None:
                raise ValueError("Não foi possível carregar a imagem.")
            

        
       
        reader = easyocr.Reader(["pt"], gpu=True)
        resultado = reader.readtext(image, detail=0, allowlist='0123456789')
        
        for r in resultado:
            print(f"Resultados do OCR - {self.point}:{resultado}")
        if '7' in resultado or '1' in resultado:
            print("Resolvendo confusão entre 1 e 7...")
            resolve = ResolveDigists(image_path_original, self.point)
            resultado = resolve.resolve_digits()

            return resultado
        
        return resultado[0];

    def normalize_text(self, resultado):
        # Processa o resultado (igual ao seu código atual)
        text = ''.join(resultado)  # Junta os resultados do OCR
        text = re.sub('[^0-9]', '', text)
        
        resposta = ''
        for i, l in enumerate(text):
            if i <= 1:
                resposta += l
            elif i == 2:
                resposta += "." + l

        return resposta
    
    def resize_image(self, image):
        novo_tamanho = (image.shape[1] * 2, image.shape[0] * 2)  # OpenCV usa (largura, altura)
        return cv2.resize(image, novo_tamanho, interpolation=cv2.INTER_NEAREST)
    
