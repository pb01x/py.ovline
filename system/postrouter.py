import json
import base64
from system.o import o
from system.io import io


class postrouter:
    def __init__(self, requestRaw):
        self.o=o(requestRaw)
        self.consolebreak()
        self.route()
        self.o.sendoutput()        
    
    
    def route(self):
        req=self.o.req
        # req.send_header("Content-type", "text/json")
        content_len = int(req.headers['Content-Length'])
        post_body = req.rfile.read(content_len).decode()
        data = post_body.split("=")[1]
        
        data=json.loads(base64.b64decode(data.replace("%3D","=")))
        self.o.logx(data)
        self.o.pars=data
           
        apid=data.get("apid")
        if apid=="init":
            self.init()
        elif data.get("nodes") !=None:
            from system.model import model
            self.o.output["data"]= model(self.o,data.get("path"), data.get("nodes").split(",")  ).output
        else:
            self.pageRouter()
        
        
        
    def init(self):
        from system.io import io
        widgets=io.readFolderToDic("widgets/")
        self.o.output["widgets"]=widgets
        

    def pageRouter(self):
        self.o.logx(self.o.req.path)
        self.o.logx("=========================")
        
        
        fun=self.o.pars.get("fun")
        
        file=(self.o.req.path+".js").replace("/.js","/home.js");
        self.o.page=file.replace(".js","")
        if fun==None:
            layout=self.readpage(file)
            self.o.output["layout"]=layout
        
        import importlib
        module=None
        try:
            module = importlib.import_module("controller"+self.o.page.replace("/","."))
            cntrlr = getattr(module, self.o.page.split("/")[-1] )(self.o)
            getattr(cntrlr, fun if fun!=None else "run" )()
        except Exception:
            import traceback
            traceback.print_exc()
            
    
        self.o.logx("=========================")
        
    
    
    def  readpage(self,file):
        from system.io import io
        layout=""
        try:
            layout=io.readfile("view"+file)
            layout= self.includeInclude(layout)
        except Exception:
            print(Exception)
            print(("view"+self.o.req.path+".js").replace("/.js","/home.js")+" not found")
        
        # print(layout)
        if self.o.security.pageroles_permission(layout) !=1:
            print("PERMISSION DENIED")
            layout="_.raw=`DENIED`"
        return layout
    
    
    def includeInclude(self,layout):
        starti=layout.find("_.include")
        # print(starti)
        if starti==-1:
            return layout
            
        endi=layout.find(";",starti)
        includestr=layout[starti:endi]
        includeFile=includestr.split("=")[1].replace("\"","").lstrip()+".js"
        includeLayout=io.readfile("view"+includeFile)
        modifiedLayout= layout.replace(includestr+";",includeLayout)
        return self.includeInclude(modifiedLayout)
       
    
    
    
    def consolebreak(self):
        self.o.tempx.x+=1
        print("\033[37m") 
        print("");
        print("");
        print("-----------------------------------------------")
        print("\033[93m======================  "+str(self.o.tempx.x)+  "=============================")
        print("--         "+self.o.req.path+"              --")