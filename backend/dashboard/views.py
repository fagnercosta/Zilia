from dashboard.services import wiptrackSincronizeService
from dashboard.models import (
     
    Stencil,  
    StencilTensionValues,
    StencilType,
    ProcessedImage,
    
)

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
    LoginSerializer
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
    sincronized_comand  = wiptrackSincronizeService.WiptrackSincronizeService();
    sincronized_comand.main()

    return Response({
        "message":"ola"
    })
    



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

        # Adicione aqui a lógica de criação customizada, se necessário
        self.perform_create(serializer)
        
        # Retorna uma resposta de sucesso
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
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


User = get_user_model()

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()  # Define o queryset, mesmo que não seja usado diretamente aqui
    serializer_class = UserCreateSerializer  # Define o serializer que vai tratar a criação

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()  # Busca todos os usuários
    serializer_class = CustomUserSerializer  # Usa o serializer para formatar os dados

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
            'token': token.key,  # Retorna o token do usuário
            'user_id': user.id,
            'email': user.email
        }, status=status.HTTP_200_OK)