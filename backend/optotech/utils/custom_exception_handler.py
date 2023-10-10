from rest_framework.exceptions import APIException
from rest_framework.response import Response

class CustomAPIException(APIException):
    def __init__(self, detail="Internal server error", status_code=500):
        self.detail = detail
        self.status_code = status_code
