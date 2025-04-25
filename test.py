

import hashlib

text="e7f90b0310363d697e83711832881d3aabd37e3e8c25efe3883ed8de0c4c29fb"

print("--"+text+"--")
print(type(text))


encoded_text = text.encode('utf-8')
sha256_hash = hashlib.sha256(encoded_text)
hex_digest = sha256_hash.hexdigest()

print(hex_digest)