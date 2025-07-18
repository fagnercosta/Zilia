from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from django.conf.urls.static import static
from django.conf import (settings)

from dashboard.views import (

    GroupViewSet, 
    StencilTensionValuesViewSet,
    StencilTensionLastValuesViewSet,
    StencilTypeViewSet,
    StencilViewSet,
   
    ProcessedImageViewSet,
    ProcessedLastImageViewSet,
    ProcessedImagesByStencilViewSet,
    takephoto,
    takephotoraspy,
    positionRoboPoint,
    changeLamp,
    # ConfigurationsViewSet,
    configurations_manager,
    test_services_points,
    UserCreateSerializer, UserRetrieveUpdateDestroyView,
    UserCreateView,
    UserDetailView,
    UserListView, ParameterTensionView, LatestStencilTensionView,sincronizedStencilData
)

from dashboard.views import (
    UserCreateView,UserListView, UserDetailView, LoginView, pointsResult, 
    
)


from dashboard.routes import(
    sinc_data, check, scanner
)

router = routers.DefaultRouter()
router.register(r"groups", GroupViewSet)
router.register(r"stencil", StencilViewSet)
router.register(r"stencilType", StencilTypeViewSet)
router.register(r"stencilTensionValues", StencilTensionValuesViewSet, basename="stenciltensionvalues")
router.register(r"stencilTensionLastValues", StencilTensionLastValuesViewSet, basename="stenciltensionlastvalues")
router.register(r'processedimages', ProcessedImageViewSet, basename='processedimage')
router.register(r'processedlastimages', ProcessedLastImageViewSet, basename='processedlastimage')
router.register(r'parameters-tension', ParameterTensionView, basename='parameters-tension')

router.register(r'processed-images-by-stencil', ProcessedImagesByStencilViewSet, basename='processed-images-by-stencil')


urlpatterns = [
    path('create-user/', UserCreateView.as_view(), name='create_user'),  # URL para criar usuário
    path('users/<int:pk>/', UserRetrieveUpdateDestroyView.as_view(), name='user-detail'),
    path('users/', UserListView.as_view(), name='user_list'),  # Rota para listar usuários
    path('users/<int:id>/', UserDetailView.as_view(), name='user_detail'),  # Rota com o ID do usuário7
    path('login/', LoginView.as_view(), name='login'),  # Rota de login
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    
    path('api/scanner/', scanner, name='scanner'),
    
    path("api/takephoto/<int:stencil_id_request>/",takephoto, name='takephoto'),
    path("api/takephotraspy/<int:stencil_id_request>/",takephotoraspy, name='takephotoraspy'),
    path("api/sinck_data_stencil/",sincronizedStencilData, name='sinck_data_stencil'),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
   
    path('api/changeLamp/<str:status>/', changeLamp, name='change_lamp'),
   
    path('api/configurations/', configurations_manager ),
    path('api/testpoints/', pointsResult, name="testservicepoints"),

    path('api/position-point/',positionRoboPoint, name="position-point"),
    path('stencil-tension/latest/<int:stencil_id>/', LatestStencilTensionView.as_view(), name='latest-stencil-tension'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
