# stencils/serializers.py

from rest_framework import serializers
from .models import Stencil

class StencilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stencil
        fields = '__all__'
