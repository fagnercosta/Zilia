from opcua import Client, ua

clp_url = "opc.tcp://192.168.1.1:4840"  

# Cria uma instância do cliente OPC UA
clp_client = Client(clp_url)

try:
    # Conecta ao CLP
    clp_client.connect()
    print("Conectado ao CLP")

    # Referência ao nó OPC UA
    node = clp_client.get_node("ns=2;s=GVL_OPC.uiValue")

    while True:
        try:
            # Solicita o valor de pos_x ao usuário
            pos_x = int(input("Insira o valor de pos_x (ou Ctrl+C para cancelar): "))

            # Define o valor no CLP
            node.set_value(ua.DataValue(ua.Variant(pos_x, ua.VariantType.UInt16)))
            print(f"Valor {pos_x} enviado ao CLP com sucesso.")

        except ValueError:
            print("Por favor, insira um número inteiro válido.")
        except Exception as e:
            print(f"Erro ao enviar posição para o CLP: {e}")

except KeyboardInterrupt:
    print("\nOperação cancelada pelo usuário.")

finally:
    # Desconecta do CLP
    clp_client.disconnect()
    print("Conexão com o CLP encerrada.")
