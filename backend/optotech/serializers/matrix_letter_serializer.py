from rest_framework import serializers
from ..models.matrix_letter import MatrixLetter

class MatrixLetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatrixLetter
        fields = '__all__'