import cv2
import numpy as np
import os
import time
import json
import re

FILE_PATH = "backend\\dashboard\\services\\data.txt"

class WiptrackSincronizeService:
    def __init__(self):
        self.arquivo = FILE_PATH

    def sincronizeData(self):
        self.sinckDataByTextFile(self.arquivo)

    def sinckDataByTextFile(self, arquivoData):
        try:
            with open(arquivoData, 'r', encoding='utf-8') as f:
                dados = f.read()

            json_match = re.search(r'\{.*\}', dados, re.DOTALL)
            
            if not json_match:
                print("Erro: Não foi possível encontrar o JSON no arquivo.")
                return

            json_str = json_match.group(0)
            json_data = json.loads(json_str)
            object_status = json.loads(json_data['ObjectStatus'])
            stencils = object_status.get('Stencil', [])

            for stencil in stencils:
                try:
                    #print(stencil,"\n")
                    self.sendDataApi(stencil)
                except Exception:
                    print()
                #self.sendDataApi(stencil)


        except FileNotFoundError:
            print(f"Erro: O arquivo {arquivoData} não foi encontrado.")
        except json.JSONDecodeError as e:
            print(f"Erro ao fazer o parsing do JSON: {e}")
        
    def sinckDataByApiRest(self, url):
        print()

    def sendDataApi(self, stencil):
        dataCreate = {
            "stencil_id": stencil['SysStencilID'],
            "site_id": stencil['SiteID'],
            "stencil_part_nbr": stencil['StencilPartNbr'],
            "vendor_part_nbr": stencil['VendorPartNbr'],
            "vendor": stencil['Vendor'],
            "mfg_date": stencil['MfgDate'],
            "product_type": stencil['ProductType'],
            "thickness": stencil['Thickness'],
            "pcb_up_nbr": stencil['PcbUpNbr'],
            "location": stencil['Location'],
            "status": stencil['Status'],
            "life_limit": stencil['LifeLimit'],
            "counter": stencil['Counter'],
            "trigger_err_limit": stencil['TriggerErrLimit'],
            "reg_date_time": stencil['RegDateTime'],
            "reg_user_id": stencil['Side'],
            "notes": stencil['Notes'],
            "update_user_id": "",
            "datetime": stencil['Datetime'],
            "revision": stencil['Revision'],
            "side": stencil['Side'],
            "label_info": stencil['LabelInfo'],
            "is_active_in_use": stencil['IsActiveInUse'],
            "stencil_destination": "",
            "p1_value": stencil['P1Value'],
            "p2_value": stencil['P2Value'],
            "p3_value": stencil['P3Value'],
            "p4_value": stencil['P4Value'],
            "is_blocked_stencil": stencil['IsBlockedStencil'],
            "index_of_suggested_stencil": stencil['IndexOfSuggestedStencil']
        }

        print("CREATE DATA\n")
        print(dataCreate)

    def main(self):
        self.sincronizeData()

wiptrackObjetc = WiptrackSincronizeService()
wiptrackObjetc.main()
