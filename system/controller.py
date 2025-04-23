

class controller:
    def __init__(self,o):
        self.o=o
        self.output=o.output
        self.db=None
        self.pars=self.o.pars
    
    
    def test(self, msg):
        print(msg)
        print("this is controller main class")
        
    
    def connectdb(self):
        if self.db==None:
            from system.conx import conx
            self.db= conx(self.o)
        
        
    def execute(self,q):
        self.connectdb()
        return self.db.execute(q)
        
    
    def fetch(self,q):
        self.connectdb()
        return self.db.fetch(q)
        
        
    def Model(self,path,nodes, data=None):
        from system.model import model
        return model(o=self.o, path=path,nodes= nodes.split(","),data=data).output
        
        
       
    def renderpage(self):
        self.o.renderpage=True