import time


from backend.data_api import (get_t_h, get_hum, switch_window, switch_water, switch_totalHum)
from backend.graphics import draw_graph_humidity
from backend.database import insert_data


# beta init getting t+h; getting hum
if __name__ == "__main__":
    while True:
        print(insert_data())
        time.sleep(30)

