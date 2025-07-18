import logging
from dashboard.services import wiptrackSincronizeService
from dashboard.models import (
     
    Stencil,  
    StencilTensionValues,
    StencilType,
    ProcessedImage,ParameterTension
    
)

import json
from datetime import datetime
import os
from django.conf import settings

from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny

from datetime import datetime

from rest_framework import generics
from dashboard.models import CustomUser  # Importe seu modelo de usuário
from .serializers import CustomUserSerializer  # Importe o serializer


# views.py
import logging

# Obtém o logger para este arquivo
logger = logging.getLogger(__name__)
from rest_framework import generics
from .serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from dashboard.serializers import (
    
    GroupSerializer,
    StencilSerializer,
    StencilTensionValuesSerializer,
    StencilTypeSerializer,
    UserSerializer,
    ProcessedImageSerializer,
    ConfigurationsSerializer,
    LoginSerializer, ParameterTensionSerializer, Configurations
)
from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from dashboard.services.OpencvService import OpencvService
from dashboard.services.ReaderPointersService import ReaderPointerService
from dashboard.services.TensionService import TensionService
from dashboard.services.PositionService  import PositionService

from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from opcua import Client, ua
from dashboard.services.ReaderPointersService import ReaderPointerService

######################################################################
# INTEGRAÇÃO COM WIPTRACK
# Por Fagner Costa

logger = logging.getLogger(__name__)

@api_view(['GET'])
def findOneStencil(request):
    return Response({
        "message":"Rota de Busca"
    })


@api_view(['POST'])
def updateStencil(request):
    return Response({

    })


