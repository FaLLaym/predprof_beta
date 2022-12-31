# there will be a js + eel connection

import sqlite3
from predprof_beta.backend.data_api import get_hum
connection = sqlite3.connect('../db/humidity.db')
cursorObj = connection.cursor()
cursorObj.executemany(f"INSERT INTO humidity VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", (get_hum(),))
connection.commit()
connection.close()

