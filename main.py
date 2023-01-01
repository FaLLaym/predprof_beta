import time

# import functions from the database directory
from backend.database import (insert_humidity_data, insert_tempohum_data, clear_all_data)


# init databases that parse the data from API`S
if __name__ == "__main__":
    clear_all_data()
    while True:
        insert_tempohum_data()
        insert_humidity_data()
        time.sleep(5)

