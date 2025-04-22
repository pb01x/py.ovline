import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler
# from config import config
import os
import platform
import sys
# from router import router

class start(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        self._set_headers()
        from system.getrouter import getrouter
        getrouter.route(self)
        print("-----------------------------------------------")
        
        
    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        print("/////////////////////////////")
        port=self.server.server_address[1]
        # self.config=config
        
        import time
        t = time.process_time()
        
        self.mvcpath=""
        if port==staticx.config["dbmsport"]:
            self.mvcpath="utilities/dbms/"

            
        from system.postrouter import postrouter
        self.cookie=self.headers.get("cookie")
        postrouter(self)
        
        print("Executed in : "+str(round((time.process_time() - t)*1000,3))+" MS")
        print("-----------------------------------------------")
        

        
class staticx:
    x=0
    y="this is good y"
    session={}
    from system.io import io
    import json
    config=json.loads(io.readfile("config.json"))
    print(config)
    
  
def run(server_class=HTTPServer,  addr=staticx.config["serveraddress"], port=8000):
    server_address = (addr, port)
    print(server_address)
    httpd = server_class(server_address, start)
    print(f"Started httpd server on {addr}:{port}")
    
    httpd.serve_forever()
    
def clearterminal():
    system = platform.system()
    if system == "Windows":
        os.system('cls')
    elif system in ("Linux", "Darwin"):
        os.system('clear')
    else:
        print("\n" * 100)
    
    
def startserver(port=None, serverfunc=None):
    try:
        run(addr=args.listen, port=port if port!=None else args.port)
    except KeyboardInterrupt:
        print('SERVER STOPPED BY KEYBOARD STOP SIGNAL')
        try:
            clearterminal()
            print("Server Stopped")
            sys.exit(130)
        except SystemExit:
            os._exit(130)
            

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="RUN OVLINE")
    parser.add_argument("-l","--listen", default="localhost", help="Default = localhost")
    parser.add_argument("-p","--port",type=int,default=staticx.config["port"], help="Default port = 8000")
    parser.add_argument("-dbms", "--dbms", action='store_true',  help="Activate Builtin DBMS (Database Management Server)")
    args = parser.parse_args()
    
    clearterminal()
    from system import staticfilebuilder
    staticfilebuilder.staticfilebuilder.buildfiles()
    
    if args.dbms:
        import threading
        _thread= threading.Thread(target=startserver,args={staticx.config["dbmsport"]  })
        _thread.start()
        
    startserver()



