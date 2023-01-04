# This file represents an example of using the sensors_pool

from backend.handlers import sensors_pool
from backend.handlers.config_handler import db_update_frequency_per_minute

import time

if __name__ == "__main__":
    try:
        while 1:
            start = time.time()

            # update data from temp_hum api
            sensors_pool.update_temp_hum()
            # update data from hum api
            sensors_pool.update_hum()

            delta = time.time() - start
            if delta < 60 / db_update_frequency_per_minute:
                time.sleep(delta)
    except KeyboardInterrupt:
        pass
    
    # TODO update run_event and assign separate functions for each sensor
    # opening window
    sensors_pool.run_event("window", {"state": "open"})
    # getting the date when we opened the window
    print(sensors_pool.last_date_of_event("window", {"state": "open"}))
    # turning on the watering1
    sensors_pool.run_event("watering1", {"state": "on"})
    # getting None because we didn't register the event of watering1 turning off
    print(sensors_pool.last_date_of_event("watering1", {"state": "off"}))
    # we didn't register the event of watering6 turning on either
    print(sensors_pool.last_date_of_event("watering6", {"state": "on"}))

    # getting length of all (3600 maximum per request) rows of data for the last 30 minutes
    print(len(sensors_pool.get_data_temp_hum("30m")))