@api_view(['GET'])
def sincronizedStencilData(request):
   try:
        sincronized_comand  = wiptrackSincronizeService.WiptrackSincronizeService();
        contador =sincronized_comand.main()

        if(contador == 0):
                return Response({
                    "erro":"Erro ao sincrozinar",
                    "contador":contador
            },status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            
            return Response({
                    "message":"Processo Realizado",
                    "contador":contador
            },status=status.HTTP_200_OK)    
   except Exception as e:
        return Response({
                    "erro":"Erro ao sincrozinar",
                    "contador":contador
            },status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       



@api_view(['GET'])
def pointsResult(request):
    result = ReaderPointerService.point3()

    return Response({
        "number": result
    }, status=status.HTTP_200_OK)





######################################################################
#FIM DA INTEGRAÇÃO


@api_view(['GET'])
def changeLamp(request, status):
    clp_url = "opc.tcp://192.168.1.1:4840"  
    clp_client = Client(clp_url)
    clp_client.connect()
    print("Conectado ao CLP")

    try:
        value = status.lower() == "true"
        node = clp_client.get_node(f"ns=2;s=GVL_OPC.xTopLamp")
        node.set_value(ua.DataValue(ua.Variant(value, ua.VariantType.Boolean)))
        node2 = clp_client.get_node(f"ns=2;s=GVL_OPC.xBottomLamp")
        node2.set_value(ua.DataValue(ua.Variant(value, ua.VariantType.Boolean)))

        nodeResponse = node.get_value()
        nodeResponse2 = node2.get_value()
        print(nodeResponse)
        print(nodeResponse2)

        if nodeResponse == True and nodeResponse2 == True:
            return Response({
                "valueOfLamps": True
            })
        else:
            return Response({
                "valueOfLamps": False
            })
    except Exception as e:
        print(f"Erro ao enviar posição para o CLP: {e}")

    finally:
        clp_client.disconnect()
        print("Conexão com o CLP encerrada.")    



class ProcessedImageViewSet(viewsets.ModelViewSet):
    queryset = ProcessedImage.objects.all().order_by('-timestamp')
    serializer_class = ProcessedImageSerializer

    def get_queryset(self):
        queryset = ProcessedImage.objects.all()
        id = self.request.query_params.get('stencil_id', None)
        if id:
            queryset = queryset.filter(stencil_id=id)
            if not queryset.exists():
                raise Http404("Nenhum stencil encontrado com essa identificação.")
        return queryset

class ProcessedLastImageViewSet(viewsets.ModelViewSet):
    queryset = ProcessedImage.objects.all().order_by('-timestamp')
    serializer_class = ProcessedImageSerializer

    def get_queryset(self):
        stencil_id = self.request.query_params.get('stencil_id', None)
        
        if stencil_id:
            # Filtra pelo stencil_id e pega apenas o registro mais recente
            latest_image = ProcessedImage.objects.filter(
                stencil_id=stencil_id
            ).order_by('-timestamp').first()  # Pega o mais recente
            
            if not latest_image:
                raise Http404("Nenhuma imagem encontrada para este stencil.")
            
            return [latest_image]  # Retorna dentro de uma lista
            
        # Se não houver stencil_id, retorna todos ordenados do mais recente
        return ProcessedImage.objects.all().order_by('-timestamp')
    
class ProcessedImagesByStencilViewSet(viewsets.ModelViewSet):
    queryset = ProcessedImage.objects.all().order_by('-timestamp')
    serializer_class = ProcessedImageSerializer

    def get_queryset(self):
        stencil_id = self.request.query_params.get('stencil_id', None)
        
        if stencil_id:
            # Filtra todas as imagens pelo stencil_id, ordenadas do mais recente para o mais antigo
            images = ProcessedImage.objects.filter(
                stencil_id=stencil_id
            ).order_by('-timestamp')
            
            if not images.exists():
                raise Http404("Nenhuma imagem encontrada para este stencil.")
            
            return images
            
        # Se não houver stencil_id, retorna todos ordenados do mais recente
        return ProcessedImage.objects.all().order_by('-timestamp')

@api_view(['GET'])
def test_services_points(request):
    resposta = ReaderPointerService.point3
    print(resposta)

    return Response(
        {
            "message": "funcionou"
        },
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
def takephoto(request, stencil_id_request):
    stencil_id = stencil_id_request
    
    # Verifica se o stencil_id foi fornecido
    if not stencil_id:
        return Response(
            {"error": "stencil_id is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Tenta buscar o stencil pelo ID fornecido
    try:
        stencil = Stencil.objects.get(stencil_id=stencil_id)
    except Stencil.DoesNotExist:
        print(f"OLHA AQUIIIII {stencil_id}")
        return Response(
            {"error": "Stencil not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Inicializa o serviço OpenCV e realiza o processo de tirar as fotos e combinar

    
    try:
        opencv_command = OpencvService(stencil_id=stencil_id)
        final_image_path, scratch_count = opencv_command.main()



        # Salva os dados no banco de dados
        processed_image = ProcessedImage.objects.create(
            stencil=stencil,
            image_path=final_image_path,
            scratch_count=scratch_count
        )
        
        utc_manaus_4 = timezone.get_fixed_timezone(-240)
        processed_image.timestamp.astimezone(utc_manaus_4)

        # Serializa os dados e retorna a resposta
        serializer = ProcessedImageSerializer(processed_image)
        return Response(
            {
                "message": "Imagem processada com sucesso",
                **serializer.data
            },
            status=status.HTTP_200_OK
        )
    except Exception as e:
        print(f"Erro ao executar o serviço: {e}")
        return Response(
            {"error": "Error executing service"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR    
        )
    # Salva os dados no banco de dados

@api_view(['POST'])
def takephotoraspy(request, stencil_id_request):
    stencil_id = stencil_id_request
    
    # Verifica se o stencil_id foi fornecido
    if not stencil_id:
        return Response(
            {"error": "stencil_id is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Tenta buscar o stencil pelo ID fornecido
    try:
        stencil = Stencil.objects.get(stencil_id=stencil_id)
    except Stencil.DoesNotExist:
        
        return Response(
            {"error": "Stencil not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Inicializa o serviço OpenCV e realiza o processo de tirar as fotos e combinar

    #CHAMA A FUNÇÃO DO TENCIONService
    opencv_command = TensionService(stencil_id=stencil_id)
    final_image_path_p1, final_image_path_p2, final_image_path_p3, final_image_path_p4, textoP1, textoP2, textoP3,textoP4 = opencv_command.main()



    # Salva os dados no banco de dados
     # Salva os dados no banco de dados
    


    # Serializa os dados e retorna a resposta
    
    return Response(
        {
            "message": "Imagem processada com sucesso",
            "p1":final_image_path_p1,
            "p2":final_image_path_p2,
            "p3":final_image_path_p3,
            "p4":final_image_path_p4,
            "textoP1":textoP1,
            "textoP2":textoP2,
            "textoP3":textoP3,
            "textoP4":textoP4,
            
        },
        status=status.HTTP_200_OK
    )
    
@api_view(['GET'])
def positionRoboPoint(request):
    #CHAMA A FUNÇÃO DO TENCIONService
    opencv_command = PositionService()
    menssagem = opencv_command.main()
    menssagem = "Robo posicionado"


    # Serializa os dados e retorna a resposta
    
    return Response(
        {
            "menssage": menssagem, 
            
        },
        status=status.HTTP_200_OK
    )

@api_view(['GET','POST','PUT','DELETE'])
def configurations_manager(request):
    if request.method == 'GET':
        try:
            data = Configurations.objects.all()

        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = ConfigurationsSerializer(data, many=True)
        return Response(serializer.data)

    if request.method == 'POST':

        new_data = request.data
        
        serializer = ConfigurationsSerializer(data=new_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'PUT':

        try:
            date_finded = Configurations.objects.get(pk=request.data['id'])
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ConfigurationsSerializer(date_finded, data=request.data)

        if serializer.is_valid():
            serializer.save()    
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        try:
            date_to_delete = Configurations.objects.get(pk=request.data['id'])
            date_to_delete.delete()
            return Response(status=status.HTTP_202_ACCEPTED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

# class ConfigurationsViewSet(viewsets.ModelViewSet):
    
#     queryset = Configurations.objects.latest('date_to_review')
#     serializer_class = ConfigurationsSerializer



class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    """permission_classes = [permissions.IsAuthenticated]"""


class StencilViewSet(viewsets.ModelViewSet):
    queryset = Stencil.objects.all()
    serializer_class = StencilSerializer
    """permission_classes = [permissions.IsAuthenticated]"""
    
    def get_queryset(self):
        print("Aqui buscando...")
        queryset = Stencil.objects.all()
        part_nbr= self.request.query_params.get('stencil_id', None)
        if part_nbr:
            queryset = queryset.filter(stencil_part_nbr=part_nbr)
            if not queryset.exists():
                raise Http404("Nenhum stencil encontrado com essa identificação.")
        return queryset


class StencilTypeViewSet(viewsets.ModelViewSet):
    queryset = StencilType.objects.all()
    serializer_class = StencilTypeSerializer
    # permission_classes = [permissions.IsAuthenticated]


class StencilTensionLastValuesViewSet(viewsets.ModelViewSet):
    queryset = StencilTensionValues.objects.all()
    serializer_class = StencilTensionValuesSerializer


        
    

    def get_queryset(self):
        id = self.request.query_params.get('stencil_identification', None)
        
        if id:
            # Pega o registro mais recente (ordenado por -measurement_datetime) e coloca em uma lista
            latest_record = StencilTensionValues.objects.filter(
                stencil_id_id=id
            ).order_by('-measurement_datetime').first()
            
            if latest_record:
                return [latest_record]  # Retorna dentro de uma lista para não quebrar o front
            return StencilTensionValues.objects.none()  # Retorna queryset vazio se não existir
        
        # Se não houver filtro, retorna todos ordenados do mais recente para o mais antigo
        return StencilTensionValues.objects.all().order_by('-created_at')

class StencilTensionValuesViewSet(viewsets.ModelViewSet):
    queryset = StencilTensionValues.objects.all()
    serializer_class = StencilTensionValuesSerializer
    # permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = StencilTensionValues.objects.all()
        id = self.request.query_params.get('stencil_identification', None)
        if id:
            queryset = queryset.filter(stencil_id_id=id)
            
        return queryset

    def create(self, request, *args, **kwargs):
        # Instancia o serializer com os dados da requisição
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        
        logger.info("Dados recebidos no POST: %s", self.request.data)

        # Pega os valores que você precisa
        # Pega os valores que você precisa CORRETAMENTE (acessando como dicionário)
        tension_data = {
            'p1': request.data['p1'],  # Acesso correto com colchetes
            'p2': request.data['p2'],
            'p3': request.data['p3'],
            'p4': request.data['p4'],
            'stencil_id': request.data.get('stencil_id')  # Usando .get() para segurança
        }

        self.sendApiZilia(tension_data)
    
        
        # Adicione aqui a lógica de criação customizada, se necessário
        self.perform_create(serializer)
        
        # Retorna uma resposta de sucesso
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    

     

   
    

    def sendApiZilia(self, pontos):
        try:
            # Acesso seguro aos valores com tratamento de erros
            p1 = pontos.get('p1')
            p2 = pontos.get('p2')
            p3 = pontos.get('p3')
            p4 = pontos.get('p4')
            
            print(f"Valores recebidos - P1: {p1}, P2: {p2}, P3: {p3}, P4: {p4}")
            
            # Logging correto (os valores devem ser passados como argumentos)
            logger.warning("P1: %s", p1)
            logger.warning("P2: %s", p2)
            
            # Aqui você pode adicionar a lógica para enviar para sua API
            
        except KeyError as e:
            logger.error(f"Chave não encontrada nos dados: {e}")
        except Exception as e:
            logger.error(f"Erro inesperado: {e}")


    
    def perform_create(self, serializer):
        stencil_tension_value = serializer.save()
        if stencil_tension_value.stencil_id:
            try:
                stencil = Stencil.objects.get(stencil_id=stencil_tension_value.stencil_id.stencil_id)
                stencil.p1_value = stencil_tension_value.p1
                stencil.p2_value = stencil_tension_value.p2
                stencil.p3_value = stencil_tension_value.p3
                stencil.p4_value = stencil_tension_value.p4
                stencil.save()
            except Stencil.DoesNotExist:
                pass  

class LatestStencilTensionView(APIView):
    def get(self, request, stencil_id):
        try:
            # Busca o registro mais recente para o stencil_id fornecido
            latest_tension = StencilTensionValues.objects.filter(
                stencil_id=stencil_id,
                
            ).latest('measurement_datetime')
            
            data = {
                'id': latest_tension.id,              
                'cicles': latest_tension.cicles,
                'stencil_id': latest_tension.stencil_id_id
            }
            
            return Response(data, status=status.HTTP_200_OK)
            
        except StencilTensionValues.DoesNotExist:
            return Response(
                {'error': 'Nenhum registro encontrado para este stencil.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

User = get_user_model()

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()  # Define o queryset, mesmo que não seja usado diretamente aqui
    serializer_class = UserCreateSerializer  # Define o serializer que vai tratar a criação

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()  # Busca todos os usuários
    serializer_class = CustomUserSerializer  # Usa o serializer para formatar os dados

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()  # Defina a consulta que busca todos os usuários
    serializer_class = CustomUserSerializer  # Defina o serializer que será usado
    lookup_field = 'id'  # Use o campo "id" como parâmetro de busca

class LoginView(APIView):
    permission_classes = [AllowAny]  # Permite acesso público
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)  # Valida os dados
        except AuthenticationFailed:
            return Response(
                {"detail": "Acesso negado. Credenciais inválidas."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = serializer.validated_data['user']  # Pega o usuário autenticado

        # Cria ou recupera o token do usuário
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,           # Retorna o token do usuário
            'user_id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,  # Incluindo os nomes

        }, status=status.HTTP_200_OK)

class ParameterTensionView(viewsets.ModelViewSet):
    queryset = ParameterTension.objects.all().order_by('-created_at')  # Ordena do mais recente para o mais antigo
    serializer_class = ParameterTensionSerializer