
from system import o


class session:
    
    # data={}
    def __init__(self,oo):
        self.roles="public"
        self.o=oo        
        self.getcookie()
        oo.req.send_response(200)
        # o.tempx["session"]+="a"

        if self.cookies.get("sessid") ==None:
            self.newPublicSession()
        elif o.o.tempx.session.get(self.cookies.get("sessid"))==None :
            self.newPublicSession()
        else:
            self.id=self.cookies.get("sessid")
            self.data=o.o.tempx.session.get(self.id)

        oo.req.end_headers()
        # oo.logx(o.o.tempx.session.get(self.id))
        
        
    def newPublicSession(self):
        import secrets
        newsessid=secrets.token_hex(256)
        self.o.req.send_header("Set-Cookie", "sessid="+newsessid)
        o.o.tempx.session[newsessid]={"role":"public"}
        self.data=o.o.tempx.session[newsessid]
        self.id=newsessid
        
    
    def getcookie(self):
        try:
            cookies=self.o.req.cookie.split(";")
            self.cookies={}
            for cookie in cookies:
                kv=cookie.split("=")
                self.cookies[kv[0].lstrip()]=kv[1]
        except Exception as e:
            self.cookies={}
            
        

        
        