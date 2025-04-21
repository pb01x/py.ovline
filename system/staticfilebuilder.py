import os
from system.io import io

class staticfilebuilder():
    def __init__(self, *args):
        super(staticfilebuilder, self).__init__(*args)
            

    def buildfiles():
        io.witetofile("main.js",io.readFolder("mainjs/")+" "+staticfilebuilder.buildwidgetjs() )
        io.witetofile("main.css",io.readFolder("maincss/"))


    def buildwidgetjs():
        files=os.listdir("widgets/")
        outx=""
        for widget in files:
            # print(widget.replace(".js",""))
            outx += widget.replace(".js","") + ":(_,data)=>{" + io.readfile("widgets/"+widget) + "},"
        return "const widx={" + outx + "};"
         
            
    

       
    
   
        