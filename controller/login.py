

from system.controller import controller
from hashlib import sha256
import hashlib 
from system.security import security
from system.session import session
import secrets


class login(controller):
    
    pepper="rKLEWuHaxrFeeQHHyJ6OfRZ034MiYljck1DHSsMYGbPvD3ovAGt4nAS3HBxzayO62DcyNWxtjsmEs16AfkELRDHx1aFFlSTCqZgx";
    
    def run(self):
        self.renderpage()
    
    def loginsubmit(self):
        # SELECT * FROM userx WHERE username='{__.requestData["username"]}'"
        
        self.o.logx(self.pars["username"])
        self.o.logx(self.pars["publickey"])
        
        data= self.Model("user","__getuserinfo", dictionary=True, pdata=(self.pars["username"],) )["__getuserinfo"][0]
        
        ekey=security.hash(data["salt"]+ login.pepper)
        pswdhash=security.decrypt(data["hash"],ekey)
        
        strx=pswdhash+self.pars["publickey"]
        localkey=security.hash(strx)+"-"+str(self.pars["timestampx"])
        clientsign=self.o.rawreqdata["sign"][0]
        serversign=security.hash(self.o.rawreqdata["data"][0]+localkey )
        
        print("[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]")
        print("clientsign: "+clientsign)
        print("serversign: "+serversign)
        print("[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]")
        
    
        if clientsign==serversign:
            jskey=secrets.token_hex(30)
            
            self.o.logx("login success")
            self.o.output["isloggedIn"]=1
            self.output["jskey"]=jskey
            self.output["redirect"]="/"
            
            session.data[self.o.session.id]={
                "username":self.pars["username"],
                "name":data["name"],
                "role":"std",
                "localkey":localkey,
                "jskey":jskey,
                "timestampx":self.pars["timestampx"]
            }
    
    
    def createuser(self):
        pswdhash=security.sha256hash(self.pars["password"])
        salt=secrets.token_hex(16)
        ekey=security.sha256hash(salt+ login.pepper)
        hashk=security.encrypt(pswdhash,ekey)
        self.o.logx(hashk)         
        self.Model("user","__createnewuser", pdata=(self.pars["name"],self.pars["userid"], salt, hashk) )
        
        
        
    def logout(self):
        print("logging out")
        self.o.session.logout()
        self.output["status"]="success"
        