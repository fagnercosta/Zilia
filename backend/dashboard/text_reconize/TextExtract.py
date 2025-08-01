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
        thresh = cv2.dilate(thresh, nucleo, iterations=7)

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

            # Corrigir confusão entre "0" e "8" para este dígito
            if text == '0' or text == '8':
                print(f"Verificando dígito na posição {position}...")
                # Focar exatamente no segmento do meio
                middle_height = int((y_max - y_min) / 3)
                middle_region = digit_region[int(y_min + middle_height):int(y_min + 2 * middle_height), :]
                white_pixels = cv2.countNonZero(middle_region)
                total_pixels = middle_region.shape[0] * middle_region.shape[1]
                middle_white_ratio = white_pixels / total_pixels if total_pixels > 0 else 0
                print(f"Middle white ratio (para 0/8, posição {position}): {middle_white_ratio}")

                # Ajustar o limiar com base na imagem (usando a lógica ajustada por você)
                if middle_white_ratio > 0.15:
                    print(f"Corrigindo na posição {position}: {text} para 0")
                    text = '0'
                else:
                    print(f"Corrigindo na posição {position}: {text} para 8")
                    text = '8'

                # Salvar a região para depuração (opcional)
                cv2.imwrite(f'middle_region_pos_{position}.png', middle_region)

            corrected_result.append(text)


            corrected_result.append(text)

        return corrected_result


class ExtractTextInImage:
    def __init__(self, image_path=None,point=0):
        self.image_path = image_path  # Pode ser None se você passar diretamente a imagem
        self.point = point
        
    
    def extract_text(self, image=None, image_path_original=None, image_binaria=None):
        """Extrai texto de uma imagem (pode ser um array NumPy ou um caminho de arquivo)."""
        if image is None:
            if self.image_path is None:
                raise ValueError("Nenhuma imagem ou caminho de imagem fornecido.")
            image = cv2.imread(self.image_path)
            if image is None:
                raise ValueError("Não foi possível carregar a imagem.")
            
        
        self.limparImagem(image, point=self.point)
       
        reader = easyocr.Reader(["pt"], gpu=True)

        

        
        if self.point == 1 or self.point==2 or self.point==3 or self.point==4:
            print("Trabalhando na imagem nova-----------------------------")
            #resultados = reader.readtext(image=f"images_final/resultado-{self.point}.png", detail=1, allowlist='0123456789.', paragraph=False, text_threshold=0.5)
            #ESSE resultados = reader.readtext(image=f"images_final/resultado-{self.point}.png", detail=1, allowlist='0123456789',paragraph=False, text_threshold=0.6)
            resultados = reader.readtext(
                image=f"images_final/resultado-{self.point}.png", 
                detail=1, 
                allowlist='0123456789.', 
                paragraph=False, 
                text_threshold=0.5, 
                contrast_ths=0.1, 
                adjust_contrast=0.5
            )
        else:
            print("Trabalhando na imagem original-----------------------------")
            resultados = reader.readtext(image=image, detail=1, allowlist='0123456789',paragraph=False, text_threshold=0.6)


        resultadoEncontrados = []
       
       
        '''print(f"textos encontrados")
        for resultado in resultados:
            resultadoEncontrados.append(resultado[1])
            print(f'RESULTADO >>>>>>> {resultado[1]} - {resultado[0]} \n')'''
        
        print(f"textos encontrados")
        print(f"textos encontrados")
        resultadoEncontrados = []  # Inicializar a lista
        for resultado in resultados:
            coordenadas, texto, confianca = resultado
            
            # Calcular o ratio para o bounding box específico do texto detectado
            largura = abs(coordenadas[1][0] - coordenadas[0][0])  # Diferença entre x inicial e final
            altura = abs(coordenadas[2][1] - coordenadas[0][1])  # Diferença entre y superior e inferior
            ratio = largura / altura if altura != 0 else 0

            # Verificar cada caractere do texto e corrigir apenas "1" para "7" se necessário
            texto_corrigido = ""
            for char in texto:
                if char == "1":  # Verificar "1" vs "7"
                    if ratio > 0.5:  # "7" é mais largo
                        texto_corrigido += "7"
                    else:
                        texto_corrigido += "1"
                else:
                    texto_corrigido += char

            # Adicionar o texto corrigido à lista e imprimir
            resultadoEncontrados.append(texto_corrigido)
            print(f'RESULTADO >>>>>>> {texto_corrigido} - {coordenadas} - Ratio: {ratio:.2f} \n')
        
        

        print(f"textos encontrados apos for {resultadoEncontrados}")
        
        
       
            
       
            
        
        print(f"Resultados do OCR APOS LEIURA - {self.point}:{resultadoEncontrados}")
        
        if len(resultadoEncontrados) >1 and ('37' in resultadoEncontrados[0]):
            return resultadoEncontrados[1]
        return resultadoEncontrados;

    def limparImagem(self, image, point=0):
        image_path = image
        print(f"Tentando carregar a imagem: {image_path}")

        # Carregar a imagem binarizada
        image = cv2.imread(image_path) 
        # Inicializar o EasyOCR (use 'en' para inglês, que inclui números)
        reader = easyocr.Reader(['en'], gpu=False)  # Desative o GPU se não
        # Converter para escala de cinza, caso ainda tenha canais de cor
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Usar EasyOCR para detectar números na imagem binarizada
        results = reader.readtext(gray, allowlist='0123456789')  # Restringir a detecção para números

        # Criar uma máscara preta do mesmo tamanho da imagem
        mask = np.zeros_like(image)

        # Desenhar as regiões dos números detectados na máscara
        for (bbox, text, _) in results:
            if text.isdigit():  # Verifica se o texto detectado é um número
                # Obter as coordenadas da caixa delimitadora
                (top_left, top_right, bottom_right, bottom_left) = bbox
                top_left = (int(top_left[0]), int(top_left[1]))
                bottom_right = (int(bottom_right[0]), int(bottom_right[1]))

                # Copiar a região do número da imagem original para a máscara
                mask[top_left[1]:bottom_right[1], top_left[0]:bottom_right[0]] = image[top_left[1]:bottom_right[1], top_left[0]:bottom_right[0]]

        nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        mask = cv2.erode(mask, nucleo, iterations=5)
        mask = cv2.dilate(mask, nucleo, iterations=8)
        mask = cv2.erode(mask, nucleo, iterations=9)
        mask = cv2.dilate(mask, nucleo, iterations=10)
        # Salvar o resultado
        cv2.imwrite(f"images_final/resultado-{point}.png", mask)
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
    
