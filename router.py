import http
import os
import shutil
import json
import base64



class router():
    
    def getroute(req):
            extensionx=os.path.splitext(req.path)[1]
            pth=""
            if extensionx in [".js",".css",".json"]:
                pth=req.path
                req.send_header("Content-type", "text/html")
                return router.encodeandreturn(req,pth) 
            elif extensionx in [".jpg",".jpeg",".png",".mp3",".ico"]:
                pth=req.path
                with open("public"+pth, 'rb',-1,None) as file:
                    shutil.copyfileobj(file, req.wfile)
            else:
                pth="/index.html"
                req.send_header("Content-type", "text/html")

                from system import staticfilebuilder
                staticfilebuilder.staticfilebuilder.buildfiles()
                return router.encodeandreturn(req,pth) 
                
            # print("\033[93m" +pth)
        
    def encodeandreturn(req,pth):
        with open("public"+pth, 'r') as file:
            data = file.read()
        req.wfile.write( data.encode("utf8") )
        
     
    def postroute(o):
        req=o.req
        req.send_header("Content-type", "text/json")
        content_len = int(req.headers['Content-Length'])
        post_body = req.rfile.read(content_len).decode()
        data = post_body.split("=")[1]
        
        data=json.loads(base64.b64decode(data.replace("%3D","=")))
        o.logx(data)
        o.pars=data
           
        if data.get("apid")=="init":
            router.init(o)
        else:
            router.pageRouter(o)
        
            
            
            
    def pageRouter(o):
        o.logx(o.req.path)
        o.logx("=========================")
        layout=router.readpage(o)
        o.output["layout"]=layout
    
    
    def  readpage(o):
        from system.io import io
        try:
            layout=io.readfile("view"+o.req.path+".js")
            
        except Exception as e:
            print("file "+"view"+o.req.path+".js"+" not found")
            
        return layout
        
        
    def init(o):
        from system.io import io
        widgets=io.readFolderToDic("widgets/")
        o.output["widgets"]=widgets
        

        # response(req,"testx","testy")
        # req.wfile.write( json.dumps(widgets).encode())


       