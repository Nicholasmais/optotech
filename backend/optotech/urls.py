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
from .views.paciente import PacienteViewSet
from .views.report import ReportComparison, ReportActive, ReportDemographic, ReportMaxMinDate, ReportPatientAppointments
from .views.dpi_executable import DPIExecutable
from .views.mongo import MongoView
from .views.redis import RedisView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'pacientes', PacienteViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),    
    path('login/', LoginViewSet.as_view({'post': 'login'}), name='login'),
    path('logout/', LoginViewSet.as_view({'post': 'logout'}), name='logout'),
    path('signup/', UserViewSet.as_view({'post': 'signup'}), name='signup'),
    path('isAuth/', LoginViewSet.as_view({'get': 'is_authenticated', 'post': 'is_authenticated'}), name='is-authenticated'),
    path('getCookies/', LoginViewSet.as_view({'get': 'check_cookie'}), name='is-authenticated'),
    path('appointment/', AppointmentView.as_view({'get': 'user_appointments', 'post': 'create'}), name='appointment'),
    path('update-data/', UserViewSet.as_view({'put': 'update_data'}), name='update-data'),
    path('matrix-letter/', MatrixLetterView.as_view({'get': 'get_letra'}), name='matrix-letter'),
    path('report/comparison/', ReportComparison.as_view(), name='report-comparison'),
    path('report/active/', ReportActive.as_view(), name='report-active'),
    path('report/demographic/', ReportDemographic.as_view(), name='report-demographic'),
    path('report/max-min-date/', ReportMaxMinDate.as_view(), name='report-max-min-date'),
    path('report/patient/', ReportPatientAppointments.as_view(), name='report-patient'),
    path('users/delete-pacientes/<str:pk>/', UserViewSet.as_view({'delete': 'delete_pacientes'}), name='users-delete-pacientes'),
    path('users/', UserViewSet.as_view({'patch': 'partial_update', 'get':'list'}), name='patch-user'),
    path('delete-user/<str:pk>/', UserViewSet.as_view({'delete':'delete_user'}), name='delete-user'),
    path('generate-dpi-script/', DPIExecutable.as_view(), name='generate-dpi-script'),    
    path('check-mongo/', MongoView.as_view(), name='check-mongo'),
    path('check-mongo/<str:id>', MongoView.as_view(), name='check-mongo'),
    path('blacklist/', RedisView.as_view(), name='blacklist'),
    path('', include(router.urls)),
]
