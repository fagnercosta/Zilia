import serial
import time
import requests

porta = 'COM5'  # Substitua 'COM3' pela porta correta no seu sistema.
baud_rate = 115200  # Ajuste conforme necessário.
timeout = 2 # Timeout para a leitura em segundos.

try: # Tenta conectar a serial

    conexao_serial = serial.Serial(porta, baud_rate, timeout=timeout)
    print(f"Conexão estabelecida em {porta} com sucesso!")

    while True: # Caso haja algum dado na Serial, print os dados que foram recebidos
       
        

        mensagem = input("Enviar (deixe em branco para apenas receber): ")
        
        if mensagem: # Caso queira enviar algo, esse cobre o caso geral de conexão
            conexao_serial.write(mensagem.encode())  # Envia a mensagem
            print(f"Mensagem enviada! ")
        
            print(f"Aguando o fim da conexão")
        while(conexao_serial.in_waiting!=None):
             
             dados = conexao_serial.readline().decode().strip()
             print(f"Dados recebidos agora: {dados}")
             
             break

        time.sleep(2)
             

        

        

except serial.SerialException as e: # Caso de erro
    print(f"Erro ao abrir porta {porta}: {e}")
except KeyboardInterrupt: # Parar programa cntrl + c
    print("\nPrograma encerrado pelo usuário.")
finally: # Fecha conexão serial
    if 'conexao_serial' in locals() and conexao_serial.is_open:
        conexao_serial.close()
        print("Conexão Serial fechada.")