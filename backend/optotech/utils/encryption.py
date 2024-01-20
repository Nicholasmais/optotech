from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
import base64
import os

class EncryptionTools:
    def __init__(self):
        self.__key = bytes(os.environ.get("PRIVATE_KEY")[:32], 'utf-8')

    def cipher(self, str_data, to_string = False):
        data = str_data.encode('utf-8')
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(data) + padder.finalize()

        cipher = Cipher(algorithms.AES(self.__key), modes.ECB(), backend=default_backend())
        encryptor = cipher.encryptor()
        encrypted_data = encryptor.update(padded_data) + encryptor.finalize()

        if to_string:
            return base64.b64encode(encrypted_data).decode('utf-8')
        
        return base64.b64encode(encrypted_data)

    def uncipher(self, encoded_encrypted_data):
        encrypted_data = base64.b64decode(encoded_encrypted_data)

        cipher = Cipher(algorithms.AES(self.__key), modes.ECB(), backend=default_backend())
        decryptor = cipher.decryptor()
        decrypted_data = decryptor.update(encrypted_data) + decryptor.finalize()

        unpadder = padding.PKCS7(128).unpadder()
        data = unpadder.update(decrypted_data) + unpadder.finalize()

        return data.decode('utf-8')
