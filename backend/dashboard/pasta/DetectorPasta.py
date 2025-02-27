import cv2
import numpy as np

# Função principal
def detectar_residuos(caminho_imagem, area_minima=100):
    # 1. Carregar a imagem
    img = cv2.imread(caminho_imagem)
    img = cv2.resize(img, (1280, 720))
    if img is None:
        print("Erro: Imagem não encontrada ou caminho inválido.")
        return

    # 2. Converter para escala de cinza
    cinza = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 3. Aplicar um filtro Gaussiano para reduzir ruídos
    blur = cv2.GaussianBlur(cinza, (5, 5), 0)

    # 4. Aplicar thresholding para binarizar a imagem
    _, binary = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY_INV)
    ib = cv2.adaptiveThreshold(cinza, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 19, 5)
   
    cv2.imwrite("binary.png", ib)
    # 5. Encontrar contornos na imagem binarizada
    contornos, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # 6. Desenhar contornos na imagem original
    for contorno in contornos:
        area = cv2.contourArea(contorno)
        if area > area_minima:  # Filtra pequenos ruídos
            cv2.drawContours(img, [contorno], -1, (0, 0, 255), 2)  # Desenha contorno em vermelho

    # 7. Exibir resultados
    cv2.imshow("Stencil com Resíduos Detectados", img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# Caminho da imagem do stencil
caminho_imagem = "39-SUJO.png"  # Substitua pelo caminho da sua imagem

# Executar a função
detectar_residuos(caminho_imagem, area_minima=10)