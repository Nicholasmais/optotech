from rest_framework.views import APIView
from rest_framework.response import Response
class ReportComparison(APIView):
    def get(self, request):
        return Response({
            "superior" : 20,
            "igual" : 10,
            "inferior" : 2
        })