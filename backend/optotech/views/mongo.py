from rest_framework.views import APIView
from rest_framework.response import Response
from ..utils.mongo import MongoDatabase
from bson import ObjectId
from ..utils.custom_exception_handler import CustomAPIException

class MongoView(APIView):
    def __init__(self):
        mongo = MongoDatabase()
        self.db_collection = mongo.get_collection("aditional-info")

    def get(self, request, patient_id = None):
        if patient_id and not self.info_found(patient_id):
            return Response([])
        
        patient_id_filter = {}
        if patient_id:
            patient_id_filter["patient_id"] = patient_id

        return Response(self.serializer(self.db_collection.find(patient_id_filter)))
    
    def list(self, request, patient_id = None):
        if patient_id and not self.info_found(patient_id):
            return Response([])
        
        patient_id_filter = {}
        if patient_id:
            patient_id_filter["patient_id"] = patient_id

        return Response(self.serializer_list(self.db_collection.find(patient_id_filter)))
   
    def post(self, request = None, body = None):
        if not body:
            body = request.data

        self.db_collection.insert_one(body)

        return Response(self.serializer(body),status=201)
   
    def delete(self, request, id):
        if not self.info_found(id):
            return CustomAPIException("Additional detail not found", 404)
        
        self.db_collection.delete_one({"_id":ObjectId(id)})

        return Response(status=204)
   
    def info_found(self, id):
       return  bool(self.serializer(self.db_collection.find({"patient_id":id})))
   
    def serializer(self, cursor):
        if isinstance(cursor, dict):
            cursor["id"] = str(cursor["_id"])
            del cursor["_id"]
            return cursor
        
        res = []
        for row in cursor:         
            row["id"] = str(row["_id"])
            del row["_id"]
            res.append(row)

        return res[0] if len(res) == 1 else res
    
    def serializer_list(self, cursor):
        if isinstance(cursor, dict):
            cursor["id"] = str(cursor["_id"])
            del cursor["_id"]
            return [cursor]
        
        res = []
        for row in cursor:         
            row["id"] = str(row["_id"])
            del row["_id"]
            res.append(row)

        return res