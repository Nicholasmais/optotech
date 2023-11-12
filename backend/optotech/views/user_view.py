from rest_framework import viewsets
from ..models.user import User
from ..serializers.user_serializer import UserSerializer
from rest_framework.response import Response
import bcrypt
from ..utils.custom_exception_handler import CustomAPIException
from ..models.user_pacientes import UserPacientes
from ..models.paciente import Paciente
from ..models.appointment import Appointment

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def signup(self, request):
        body = request.data

        if User.objects.filter(email=body.get("email")):
          raise CustomAPIException("Email já cadastrado.", 409)
      
        if User.objects.filter(user=body.get("user")):
          raise CustomAPIException("Usuário já cadastrado.", 409)
      
        serializer = self.serializer_class(data = request.data)
        
        if serializer.is_valid():

            salt = bcrypt.gensalt()
            password_bytes = body["password"].encode("ascii")
            password_hashed = bcrypt.hashpw(password_bytes, salt)
            
            body["password"]  = password_hashed.decode("utf-8")
   
            serializer = self.serializer_class(data = body)

            if serializer.is_valid():
                instance = serializer.save()
                return Response({**serializer.data, "id":instance.id})
            raise CustomAPIException(serializer.errors, 400)
        raise CustomAPIException(serializer.errors, 400)

    def update_data(self, request):
        user_id = request.session.get("user")
        user_model = User.objects.get(id = user_id)
        body = request.data

        user_serializer = self.serializer_class(user_model, data = body)
        if user_serializer.is_valid():
            salt = bcrypt.gensalt()
            password_bytes = body["password"].encode("ascii")
            password_hashed = bcrypt.hashpw(password_bytes, salt)
            
            body["password"]  = password_hashed.decode("utf-8")
            user_serializer = self.serializer_class(user_model, data = body)
            if user_serializer.is_valid():

                instance = user_serializer.save()
                del body["password"]
                
                return Response({
                    "isAuth": True,
                    "user":{
                    **body,
                    "id": str(instance.id)
                    }
                })
            raise CustomAPIException(user_serializer.errors, 400)
        return CustomAPIException("Erro ao atualizar usuário", 400)
    
    def delete_pacientes(self, request, pk):
        user_id = pk
        user = User.objects.get(id = user_id)
        user = UserSerializer(user)
        user_obj = user.data
        all_pacientes = UserPacientes.objects.filter(user = user_id).values_list("paciente_id")

        for paciente_id in all_pacientes:  
            Appointment.objects.filter(paciente = str(paciente_id[0])).delete()
            UserPacientes.objects.filter(paciente_id = paciente_id).delete()
            Paciente.objects.get(id = str(paciente_id[0])).delete()        

        return Response({"user":user_obj})

    def partial_update(self, request, email):
        body = request.data

        if not User.objects.filter(email = email):
            raise CustomAPIException("E-mail não cadastrado.", 404)
        user = User.objects.get(email = email)

        serializer = self.serializer_class(user, data = body, partial = True)
        if serializer.is_valid():
            serializer.save(partial=True)
            return Response(serializer.data)
       
        raise CustomAPIException(str(serializer.errors), 400)

