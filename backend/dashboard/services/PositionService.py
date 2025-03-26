import os
import cv2
import time
import numpy as np
from opcua import Client, ua
from pypylon import pylon

class PositionService:
    def __init__(self):
        self.clp_url = "opc.tcp://192.168.1.1:4840"
        self.client = Client(self.clp_url)

        self.erro = "Erro ao conectar ao CLP"

    
    
    def main(self):
        try:
            self.client.connect()
            print("Conectado ao CLP")
            menssagem = ""
            topLamp = self.client.get_node("ns=2;s=GVL_OPC.xTopLamp")
            bottomLamp = self.client.get_node("ns=2;s=GVL_OPC.xBottomLamp")
            topLamp.set_value(ua.DataValue(ua.Variant(True, ua.VariantType.Boolean)))
            bottomLamp.set_value(ua.DataValue(ua.Variant(True, ua.VariantType.Boolean)))

            completeValue = self.client.get_node("ns=2;s=GVL_OPC.xComplete")
            movingValue = self.client.get_node("ns=2;s=GVL_OPC.xBusy")
            valorDaPosicao = self.client.get_node("ns=2;s=GVL_OPC.uiValue")
            valorDaPosicao.set_value(ua.DataValue(ua.Variant(1, ua.VariantType.UInt16)))
            for posicao in range(1, 2):
                valorDaPosicao.set_value(ua.DataValue(ua.Variant(posicao, ua.VariantType.UInt16)))
                print(f"Movendo para a posição {posicao}")
               
                complete = completeValue.get_value()
                moving = movingValue.get_value()
                print(f"complete: {complete}, busy: {moving}")
                print(f"Movendo para a posição {posicao}")
                time.sleep(2)
                
            valorDaPosicao.set_value(ua.DataValue(ua.Variant(99, ua.VariantType.UInt16)))
                    #break

            
            menssagem = "Robo posicionado"
            return menssagem

        except Exception as e:
            return self.erro
        finally:
            self.client.disconnect()
            print("Conexão com o CLP encerrada.")
