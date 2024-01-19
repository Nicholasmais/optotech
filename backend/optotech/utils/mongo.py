import os
from dotenv import load_dotenv

dotenv_path = '.env'
load_dotenv(dotenv_path)

from pymongo import MongoClient

class MongoDatabase():
    def __init__(self):        
        client = MongoClient(os.environ.get("MONGO_CONNECTION_STRING"))
        self.db = client['optotech']
    
    def get_collection(self, collection_name):
        return self.db[collection_name]
    