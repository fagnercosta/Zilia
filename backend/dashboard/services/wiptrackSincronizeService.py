import cv2
import numpy as np
import os
import time
import json
import re

import time

import os
from django.conf import settings
import requests
import datetime

from dashboard.serializers import StencilSerializer

from dashboard.models import Stencil


FILE_PATH = os.path.join("/",settings.BASE_DIR,"dashboard", "services", "data-prod.txt")
URL_API_LOCAL = url = "http://localhost:8000/api/stencil/"


## 

#host = "http://brzwiptrackws-qa.smartm.internal"

URL_WIPTRACK = "http://brzwiptrackws-qa.smartm.internal/WebServices/WTStencilAdd.asmx?op=AddStencil"

action = "05"
siteId = 9
stencilParNumber = "TESTBYPETER"
vendorPartNumber = "TEST"
vendor="TEST"

payload = f"<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n    <soap:Body>\r\n        <AddStencil xmlns=\"ZiliaStencil\">\r\n   <action>{action}</action>\r\n    <stencil>\r\n   <SiteID>{siteId}</SiteID>\r\n                <StencilPartNbr>{stencilParNumber}</StencilPartNbr>\r\n                <VendorPartNbr>{vendorPartNumber}</VendorPartNbr>\r\n                <Vendor>{vendor}</Vendor>\r\n      </stencil>\r\n    </AddStencil>\r\n  </soap:Body>\r\n</soap:Envelope>"
headers = {
  'Content-Type': 'text/xml'
}




