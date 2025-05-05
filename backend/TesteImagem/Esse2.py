import cv2
import easyocr
import numpy as np

# Inicializar o leitor EasyOCR
reader = easyocr.Reader(['pt'], gpu=True)

# Carregar a imagem
image = cv2.imread('ponto_1_tratada.png')
if image is None:
    print("Erro: Não foi possível carregar a imagem.")
    exit()

# Pré-processamento
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
thresh = cv2.dilate(thresh, nucleo, iterations=6)

# Redimensionar a imagem para melhorar a detecção (aumentar 2x)
novo_tamanho = (thresh.shape[1] * 2, thresh.shape[0] * 2)
thresh = cv2.resize(thresh, novo_tamanho, interpolation=cv2.INTER_NEAREST)

# Salvar a imagem processada (para debug)
cv2.imwrite('ponto_1-PROCESSADA.png', thresh)

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
    if text == '7' or text == '1':
        print(f"Verificando dígito na posição {position}...")
        top_region = digit_region[0:int((y_max-y_min)/4), :]  # Parte superior do dígito
        white_pixels = cv2.countNonZero(top_region)
        total_pixels = top_region.shape[0] * top_region.shape[1]
        white_ratio = white_pixels / total_pixels if total_pixels > 0 else 0
        print(f"White ratio na região superior (posição {position}): {white_ratio}")

        if white_ratio < 0.1:
            print(f"Corrigindo na posição {position}: {text} para 1")
            text = '1'
        else:
            print(f"Confirmando na posição {position}: {text} como 7")
            text = '7'

    corrected_result.append(text)

# Juntar os dígitos em uma string
final_text = ''.join(corrected_result)
print(f"\nResultado final: {final_text}")

# Verificar se o resultado final tem exatamente 3 dígitos
if len(final_text) != 3:
    raise ValueError(f"Erro: O resultado final não contém exatamente 3 dígitos: {final_text}")