
from system.controller import controller

class home(controller):
   
    def run(self):
       
        if self.o.urlpars.get("table")!=None:
           self.__loadtable()
       
        tablelist=self.Model("main","tablelist")["tablelist"]["data"]
        x=[]
        for item in tablelist:
            # print(item)
            x.append({"txt":item[0] , "url":"/home?table="+item[0]})
        self.output["tablelist"]=x



    def __loadtable(self):
        print("loading table")