class WiptrackSincronizeService:
    def __init__(self):
        self.arquivo = FILE_PATH
        self.url = URL_WIPTRACK
        self.contador = 0

    def sincronizeData(self):
        print("AQUI START WIPTRACK")
        #self.download(self.url)
        self.sinckDataByTextFile(self.arquivo)
        #self.sinckDataByApiRest(self.url)

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
                    self.sendDataApiTEST(stencil)
                    
                except Exception:
                    teste = ""
                    # print("ERRO:")
                #self.sendDataApi(stencil)

        except FileNotFoundError:
            print(f"Erro: O arquivo {arquivoData} não foi encontrado.")
        except json.JSONDecodeError as e:
            print(f"Erro ao fazer o parsing do JSON: {e}")
            
    def download(self, url):
        
         
        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.text)
            
        try:
                with open(FILE_PATH, 'w',encoding='utf-8') as arquivo:
                    # Escrever o conteúdo da resposta no arquivo
                    arquivo.write(response.text)
                print('Arquivo salvo com sucesso!')
        except Exception as e:
                print(f'Erro ao salvar o arquivo: {e}')
        
    def sinckDataByApiRest(self, url):
        response = requests.request("POST", url, headers=headers, data=payload)
        #print(f"RESPOSTA {response.text}")
        json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
            
        #print(f"RESPOSTA JSON {json_match}")
            
        if not json_match:
            print("Erro: Não foi possível encontrar o JSON no arquivo.")
            return

        json_str = json_match.group(0)
        json_data = json.loads(json_str)
        object_status = json.loads(json_data['ObjectStatus'])
        stencils = object_status.get('Stencil', [])

        for stencil in stencils:
            try:        
                self.sendDataApiTEST(self, stencil)              
            except Exception:
                teste = ""
                print("ERRO:")
                #self.sendDataApi(stencil)
       




    def sendDataApi(self, stencil):

        try:
           
            headers = {
                "Content-Type": "application/json",  # Se você estiver enviando dados em formato JSON
            }

            
            try:
                
                response = requests.post(URL_API_LOCAL, json=json.loads(stencil), headers=headers)
                response.raise_for_status() 
                self.contador = self.contador + 1 # Levanta um erro para códigos de status 4xx ou 5xx
                print('Response status code:', response.status_code)
                print('Response text:', response.text)
            except requests.exceptions.RequestException as e:
                print(f"Erro na requisição: {e.response}")
                        
                                    
                                    
        except Exception as erro:
            print(erro)
            
        

    def imprimirJson(self, data):
        print(f"DATA = {data}")
    def sendDataApiTEST(self, stencil):
        
        
        site_id = stencil['SiteID'] or ""
        stencil_part_nbr = stencil['StencilPartNbr'] or ""
        vendor_part_nbr = stencil['VendorPartNbr'] or ""
        vendor_local = stencil['Vendor'] or ""


        # PAY LOAD
        payload_local = f"<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n    <soap:Body>\r\n        <AddStencil xmlns=\"ZiliaStencil\">\r\n   <action>{4}</action>\r\n    <stencil>\r\n   <SiteID>{site_id}</SiteID>\r\n                <StencilPartNbr>{stencil_part_nbr}</StencilPartNbr>\r\n                <VendorPartNbr>{vendor_part_nbr}</VendorPartNbr>\r\n                <Vendor>{vendor}</Vendor>\r\n      </stencil>\r\n    </AddStencil>\r\n  </soap:Body>\r\n</soap:Envelope>"
        
        
        payload3 = f"<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n    <soap:Body>\r\n        <AddStencil xmlns=\"ZiliaStencil\">\r\n   <action>{4}</action>\r\n    <stencil>\r\n   <SiteID>{siteId}</SiteID>\r\n                <StencilPartNbr>{stencil_part_nbr}</StencilPartNbr>\r\n                <VendorPartNbr>{vendor_part_nbr}</VendorPartNbr>\r\n                <Vendor>{vendor_local}</Vendor>\r\n      </stencil>\r\n    </AddStencil>\r\n  </soap:Body>\r\n</soap:Envelope>"

        

        headers = {
          'Content-Type': 'text/xml'
        }

       
        
        
        try:
            
            if (site_id !="" and stencil_part_nbr!="" and vendor_part_nbr!="" and vendor_local!=""):
                response = requests.request("POST", URL_WIPTRACK, headers=headers, data=payload3,timeout=30)
            

                response_json = re.search(r'\[.*\]', f'\{response.text}', re.DOTALL)
                response_json = re.search(r'\{.*\}', f'\{response.text}', re.DOTALL)
                json_str = response_json.group(0)
                 
                
                data = json.loads(json_str)
                object_status = data.get("ObjectStatus")
                data = json.loads(object_status)
                # Acessando o primeiro Stencil
                first_stencil = data["Stencil"][0]  

                
                
                #print(f"OBJETO STATUS = {data}")
                

                original_data = json.loads(json_str)
                original_data["ObjectStatus"] = json.loads(original_data["ObjectStatus"])
                
                if object_status:
                    #print("Object Status:", first_stencil)
                    # Acessando propriedades específicas do primeiro Stencil
                    stencil_id = first_stencil["SysStencilID"]
                    stencil_site_id = first_stencil["SiteID"]
                    stencil_part_nbr = first_stencil["StencilPartNbr"]
                    stencil_vendor_part_number = first_stencil["VendorPartNbr"]
                    stencil_vendor= first_stencil["Vendor"]
                    stencil_mgfDate = first_stencil["MfgDate"]
                    stencil_status = first_stencil["Status"]
                    stencil_productType = first_stencil["ProductType"]
                    stencil_thickness = first_stencil["Thickness"]
                    stencil_pcbUpNbr = first_stencil["PcbUpNbr"]
                    stencil_location = first_stencil["PcbUpNbr"]
                    stencil_LifeLimit =first_stencil["LifeLimit"]
                    stencil_counter = first_stencil["Counter"]
                    stencil_triggerErrLimit = first_stencil["TriggerErrLimit"]
                    stencil_RegDateTime = first_stencil["RegDateTime"]
                    stencil_RegUserID = first_stencil["RegUserID"]
                    stencil_notes = first_stencil["Notes"]
                    stencil_UpdateUserID = first_stencil["UpdateUserID"]
                    stencil_Datetime = first_stencil["Datetime"]
                    stencil_revision = first_stencil["Revision"]
                    stencil_side = first_stencil["Side"]
                    stencil_label_info = first_stencil["LabelInfo"]
                    stencil_ativo = first_stencil["IsActiveInUse"]
                    stencil_bloqueado = False
                    stencil_index_sugestion = None
                    
                    
                    
                    #print(f"Data = {stencil_ativo}")

            
                    
                    # Criando o novo formato com os dados mapeados
                    new_data = {
                        "stencil_id": stencil_id,
                        "site_id": stencil_site_id,
                        "stencil_part_nbr": stencil_part_nbr,
                        "vendor_part_nbr": stencil_vendor_part_number,
                        "vendor": stencil_vendor,
                        "mfg_date": stencil_mgfDate or None,
                        "product_type": stencil_productType or "",
                        "thickness": stencil_thickness or 0,
                        "pcb_up_nbr": stencil_pcbUpNbr,
                        "location": stencil_location or "",
                        "status": stencil_status or "",
                        "life_limit": stencil_LifeLimit,
                        "counter": stencil_counter,
                        "trigger_err_limit": stencil_triggerErrLimit,
                        "reg_date_time":  stencil_RegDateTime,
                        "reg_user_id": stencil_RegUserID or "",
                        "notes": stencil_notes or "",
                        "update_user_id": stencil_UpdateUserID or "",
                        "datetime":  stencil_Datetime or None,
                        "revision": stencil_revision or "",
                        "side": stencil_side or "",
                        "label_info": stencil_label_info or "",
                        "is_active_in_use": stencil_ativo,
                        "stencil_destination": "" or "",
                        "p1_value":  0 ,
                        "p2_value":  0,
                        "p3_value":  0,
                        "p4_value":  0,
                        "is_blocked_stencil": stencil_bloqueado or False,
                        "index_of_suggested_stencil": stencil_index_sugestion or 0,
                        "object_status": ""
                    } 
                    
                else:
                    print("Object Status not found.")

            
                
                dataStencil =json.dumps(new_data, indent=4)

                stencil_found = Stencil.objects.filter(stencil_id=stencil_id).exists()

                status = new_data.get("status")
               
                
                 
                if stencil_ativo and not stencil_found  and status != 'SCRAP':
                    self.sendDataApi(dataStencil)

                time.sleep(3)
        except Exception as e:            
                    print(f"Registro com erro...", e)
                    
        

    # Função para converter datas no formato "/Date(...)"
    def parse_net_date(self,date_str):
        if date_str.startswith('/Date('):
            timestamp = int(date_str[6:-2])
            return datetime.utcfromtimestamp(timestamp / 1000).strftime('%Y-%m-%d %H:%M:%S')
        return None
    # Função para transformar o JSON no formato desejado
    def transform_json(self,data):
        return {
            
            "site_id": data.get("SiteID", ""),
            "stencil_part_nbr": data.get("StencilPartNbr", ""),
            "vendor_part_nbr": data.get("VendorPartNbr", ""),
            "vendor": data.get("Vendor", ""),
            "mfg_date": data.get("MfgDate"),
            "product_type": data.get("ProductType", ""),
            "thickness": data.get("Thickness", ""),
            "pcb_up_nbr": data.get("PcbUpNbr"),
            "location": data.get("Location", ""),
            "status": data.get("Status", ""),
            "life_limit": data.get("LifeLimit"),
            "counter": data.get("Counter"),
            "trigger_err_limit": data.get("TriggerErrLimit"),
            "reg_date_time": data.get("RegDateTime"),
            "reg_user_id": data.get("RegUserID", ""),
            "notes": data.get("Notes", ""),
            "update_user_id": data.get("UpdateUserID", ""),
            "datetime": data.get("Datetime"),
            "revision": data.get("Revision", ""),
            "side": data.get("Side", ""),
            "label_info": data.get("LabelInfo", ""),
            "is_active_in_use": data.get("IsActiveInUse", False),
            "stencil_destination": data.get("StencilDestination", ""),
            "p1_value": data.get("P1Value"),
            "p2_value": data.get("P2Value"),
            "p3_value": data.get("P3Value"),
            "p4_value": data.get("P4Value"),
            "is_blocked_stencil": data.get("IsBlockedStencil", False),
            "index_of_suggested_stencil": data.get("IndexOfSuggestedStencil"),
            "object_status": data.get("ObjectStatus", "")
        } 
    
    
        
    def main(self):
        print("AQUI")
        try:
            self.sincronizeData()
            return self.contador
        except Exception as e:
            print(e)
            return 0

        

#wiptrackObjetc = WiptrackSincronizeService()
#wiptrackObjetc.main()
