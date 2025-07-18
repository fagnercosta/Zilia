from dashboard.models import (

    Stencil,
    
    StencilTensionValues,
    StencilType,
    ProcessedImage,
    Configurations,CustomUser, ParameterTension
)
from django.contrib.auth.models import Group, User
from rest_framework import serializers
from django.contrib.auth import get_user_model

from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed

class ConfigurationsSerializer(serializers.ModelSerializer):
      class Meta:
          model= Configurations
          fields = ['id','date_to_review']

class ProcessedImageSerializer(serializers.ModelSerializer):

    stencil = serializers.PrimaryKeyRelatedField(queryset=Stencil.objects.all())

    class Meta:
        model = ProcessedImage
        fields = ['id', 'stencil', 'image_path', 'scratch_count', 'timestamp']

'''class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]'''

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'password')
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)  # remove 'password' do dict

        # Atualiza os demais campos normalmente
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Atualiza a senha (se fornecida)
        if password:
            instance.set_password(password)

        instance.save()
        return instance


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class ParameterTensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParameterTension
        fields = "__all__"


class StencilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stencil
        fields = "__all__"


class StencilTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StencilType
        fields = "__all__"




class StencilTensionValuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = StencilTensionValues
        fields = "__all__"


# Pega o modelo customizado definido no settings.py
User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"  # Inclua os campos que deseja expor

User = get_user_model()

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = "__all__"  # Inclua outros campos que você deseja, como nome, etc.

    def create(self, validated_data):
        # Cria o usuário com o método set_password para garantir que a senha seja armazenada criptografada
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name']
            
        )
        return user
    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        # Autentica o usuário usando email e senha
        user = authenticate(email=email, password=password)

        if user is None:
            raise AuthenticationFailed('Credenciais inválidas.')

        if not user.is_active:
            raise AuthenticationFailed('Conta desativada.')

        data['user'] = user  # Retorna o usuário autenticado
        return data
