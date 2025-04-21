import os

class io:
    def readfile(path):
        # view/home.js
        with open(path, 'r') as file:
            data = file.read()
        return data
    
    
    def witetofile(path, str):
        f = open("public/"+path, "w")
        f.write(str)
        f.close()
                

    def readFolder(path):
        files=os.listdir(path)
        files.sort()
        txt=""
        for file in files:
            # str+=io.readfile(path+file)+"\n"
            txt+=io.readfile(path+file)+ "\n"
            
        return txt
    
    def readFolderToDic(path):
        widgets=os.listdir(path)
        widgets.sort()
        dic={}
        for widget in widgets:
            dic[widget.replace(".js","")]=io.readfile(path+widget)
        return dic