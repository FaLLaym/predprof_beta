import time


from handlers.requesting import (get_t_h, get_hum, switch_window, switch_water, switch_totalHum)


# beta init getting t+h; getting hum
if __name__ == "__main__":
    while True:
        print('t+h')
        get_t_h()
        print('hum')
        get_hum()
        time.sleep(30)
