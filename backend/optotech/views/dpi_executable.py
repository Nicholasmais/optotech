from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from ..models.user import User
import os
import subprocess
import shutil
import io
import time

class DPIExecutable(APIView):
    def get(self, request):
        executable_path = os.getcwd() + r"\optotech\utils\get_dpi.exe"
        with open(executable_path, 'rb') as exe_file:
            exe_bytes = exe_file.read()

        # Cria um arquivo em memória com o executável
        exe_in_memory = io.BytesIO(exe_bytes)

        # Create an HTTP response with the file in memory
        response = HttpResponse(exe_in_memory.getvalue(), content_type="application/octet-stream")

        # Add the Content-Disposition header
        response['Content-Disposition'] = "attachment; filename=get_dpi.exe"
        response['Access-Control-Expose-Headers'] = 'Content-Disposition'

        return response

    def post(self, request):
        user_id = request.session.get("user", None)
        if not User.objects.filter(id=user_id) or not user_id:
            return Response({"status": "no user found"})

        path = os.getcwd() + r"\optotech\utils\template.py"

        with open(path, 'r') as file:
            template = file.read()

        # Replace the marker with the user ID
        code = template.replace('"{{USER_id}}"', f"'{str(user_id)}'")
        script_path = os.getcwd() + rf"\optotech\utils\scripts\{str(user_id)}.py"

        # Write the new code to a file (this part remains necessary for pyinstaller)
        with open(script_path, 'w') as file:
            file.write(code)

        # Setting up paths for pyinstaller
        dist_path = os.path.join(os.getcwd(), "dist")
        if not os.path.exists(dist_path):
            os.makedirs(dist_path)

        workpath = os.path.join(os.getcwd(), "build")
        if not os.path.exists(workpath):
            os.makedirs(workpath)
        inicio = time.time()

        # Run pyinstaller command
        command = f'pyinstaller --onefile --noconsole --distpath "{dist_path}" --workpath "{workpath}" "{script_path}"'
        subprocess.run(command, shell=True)
        print(time.time() - inicio)

        # Clean up after pyinstaller
        shutil.rmtree(workpath, ignore_errors=True)
        executable_path = os.path.join(dist_path, f"{str(user_id)}.exe")

        # Read the executable into memory
        with open(executable_path, 'rb') as exe_file:
            exe_bytes = exe_file.read()
        
        # Clean up the generated executable from disk
        os.remove(executable_path)

        # Create an in-memory file with the executable
        exe_in_memory = io.BytesIO(exe_bytes)
        
        # Create an HTTP response with the in-memory file
        response = HttpResponse(exe_in_memory.getvalue(), content_type="application/octet-stream")
        response['Content-Disposition'] = f'attachment; filename="{str(user_id)}.exe"'

        return response
