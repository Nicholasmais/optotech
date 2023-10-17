from rest_framework import viewsets
from ..models.matrix_letter import MatrixLetter
from ..serializers.matrix_letter_serializer import MatrixLetterSerializer
from rest_framework.response import Response

class MatrixLetterView(viewsets.ModelViewSet):
    queryset = MatrixLetter.objects.all()
    serializer_class = MatrixLetterSerializer

    def get_letra(self, request):
        if not request.GET.get("letra"):
            all_letters = MatrixLetter.objects.all()
            all_letters_obj = MatrixLetterSerializer(all_letters, many = True).data

            all_letters_dict = {}
            for row in all_letters_obj:
                for letra in row:
                    if letra != "id":
                        if letra not in all_letters_dict:
                            all_letters_dict[letra] = []
                        temp_list = row[letra]
                        temp_list_int = [int(letter) for letter in temp_list]
                        all_letters_dict[letra].append(temp_list_int)

            for chave in all_letters_dict.copy().keys():
                all_letters_dict[chave.upper()] = all_letters_dict[chave]
                del all_letters_dict[chave]
            
            return Response(all_letters_dict)
        
        letra = request.GET.get("letra").lower()
      
        letra_matrix = MatrixLetter.objects.values(letra)
        letra_matrix_list = [[int(letter) for letter in row[letra]] for row in letra_matrix]        
        
        return Response(letra_matrix_list)