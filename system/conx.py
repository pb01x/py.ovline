
import sqlite3

class conx():
    def __init__(self, o):
        self.o=o
        self.con=sqlite3.connect("../ovline.db")
        
        
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
            rows = cursor.fetchall()
            return rows
        except sqlite3.Error as e:
            print(f"Error fetching data: {e}")
            return None