from .handlers import sensors_pool
from .handlers.config_handler import db_update_frequency_per_minute

from time import time as clock, sleep as wait

def main() -> None:
    while 1:
            start = clock()

            sensors_pool.update_temp_hum()
            sensors_pool.update_hum()

            delta = clock() - start
            if delta < 60 / db_update_frequency_per_minute:
                wait(delta)
