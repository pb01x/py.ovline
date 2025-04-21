from startserver import staticx
import json
import base64
from system.session import session
from system.security import security


class o:
    tempx=staticx
    def __init__(self, req):
        self.req=req
        self.session=session(self)
        self.security=security(self)
        self.page=req.path
        self.output={}
        self.pars={}

  
    def sendoutput(self):
        self.req.wfile.write(self.render() )
        
        
    def render(self):
        jsnoutput=json.dumps(self.output).encode()
        base64output= base64.b64encode(jsnoutput).decode("utf-8")
        finaldata={"data":base64output}
        # self.logx(json.dumps(finaldata))
        return json.dumps(finaldata).encode()
        
        
    def logx(self,obj):
        # print(type(obj))
        if isinstance(obj,dict):
            # print(json.dumps(obj))
            for key in obj:
                print("\033[91m"+key+"  : \033[93m"+ str(obj[key]))
            print("\033[37m")
        elif isinstance(obj,list):
            for key in obj:
                print("\033[91m"+key)
            print("\033[37m")
        elif isinstance(obj,str):
            print(obj)
        elif isinstance(obj,bytes):
            print( "\033[95m"+str(obj))
            print("\033[37m")
            
            
            