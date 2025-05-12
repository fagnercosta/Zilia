import cv2
import numpy as np

class ImageEnhancer:
    def __init__(self):
        # Inicializa os kernels
        self.kernel_sharpen = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
        self.kernel_dilate = np.ones((3, 3), np.uint8)  # Aumentei o kernel para dilatação

    def enhance_image(self, image_path):
        """
        Processa a imagem para melhorar a legibilidade para OCR.
        
        Args:
            image_path (str): Caminho para a imagem de entrada.
            
        Returns:
            numpy.ndarray: Imagem processada, ou None se houver erro.
        """
        # Carrega a imagem
        image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

        if image is None:
            print(f"Erro: Não foi possível carregar a imagem em {image_path}. Verifique o caminho ou a integridade do arquivo.")
            return None

        # Passo 1: Aumentar o contraste usando equalização de histograma
        equalized = cv2.equalizeHist(image)

        # Passo 2: Aumentar a nitidez da imagem
        sharpened = cv2.filter2D(equalized, -1, self.kernel_sharpen)

        # Passo 3: Reduzir ruído com um leve desfoque
        denoised = cv2.GaussianBlur(sharpened, (7, 7), 0)

        # Passo 4: Aplicar limiarização adaptativa com ajustes
        thresh = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 21, 7  # Ajustei para 21, 7
        )

        # Passo 5: Aplicar dilatação para engrossar os dígitos
        dilated = cv2.dilate(thresh, self.kernel_dilate, iterations=2)  # Aumentei para 2 iterações

        return dilated

# Exemplo de uso
if __name__ == "__main__":
    enhancer = ImageEnhancer()
    image_path = 'image2.png'  # Ajuste o caminho para a nova imagem
    result = enhancer.enhance_image(image_path)
    
    if result is not None:
        cv2.imwrite('enhanced_image_v3.jpg', result)
        print("Processamento da imagem concluído. Imagem aprimorada salva como 'enhanced_image_v3.jpg'.")