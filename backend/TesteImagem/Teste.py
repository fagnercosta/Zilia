import cv2
import easyocr

# Carregar a imagem
imagem = cv2.imread("2.png")

# Converter para escala de cinza
gray = cv2.cvtColor(imagem, cv2.COLOR_BGR2GRAY)

# Aplicar Filtro Gaussiano para reduzir ruído
gray = cv2.GaussianBlur(gray, (5, 5), 0)

# Aplicar Binarização (Thresholding) para destacar os números
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 19, 5)
nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
thresh = cv2.dilate(thresh, nucleo, iterations = 4)

print(f"Size {thresh.shape}")
novo_tamanho = (thresh.shape[1] * 2, thresh.shape[0] * 2)  # OpenCV usa (largura, altura)

#thresh = cv2.resize(thresh, novo_tamanho, interpolation=cv2.INTER_NEAREST)
# Salvar a imagem processada (opcional, para debug)
cv2.imwrite("processada.png", thresh)

# Iniciar o leitor EasyOCR
reader = easyocr.Reader(["en"], gpu=True)

# Rodar OCR na imagem processada
resultado = reader.readtext(thresh, detail=0,allowlist='0123456789')

for line in resultado[0]:
    print(line)


print(resultado[0])
            

