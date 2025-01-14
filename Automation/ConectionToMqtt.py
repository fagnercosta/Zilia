import socket

def send_data():
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect(('172.16.3.134', 12345))  # Substitua pelo IP da sua Raspberry Pi

    mensagem = input("Enviar (deixe em branco para apenas receber): ")
    data_to_send = "Dados para a Raspberry Pi"
    client_socket.sendall(mensagem.encode())

    response = client_socket.recv(1024)
    print(f"Resposta da Raspberry Pi: {response}")
    client_socket.close()

if __name__ == "__main__":
    send_data()
