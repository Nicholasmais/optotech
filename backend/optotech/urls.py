"""
URL configuration for optotech project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views.user_view import UserViewSet
from .views.login_view import LoginViewSet
from .views.appointment import AppointmentView
from .views.matrix_letter import MatrixLetterView
from .views.aluno import AlunoViewSet
from .views.report import ReportComparison
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'alunos', AlunoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),    
    path('login/', LoginViewSet.as_view({'post': 'login'}), name='login'),
    path('logout/', LoginViewSet.as_view({'post': 'logout'}), name='logout'),
    path('signup/', UserViewSet.as_view({'post': 'signup'}), name='signup'),
    path('isAuth/', LoginViewSet.as_view({'get': 'is_authenticated'}), name='is-authenticated'),
    path('appointment/', AppointmentView.as_view({'get': 'user_appointments', 'post': 'create'}), name='appointment'),
    path('update-data/', UserViewSet.as_view({'put': 'update_data'}), name='update-data'),
    path('matrix-letter/', MatrixLetterView.as_view({'get': 'get_letra'}), name='matrix-letter'),
    path('report/comparison', ReportComparison.as_view(), name='report-comparison'),
    path('', include(router.urls)),
]
