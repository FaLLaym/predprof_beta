import configparser

config = configparser.ConfigParser()
config.read('./config.ini')

AUTH_TOKEN = config["General"]["X-Auth-Token"]
DEBUG_MODE = config["Debug"].getboolean("enabled")

db_name = config["General"]["db-name"]
db_update_frequency_per_minute = config["General"].getint("db-update-frequency-per-minute")

preinstalled_temp_hum = config["Preinstalled"].getint("preinstalled-temp_hum") or 4
preinstalled_hum = config["Preinstalled"].getint("preinstalled-hum") or 6
preinstalled_watering = config["Preinstalled"].getint("preinstalled-watering") or 6

from ..handlers.sensors_handler import Sensor, SensorsPool
sensors_pool = SensorsPool()

for _ in range(preinstalled_temp_hum): sensors_pool.connect_sensor(Sensor("temp_hum"))
for _ in range(preinstalled_hum): sensors_pool.connect_sensor(Sensor("hum"))
for _ in range(preinstalled_watering): sensors_pool.connect_sensor(Sensor("watering"))
