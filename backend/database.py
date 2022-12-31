import sqlite3
from sqlite3 import Error
from os import listdir
from os.path import isfile, join
from .data_api import (get_t_h, get_hum)

# database_names = [f for f in listdir('../db/') if isfile(join('../db/', f))]

# for i in database_names:
def insert_data():
    connection = None
    try:
        connection = sqlite3.connect(f'../db/humidity.db')
        cursorObj = connection.cursor()
        cursorObj.executemany(f"INSERT INTO humidity VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", (get_hum(),))
        connection.commit()
        connection.close()
        return 'Good!'
    except Error as ex:
        return ex



