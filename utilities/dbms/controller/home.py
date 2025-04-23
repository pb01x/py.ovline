
from system.controller import controller

class home(controller):
   
    def run(self):
       
        if self.o.pars.get("tablename")!=None:
           self.__loadtable()
           return
       
        tablelist=self.Model("main","tablelist")["tablelist"]["data"]
        # x=[]
        # for item in tablelist:
        #     # print(item)
        #     x.append({"txt":item[0] , "url":"/home?table="+item[0]})
        self.output["tablelist"]=tablelist
        self.renderpage()



    def __loadtable(self):
        print("loading table")
        tablename=self.o.pars.get("tablename")
        self.output[tablename]= self.Model("main","tabledata",{"#table":tablename, "#limit":"100"  })["tabledata"]
        