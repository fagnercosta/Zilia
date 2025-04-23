import cv2
import easyocr
import numpy as np

# Carregar a imagem
imagem = cv2.imread("ponto_1_tratada.png")
if imagem is None:
    print("Erro: Não foi possível carregar a imagem.")
    exit()

# Converter para escala de cinza
gray = cv2.cvtColor(imagem, cv2.COLOR_BGR2GRAY)

# Aplicar Filtro Gaussiano leve para suavizar ruídos
gray = cv2.GaussianBlur(gray, (3, 3), 0)

# Aplicar Binarização (ajustar o limiar para destacar os dígitos escuros contra o fundo claro)
#_, thresh = cv2.threshold(gray, 30, 255, cv2.THRESH_BINARY_INV)
# Alternativa: usar adaptiveThreshold com parâmetros ajustados
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 11, 2)

# Operação morfológica para limpar pequenos ruídos
nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, nucleo, iterations=1)

# Dilatação leve para conectar segmentos quebrados
thresh = cv2.dilate(thresh, nucleo, iterations=1)

# Redimensionar a imagem para melhorar a detecção (aumentar 2x)
novo_tamanho = (thresh.shape[1] * 2, thresh.shape[0] * 2)  # OpenCV usa (largura, altura)
thresh = cv2.resize(thresh, novo_tamanho, interpolation=cv2.INTER_NEAREST)

# Salvar a imagem processada (para debug)
cv2.imwrite("processada.png", thresh)

# Iniciar o leitor EasyOCR
reader = easyocr.Reader(["en"], gpu=True)

# Rodar OCR na imagem processada (usar detail=1 para obter bounding boxes)
resultado = reader.readtext(thresh, detail=1, allowlist='0123456789', paragraph=False, text_threshold=0.6)

# Pós-processamento para corrigir confusão entre "1" e "7" e entre "0" e "8"
corrected_result = []
for (bbox, text, prob) in resultado:
    print(f"Dígito detectado: {text}, Confiança: {prob}")
    
    # Extrair a região do dígito
    (top_left, top_right, bottom_right, bottom_left) = bbox
    x_min, y_min = int(top_left[0]), int(top_left[1])
    x_max, y_max = int(bottom_right[0]), int(bottom_right[1])
    digit_region = thresh[y_min:y_max, x_min:x_max]

    # Corrigir confusão entre "1" e "7"
    if text == '7' or text == '1':
        # Verificar a presença de uma barra superior (analisar os primeiros 1/4 da altura)
        top_region = digit_region[0:int((y_max-y_min)/4), :]  # Parte superior do dígito
        white_pixels = cv2.countNonZero(top_region)
        total_pixels = top_region.shape[0] * top_region.shape[1]
        white_ratio = white_pixels / total_pixels if total_pixels > 0 else 0
        print(f"White ratio na região superior (para 1/7): {white_ratio}")

        if white_ratio < 0.3:
            print(f"Corrigindo: {text} para 1")
            text = '1'
        else:
            print(f"Confirmando: {text} como 7")
            text = '7'

    # Corrigir confusão entre "0" e "8"
    if text == '0' or text == '8':
        # Verificar a presença do segmento do meio (ajustar a região para ser mais precisa)
        middle_region = digit_region[int((y_max-y_min)/3):int(2*(y_max-y_min)/3), :]  # Região central
        white_pixels = cv2.countNonZero(middle_region)
        total_pixels = middle_region.shape[0] * middle_region.shape[1]
        middle_white_ratio = white_pixels / total_pixels if total_pixels > 0 else 0
        print("8----"+middle_white_ratio)
        print(f"Middle white ratio (para 0/8): {middle_white_ratio}")

        # Ajustar o limiar para ser mais sensível
        if middle_white_ratio < 0.1:  # Reduzir o limiar para 0.15
            print(f"Corrigindo: {text} para 0")
            text = '0'
        else:
            print(f"Corrigindo: {text} para 8")
            text = '8'

    corrected_result.append(text)

# Juntar os dígitos em uma string
final_text = ''.join(corrected_result)
print(f"Resultado final: {final_text}")