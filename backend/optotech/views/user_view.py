from rest_framework import viewsets
from ..models.user import User
from ..serializers.user_serializer import UserSerializer
from rest_framework.response import Response
import bcrypt
from ..utils.custom_exception_handler import CustomAPIException
from ..models.user_pacientes import UserPacientes
from ..models.paciente import Paciente
from ..models.appointment import Appointment
from ..decorator.is_auth import authentication_required
from .encryption import EncryptionTools

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    encryption = EncryptionTools()
    
    def list(self, request):
        all_users = self.queryset
        all_users_serializer = self.serializer_class(all_users, many = True)

        for data in all_users_serializer.data:
            email = data.get("email")
            decrypted_email = self.encryption.uncipher(email)
            data["email"] = decrypted_email
            user = data.get("user")
            decrypted_user = self.encryption.uncipher(user)
            data["user"] = decrypted_user

        return Response(all_users_serializer.data)

    def signup(self, request):
        body = request.data
        
        encrypted_email = self.encryption.cipher(body.get("email"), to_string=True)
        encrypted_user = self.encryption.cipher(body.get("user"), to_string=True)

        if User.objects.filter(email=encrypted_email).exists():
            raise CustomAPIException("Email já cadastrado.", 409)

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            salt = bcrypt.gensalt()

            # Hashing the password
            password_bytes = body["password"].encode("utf-8")
            password_hashed = bcrypt.hashpw(password_bytes, salt)
            body["password"] = password_hashed.decode("utf-8")

            # Convert encrypted strings to bytes
            body["email"] = encrypted_email
            body["user"] = encrypted_user

            # Creating a new serializer with the updated body
            serializer = self.serializer_class(data=body)

            if serializer.is_valid():
                # Save the instance
                instance = serializer.save()
                return Response({**serializer.data, "id": instance.id})
            raise CustomAPIException(serializer.errors, 400)

        raise CustomAPIException(serializer.errors, 400)
    
    @authentication_required
    def update_data(self, request, user_id = None):
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
    
    def delete_user(self, request, pk):
        try:
            if not User.objects.filter(id = pk).exists():
                raise CustomAPIException("Usuário não encontrado", 404)
        except:
            raise CustomAPIException("Usuário não encontrado", 404)
        
        self.delete_pacientes(request, pk)        
        
        user = User.objects.get(id = pk)
        user_serializer = UserSerializer(user)
        user_obj = user_serializer.data
        user.delete()

        user_obj["email"] = self.encryption.uncipher(user_obj["email"])        
        user_obj["user"] = self.encryption.uncipher(user_obj.get("user"))
        
        return Response({"user":user_obj})

    def delete_pacientes(self, request, pk):
        user_id = pk
        user = User.objects.get(id = user_id)
        user = UserSerializer(user)
        user_obj = user.data
        all_pacientes = UserPacientes.objects.filter(user = user_id).values_list("paciente_id")

        for paciente_id in all_pacientes:
            paciente_usuario_list = UserPacientes.objects.filter(paciente = str(paciente_id[0]))
            
            for paciente_usuario in paciente_usuario_list:                        
                Appointment.objects.filter(paciente_usuario = str(paciente_usuario.id)).delete()

            UserPacientes.objects.filter(paciente_id = str(paciente_id[0])).delete()
            Paciente.objects.get(id = str(paciente_id[0])).delete()

        return Response({"user":user_obj})

    @authentication_required
    def partial_update(self, request, user_id = None):        
        body = request.data

        if not User.objects.filter(id = user_id):
            raise CustomAPIException("Usuário não cadastrado.", 404)
        user = User.objects.get(id = user_id)

        serializer = self.serializer_class(user, data = body, partial = True)
        if serializer.is_valid():
            serializer.save(partial=True)
            return Response(serializer.data)
       
        raise CustomAPIException(str(serializer.errors), 400)

