from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from dashboard.models import (ProcessedImage)
from dashboard.serializers import (ProcessedImageSerializer)
from pynput import keyboard


import requests

from rest_framework.decorators import api_view
from rest_framework.response import Response
from pynput import keyboard

@api_view(['GET'])
def scanner(request):
    scanned_code = []

    def on_press(key):
        try:
            scanned_code.append(key.char)
        except AttributeError:
            if key == keyboard.Key.enter:
                return False  # Para o listener após a leitura do código

    with keyboard.Listener(on_press=on_press) as listener:
        listener.join()

    # Converte a lista de caracteres em uma string única
    scanned_code_str = ''.join(scanned_code)

    # Retorna a string escaneada como resposta da API
    return Response({"scanned_code": scanned_code_str})


# Check connection
@api_view(['GET'])
def check(request):
    return Response(
        {
            "message":"CONECTOU",
           
        },
        status=status.HTTP_200_OK)



# Check connection
@api_view(['GET'])
def sinc_data(request):

    resposta = requests.get("http://localhost:9000/stencils/")
    
    return Response(
        {
            "message": f"CONECTOU {resposta.status_code} ",
           
        },
        status=status.HTTP_200_OK)

