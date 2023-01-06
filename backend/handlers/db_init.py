import sqlite3

from ..utils import logger
from .config_handler import (db_name, DEBUG_MODE)
from .config_handler import (preinstalled_temp_hum as pre_th, preinstalled_hum as pre_h)

db, sql = None, None
try:
    db = sqlite3.connect(f"./backend/utils/db/{db_name}", check_same_thread=False)
except sqlite3.DatabaseError:
    raise Exception("db-name in config.ini is incorrect")

sql = db.cursor()
sql.execute(
    f"""CREATE TABLE IF NOT EXISTS temp_hum (
        id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT,
        date DATETIME NOT NULL,
        {",".join(map(lambda x: f"t{x} REAL", range(1,pre_th+1)))},
        {",".join(map(lambda x: f"h{x} REAL", range(1,pre_th+1)))},
        t_avg REAL,
        h_avg REAL
    )""")

sql.execute(
    f"""CREATE TABLE IF NOT EXISTS hum (
        id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT,
        date DATETIME NOT NULL,
        {",".join(map(lambda x: f"h{x} REAL", range(1,pre_h+1)))},
        h_avg REAL
    )""")

sql.execute(
    "CREATE TABLE IF NOT EXISTS events (" \
        "id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT," \
        "date DATETIME NOT NULL," \
        "type TEXT NOT NULL," \
        "state_data TEXT NOT NULL" \
    ")")

db.commit()
if DEBUG_MODE: logger.debug("DB initialized")
