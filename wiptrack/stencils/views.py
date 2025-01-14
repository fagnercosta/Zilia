
from rest_framework import viewsets
from .models import Stencil
from .serializers import StencilSerializer

class StencilViewSet(viewsets.ModelViewSet):
    queryset = Stencil.objects.all()
    serializer_class = StencilSerializer
