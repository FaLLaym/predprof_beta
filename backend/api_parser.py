from .handlers import sensors_pool
from .handlers.config_handler import db_update_frequency_per_minute

from time import sleep as wait

def main() -> None:
    while 1:
            sensors_pool.update_temp_hum()
            sensors_pool.update_hum()

            wait(60 / db_update_frequency_per_minute)
