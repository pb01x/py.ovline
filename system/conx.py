
import sqlite3
from start import staticx
class conx():
    def __init__(self, o):
        self.o=o
        self.con=sqlite3.connect(staticx.config["dbpath"])
        
        
    def execute(self, q):
        try:
            cursor = self.con.cursor()
            cursor.execute(q)
            self.con.commit()
            
        except sqlite3.Error as e:
            print(f"Error executing query: {e}")
            
            
    def dict_factory(cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d


    def fetch(self, q,pdata,dictionary=False):
        try:
            
            if dictionary:
                self.con.row_factory=conx.dict_factory
                
            cursor = self.con.cursor()
            if pdata!=None:
                cursor.execute(q,pdata)
            else:
                cursor.execute(q)
                
            if q.find("Insert")!=-1 or q.find("INSERT")!=-1:
                self.con.commit()
                return cursor.lastrowid
                
            if dictionary:
                return cursor.fetchall()
                
            data={}
            data["name"]=[description[0] for description in cursor.description]
            data["data"]=cursor.fetchall()
            return data
        except sqlite3.Error as e:
            print(f"Error fetching data: {e}")
            return None