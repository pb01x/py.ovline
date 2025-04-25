
import base64
import re
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Util.Padding import unpad
import os
import hashlib



class security:
    def __init__(self, o):
          self.o = o
    def pageroles_permission(self,pagelayout):
        
        rolesx=pagelayout.split("_.roles")[1]
        
        # self.o.logx(rolesx)
        # self.o.logx(rolesx[0:rolesx.find(";")])
        
        rolesx=rolesx[0:rolesx.find(";")].replace("=","").replace("\"","").split(",")
        roles={}
        for role in rolesx:
                mrole=role.split(":")
                roles[mrole[0].lstrip()]=mrole[1]
        
        self.o.logx(roles)
        print(roles.get("public"))
        
        userRole=roles.get(self.o.session.data["role"])
        
        if userRole==None:
            return 0
        elif userRole=="current":
            return 1
        else:
            print("redirecting to "+userRole)
            return  "/"+userRole
              
   
 

    def hash(text):
        # print("--"+text+"--")
        
        encoded_text = text.encode('utf-8')
        sha256_hash = hashlib.sha256(encoded_text)
        return sha256_hash.hexdigest()


    def hashx(text):
        encoded_text = text.encode('utf-8')
        sha256_hash = hashlib.sha256(encoded_text)
        hex_digest = sha256_hash.hexdigest()
        return hex_digest
     

    def decrypt(encrypted_text, encryption_key):
        try:
            
            encrypted_bytes = base64.b64decode(encrypted_text)
            salt = bytes([0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76])
            key = PBKDF2(encryption_key, salt, dkLen=32)
            iv = PBKDF2(encryption_key, salt, dkLen=16)

            cipher = AES.new(key, AES.MODE_CBC, iv)
            padded_decrypted_bytes = cipher.decrypt(encrypted_bytes)

            # Manually remove padding, handling potential errors
            padding_length = 0
            if padded_decrypted_bytes:
                last_byte = padded_decrypted_bytes[-1]
                if 0 <= last_byte <= AES.block_size:
                    padding_length = last_byte
                    if padding_length > len(padded_decrypted_bytes):
                        print("Warning: Padding length invalid.")
                        return ""
                    padding_bytes = padded_decrypted_bytes[-padding_length:]
                    if all(b == last_byte for b in padding_bytes):
                        decrypted_bytes = padded_decrypted_bytes[:-padding_length]
                    else:
                        # print("Warning: Invalid padding bytes.")
                        decrypted_bytes = padded_decrypted_bytes # keep the data as is
                else:
                    decrypted_bytes = padded_decrypted_bytes
            else:
                decrypted_bytes = b""

            try:
                return security.removeIlligalCharacterFromString(decrypted_bytes.decode('utf-16'))
            except UnicodeDecodeError as e:
                print(f"UnicodeDecodeError: {e}")
                # Attempt to decode with a more forgiving error handler
                return security.removeIlligalCharacterFromString(decrypted_bytes.decode('utf-16', errors='ignore'))
        except (ValueError, KeyError, TypeError) as e:
            print(f"Decryption error: {e}")
            return ""


    

    def encrypt(clear_text, encryption_key):
        clear_bytes = clear_text.encode('utf-16')
        salt = bytes([0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76])
        key = PBKDF2(encryption_key, salt, dkLen=32)
        iv = PBKDF2(encryption_key, salt, dkLen=16)

        cipher = AES.new(key, AES.MODE_CBC, iv)
        padded_clear_bytes = clear_bytes + (b'\x00' * (AES.block_size - len(clear_bytes) % AES.block_size))
        encrypted_bytes = cipher.encrypt(padded_clear_bytes)

        return base64.b64encode(encrypted_bytes).decode('utf-8')
    
    
    
    def removeIlligalCharacterFromString(text):
        cleaned_text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        # 2. Remove control characters
        cleaned_text = re.sub(r'[\x00-\x1F\x7F]', '', cleaned_text)
        # 3. Remove characters that cause basic ASCII encoding issues (that weren't already removed)
        final_cleaned_text = ''.join(char for char in cleaned_text if ord(char) < 128)
        return final_cleaned_text
        
    
    def printstring(text):
        found_illegal = False

        # 1. Non-Alphanumeric (excluding whitespace)
        non_alphanumeric = re.findall(r'[^a-zA-Z0-9\s]', text)
        if non_alphanumeric:
            found_illegal = True
            print("\nPotentially illegal non-alphanumeric characters:")
            for char in sorted(list(set(non_alphanumeric))):
                print(f"'{char}' (Unicode: {ord(char)})")

        # 2. Control Characters
        control_chars = re.findall(r'[\x00-\x1F\x7F]', text)
        if control_chars:
            found_illegal = True
            print("\nPotentially illegal control characters:")
            for char in sorted(list(set(control_chars))):
                print(f"'{repr(char)}' (Unicode: {ord(char)})")

        # 3. Characters that might cause issues with common encodings (beyond basic ASCII)
        potentially_encoding_issues = []
        for char in text:
            try:
                char.encode('ascii')
            except UnicodeEncodeError:
                if char not in non_alphanumeric and char not in control_chars: # Avoid redundancy
                    potentially_encoding_issues.append(char)

        if potentially_encoding_issues:
            found_illegal = True
            print("\nPotentially illegal characters for basic ASCII encoding:")
            for char in sorted(list(set(potentially_encoding_issues))):
                print(f"'{char}' (Unicode: {ord(char)})")

        if not found_illegal:
            print("No potentially illegal characters found based on these broad categories.")
