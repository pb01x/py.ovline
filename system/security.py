


class security:
    def __init__(self, o):
          self.o = o
    def pageroles_permission(self,pagelayout):
        rolesx=pagelayout.split("_.roles")[1]
        rolesx=rolesx[0:rolesx.find(";")].replace("=","").replace("\"","").split(",")
        roles={}
        for role in rolesx:
                mrole=role.split(":")
                roles[mrole[0].lstrip()]=mrole[1]
        
        # print(roles.get("public"))
        
        userRole=self.o.session.data["role"]
        
        if roles.get(userRole)=="current":
            return 1
              
        return 0
   
   