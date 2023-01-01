import sqlite3
from sqlite3 import Error
from os import listdir
from os.path import isfile, join
from .data_api import (get_t_h, get_hum)

# we don`t need it now, but it is a very convenient thing
# database_names = [f for f in listdir('../db/') if isfile(join('../db/', f))]

# creating the var
connection = None


# setting connection with databases
def set_connection(filename):
    global connection
    try:
        connection = sqlite3.connect(f'db/{filename}.db')
    except Error as ex:
        return False
    return connection


# parse humidity data from API and insert it into database
def insert_humidity_data():
    if set_connection('humidity'):
        try:
            cur = connection.cursor()
            cur.executemany(f"INSERT INTO humidity VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", (get_hum(),))
            connection.commit()
            connection.close()
        except Error as ex:
            pass


# parse t+h data from API and insert it into database
def insert_tempohum_data():
    if set_connection('tempohum'):
        try:
            cur = connection.cursor()
            cur.executemany(f"INSERT INTO tempohum VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (get_t_h(),))
            connection.commit()
            connection.close()
        except Error as ex:
            pass


# starts with the program and cleans all the remaining data
def clear_all_data():
    if set_connection('humidity'):
        cursor = connection.cursor()
        sql_delete_query = """DELETE from humidity"""
        cursor.execute(sql_delete_query)
        connection.commit()
        connection.close()

    if set_connection('tempohum'):
        cursor = connection.cursor()
        sql_delete_query = """DELETE from tempohum"""
        cursor.execute(sql_delete_query)
        connection.commit()
        connection.close()