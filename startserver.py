import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler
from router import router

class S(BaseHTTPRequestHandler):
    # def __init__(self, *args):
    #     super(S, self).__init__(*args)
        
    def _set_headers(self):
        self.send_response(200)
        # self.send_header("Set-Cookie", "sessionId=38afes7a8")
        self.end_headers()


    def do_GET(self):
        self._set_headers()
        from system.getrouter import getrouter
        getrouter.route(self)
        

    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        # self._set_headers()
        # # self.headers
        # print("============x============")
        # print(self.headers)
        # print("============x============")
        # self.xheader=self.headers
        
        from system.postrouter import postrouter
        self.cookie=self.headers.get("cookie")
        postrouter(self)
        
        
        
class staticx:
    x=0
    y="this is good y"
    session={}
  
def run(server_class=HTTPServer, handler_class=S, addr="localhost", port=8000):
    server_address = (addr, port)
    httpd = server_class(server_address, handler_class)

    print(f"Starting httpd server on {addr}:{port}")
    from system import staticfilebuilder
    staticfilebuilder.staticfilebuilder.buildfiles()
    httpd.serve_forever()
    

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="RUN OVLINE")
    parser.add_argument(
        "-l",
        "--listen",
        default="localhost",
    )
    parser.add_argument(
        "-p",
        "--port",
        type=int,
        default=8000,
    )
    args = parser.parse_args()
    run(addr=args.listen, port=args.port)


