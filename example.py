# This file represents an example of using the SensorsPool

from backend.handlers import sensors_pool
from backend import api_parser

from multiprocessing import Process
from time import sleep as wait

if __name__ == "__main__":
    parser_process = Process(target=api_parser.main)
    try:
        parser_process.start()

        # get window state
        print(sensors_pool.get_sensor_state(sensor="window"))
        # change window state
        response = sensors_pool.change_sensor_state(sensor="window", state="close")
        print(response) # 200
        print(sensors_pool.get_sensor_state(sensor="window")) # window state changed to open

        response = sensors_pool.change_sensor_state(sensor="watering", state="on", id=1)
        print(response) # 200

        print("3 SECONDS IDLING")
        wait(3)

        event_date = sensors_pool.last_date_of_event(sensor="window", state="close")
        print(event_date) # date 3 seconds ago

        event_date = sensors_pool.last_date_of_event(sensor="watering", state="on", id=6)
        print(event_date) # None, because this event wasn't registered yet (unless you have an old database)

        # getting length of (3600 max per request) rows of temp_hum data for the last 15 minutes
        print(len(sensors_pool.get_data_temp_hum("15m")))
        # getting length of (3600 max per request) rows of hum data for the last 30 seconds
        print(len(sensors_pool.get_data_hum("30s")))
        
        # simulating a process
        print("Press Ctrl + C to exit the program")
        while 1:
            input()

    except KeyboardInterrupt:
        # stop the api_parser
        parser_process.kill()
        print("Program exit")
