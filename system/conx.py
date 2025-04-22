
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
            
    def fetch(self, q):
        try:
            cursor = self.con.cursor()
            cursor.execute(q)
            data={}
            data["name"]=[description[0] for description in cursor.description]
            data["data"]=cursor.fetchall()
            return data
        except sqlite3.Error as e:
            print(f"Error fetching data: {e}")
            return None