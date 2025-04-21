import http
import os
import shutil
import json
import base64

class getrouter:
    def route(req):
        extensionx=os.path.splitext(req.path)[1]
        pth=""
        if extensionx in [".js",".css",".json"]:
            pth=req.path
            req.send_header("Content-type", "text/html")
            return getrouter.encodeandreturn(req,pth) 
        elif extensionx in [".jpg",".jpeg",".png",".mp3",".ico"]:
            pth=req.path
            with open("public"+pth, 'rb',-1,None) as file:
                shutil.copyfileobj(file, req.wfile)
        else:
            pth="/index.html"
            req.send_header("Content-type", "text/html")
            from system import staticfilebuilder
            staticfilebuilder.staticfilebuilder.buildfiles()
            return getrouter.encodeandreturn(req,pth) 
            
            
    def encodeandreturn(req,pth):
        with open("public"+pth, 'r') as file:
            data = file.read()
            req.wfile.write( data.encode("utf8") )
            