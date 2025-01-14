from pypylon import pylon  # Comunicação com a câmera
import platform  # Determinar o sistema operacional
import datetime
import time
import os  # Operações relacionadas ao sistema operacional
import pyodbc  # Para conectar e interagir com o banco de dados SQL Server
import shutil  # Movimentação de arquivos

# Configurações do banco de dados, mude conforme necessario
server = r'localhost:/1433'
database = ''
username = ''
password = ''

# Pasta de origem e destino das imagens, mude conforme necessario
source_folder = r''
destination_folder = os.path.join(source_folder, 'cimagebasler')

# Função para capturar uma foto da câmera
def tirafoto():
    img = pylon.PylonImage()
    tlf = pylon.TlFactory.GetInstance()
    cam = pylon.InstantCamera(tlf.CreateFirstDevice())
    cam.Open()
    # Abre a camera
    cam.StartGrabbing()
    time.sleep(0.5)  # Espera um momento pra garantir que o foco esta estavel
    num_img_to_save = 1
    for i in range(num_img_to_save):
        with cam.RetrieveResult(2000) as result:
            img.AttachGrabResultBuffer(result)
            if platform.system() == 'Windows': # Determina a qualidade tipo de arquivo baseado no OS, garantir compatibilidade
                ipo = pylon.ImagePersistenceOptions()
                quality = 90
                ipo.SetQuality(quality)
                filename = datetime.datetime.now().strftime("%d%m%Y%H%M%S.jpg")
                img.Save(pylon.ImageFileFormat_Jpeg, filename, ipo)
            else:
                filename = datetime.datetime.now().strftime("%d%m%Y%H%M%S.png")
                img.Save(pylon.ImageFileFormat_Png, filename)
            img.Release()
    cam.StopGrabbing()
    # Fecha conexão com a camera
    cam.Close()

# Função para enviar uma imagem para o banco de dados
def enviar_imagem_para_bd(caminho_imagem, dataehora):
    try:
        # Conecta com o banco de dados
        conn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
        cursor = conn.cursor()

        with open(caminho_imagem, 'rb') as img_file:
            img_data = img_file.read()
            # Lê o binario da imagem
        cursor.execute("INSERT INTO dbo.baslimages (datas, imagens ) VALUES (?, ?)", dataehora ,img_data)
        # Insere no banco, modificar conforme necessário
        conn.commit()
        # Finalizar modificações
        print("Imagem inserida com sucesso!")
        # Fechar conexao com o BD
        conn.close()

    # Em caso de erro
    except Exception as e:
        print("Erro ao inserir imagem:", e)

# Loop principal
while True:
    gatilho = input("Pressione 'a' para tirar uma foto, ou 'q' para sair: ")

    if gatilho == "a":  # Se o gatilho for 'a', tirar uma foto e enviar para o banco de dados
        tirafoto()
        for filename in os.listdir(source_folder):
            if filename.endswith('.jpg') or filename.endswith('.jpeg') or filename.endswith('.png'):
                source_path = os.path.join(source_folder, filename)
                destination_path = os.path.join(destination_folder, filename)

                shutil.move(source_path, destination_path)
                print(f"Imagem movida para {destination_path}")
                dataehora = datetime.datetime.now().strftime("%d%m%Y%H%M%S")
                enviar_imagem_para_bd(destination_path, dataehora)
    
    elif gatilho == "q":  # Se o gatilho for 'q', sair do programa
        break
    else:
        print("Comando inválido. Pressione 'a' para tirar uma foto ou 'q' para sair.")
        gatilho = input()
        if gatilho == "a":
            tirafoto()