import requests
import time
import hashlib

from bbs import models, db

def md5_encode(str):
    # The argument must be of type byte, otherwise Unicode-objects must be encoded before hashing
    m = hashlib.md5(str.encode(encoding='utf-8'))
    return m.hexdigest()

api_url = "http://114.70.14.56:10041/api/labnotebook.blockchain"

# run SetUpDemo transaction
print("\n\n============================")
print("Running SetUpDemo transaction...")

input = {"$class": "labnotebook.blockchain.setupDemo", "ProjectID": "BELN001", "ProjectName": "TESTfromPython",
         "createdDate": time.time()}
response = requests.post("http://114.70.14.56:10041/api/labnotebook.blockchain.setupDemo", data=input)

if response.status_code == 200:
    print("...done!")
else:
    print("Something went wrong :(")
    print(response.text)

p = md5_encode("0000")
id1 = "R001"; id2 = "R002"; id3 = "H001"
e1 = "R001@test"; e2 = "R002@test"; e3 = "H001@test"
r1 = "Master Course Student"; r2 ="Professor"
f1 = "Seokju"; f2 = "Hyunkeol"; f3 = "Marco"
l1 = "Hahn"; l2 = "Noh"; l3 = "Comuzzi"

user1 = models.User(nickname=id1, email=e1, role=r1, password=p, timestamp=time.time())
user2 = models.User(nickname=id2, email=e2, role=r1, password=p, timestamp=time.time())
user3 = models.User(nickname=id3, email=e3, role=r2, password=p, timestamp=time.time())

db.session.add(user1); db.session.add(user2); db.session.add(user3)
db.session.commit()