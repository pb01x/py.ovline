import json
import base64
from system.o import o
from system.io import io

from urllib.parse import urlparse, parse_qs


class postrouter:
    x=0
    def __init__(self, requestRaw):
        self.req=requestRaw
        self.consolebreak()
        self.o=o(requestRaw)
        self.route()
        self.o.sendoutput()        
    
    
    def route(self):
        req=self.o.req
        # req.send_header("Content-type", "text/json")
        content_len = int(req.headers['Content-Length'])
        post_body = req.rfile.read(content_len).decode()
        if len(post_body)==0:
            print("empty post request")
            return
            
        params_dict = parse_qs(post_body)
        # data = post_body.split("=")[1]
        data=params_dict["data"][0]
        self.o.rawreqdata=params_dict
        data=json.loads(base64.b64decode(data.replace("%3D","=")))
        self.o.logx(data)
        self.o.pars=data
           
        apid=data.get("apid")
        
        if apid=="init":
            self.init()
        elif data.get("nodes") !=None:
            from system.model import model
            self.o.output["data"]= model(self.o,data.get("path"), data.get("nodes").split(","), True  ).output
        else:
            self.pageRouter()
        
        
    def init(self):
        from system.io import io
        widgets=io.readFolderToDic("widgets/")
        self.o.output["widgets"]=widgets
        

    def pageRouter(self):
        self.o.logx(self.o.page)
        self.o.logx("=========================")
        
        fun=self.o.pars.get("fun")
        print(fun)
        
        file=(self.o.page+".js").replace("/.js","/home.js");
        self.o.page=file.replace(".js","")
        
        
        import importlib
        module=None
        self.o.renderpage=False
        try:
            print((self.o.req.mvcpath+ "controller"+self.o.page).replace("/","."))
            module = importlib.import_module((self.o.req.mvcpath+ "controller"+self.o.page).replace("/","."))
            cntrlr = getattr(module, self.o.page.split("/")[-1] )(self.o)
            getattr(cntrlr, fun if fun!=None else "run" )()
        except Exception:
            self.o.renderpage=True
            import traceback
            traceback.print_exc()
        
        
        if self.o.renderpage:
            if fun==None:
                layout=self.readpage(file)
                self.o.output["layout"]=layout
            elif fun[0:2]=="__":
                self.o.output[fun]="Access Denied"
                return
        
        self.o.logx("=========================")
        
    
    
    def  readpage(self,file):
        print(file)
        from system.io import io
        layout=""
        try:
            layout=io.readfile(self.o.req.mvcpath+"view"+file)
            layout= self.includeInclude(layout)
        except Exception:
            print(Exception)
            print(self.o.req.mvcpath+"view"+file+" not found")
        
        pageper=self.o.security.pageroles_permission(layout)
        print(pageper)
        if pageper ==0:
            print("PERMISSION DENIED")
            layout="_.raw=`DENIED`"
        elif pageper ==1:
            return layout
        else:
            return self.readpage(pageper)
    
    
    
    def includeInclude(self,layout):
        starti=layout.find("_.include")
        # print(starti)
        if starti==-1:
            return layout
            
        endi=layout.find(";",starti)
        includestr=layout[starti:endi]
        includeFile=includestr.split("=")[1].replace("\"","").lstrip()+".js"
        try:
            includeLayout=io.readfile(self.o.req.mvcpath+"view"+includeFile)
        except Exception:
            print("ERROR READING : "+self.o.req.mvcpath+"view"+includeFile)
            includeLayout=""
        modifiedLayout= layout.replace(includestr+";",includeLayout)
        return self.includeInclude(modifiedLayout)
       
    
    def consolebreak(self):
        # self.o.tempx.x+=1
        postrouter.x+=1
        print("\033[37m") 
        print("");
        print("");
        print("\033[93m=======================  "+str(postrouter.x)+"  ============================")
        print("--         "+self.req.path+"              --")