
from system.io import io
import json

class model:
    def __init__(self, o, path, nodes):
        self.o=o
        self.db=None
        self.path=path
        self.nodes=nodes
        self.allnodes=json.loads(io.readfile("model/"+path+".json"))
        # self.o.logx(self.nodes[node])
        output={}
        self.output=output
        if isinstance(nodes,str):
            output[nodes]=self.getData(nodes)
        else:
            for node in nodes:
                # output.append(self.getData(node))
                output[node]=self.getData(node)
            
        self.output=output
        
    def connectdb(self):
        if self.db==None:
            from system.conx import conx
            self.db= conx(self.o)
        
    def getData(self,node):
        rawnode=self.allnodes[node]
        self.connectdb()
        query=rawnode["query"]
        query=self.insertSubquery(rawnode,query)
        return self.db.fetch(query)
        
        
        
    def insertSubquery(self,rawnode,query):
        startX=query.find("#")
        if startX==-1:
            return query
        endX=query.find(" ",startX)
        xvar=query[startX:endX]
        print(xvar)
        query= query.replace(xvar,rawnode[xvar])
        return self.insertSubquery(rawnode,query)
        
        
        
        
    
