
from system.controller import controller

class home(controller):
    
    def run(self):
        print("controller has been run")
        self.output["test"]={"e":"EVAN"}
     
        # self.output["fsheet"]= self.fetch("SELECT * FROM fsheet limit 10")
        self.output["testfsheet"] = self.Model("test","fsheetx,fsheety")
        

    def directCall(self):
        print("direct methods has been called")
        self.output["directcalldata"] = self.Model("test","nepsedata")
        
        
    def __testx(self):
        self.output["privatemethoddata"] = self.Model("test","nepsedata")
            
        
        