import requests
import datetime
from typing import (Literal, Optional)
import re

from ..utils.db_controller import db_init
from ..utils.db_controller import (temp_hum_DB, hum_DB, events_DB)
from ..utils import logger
from .config_handler import (AUTH_TOKEN, DEBUG_MODE)


class Sensor:
    def __init__(self, sensor_type: Literal["temp_hum", "hum", "watering"]) -> None:
        self.sensor_type: Literal["temp_hum", "hum", "watering"] = sensor_type

    def get_type(self) -> Literal["temp_hum", "hum", "watering"]:
        return self.sensor_type


class WindowDrive(Sensor):
    def __init__(self) -> None:
        self.state: bool = False

    def get_state(self) -> bool:
        return self.state

    def toggle(self, state: Literal["open", "close"] | None = None) -> int:
        request_url = "https://dt.miet.ru/ppo_it/api/fork_drive"

        _state = (1 if state == "open" else 0) if state else (1 if self.get_state()^True else 0)
        request_params = {
            "X-Auth-Token": AUTH_TOKEN,
            "state": _state
        }

        response: requests.Response = requests.patch(
            url=request_url, params=request_params)

        if response.status_code != 200:
            return response.status_code

        if state is None:
            self.state ^= True
        else:
            self.state = bool(_state)

        return 200


class TotalHumSensor(Sensor):
    def __init__(self) -> None:
        self.state: bool = False

    def get_state(self) -> bool:
        return self.state

    def toggle(self, state: Literal["on", "off"] | None = None) -> int:
        request_url = "https://dt.miet.ru/ppo_it/api/total_hum"

        _state = (1 if state == "on" else 0) if state else (1 if self.get_state()^True else 0)
        request_params = {
            "X-Auth-Token": AUTH_TOKEN,
            "state": int(state) or (1 if self.get_state() else 0) # type: ignore
        }

        response: requests.Response = requests.patch(
            url=request_url, params=request_params)

        if response.status_code != 200:
            return response.status_code

        if state is None:
            self.state ^= True
        else:
            self.state = bool(_state)
        
        return 200


class TempHumSensor(Sensor):
    def __init__(self, id: int) -> None:
        self.id: int = id
        self.temperature: Optional[int] = None
        self.humidity: Optional[int] = None

    def get_data(self) -> dict:
        return {
            "id": self.id,
            "temperature": self.temperature,
            "humidity": self.humidity
        }

    def update_data(self) -> int:
        request_url = f"https://dt.miet.ru/ppo_it/api/temp_hum/{self.id}"

        request_params = {
            "X-Auth-Token": AUTH_TOKEN,
        }

        response: requests.Response = requests.get(url=request_url, params=request_params)

        if response.status_code != 200:
            return response.status_code

        response_json = response.json()

        self.temperature = response_json["temperature"]
        self.humidity = response_json["humidity"]

        return 200


class HumSensor(Sensor):
    def __init__(self, id: int) -> None:
        self.id: int = id
        self.humidity: Optional[int] = None

    def get_data(self) -> dict:
        return {
            "id": self.id,
            "humidity": self.humidity
        }

    def update_data(self) -> int:
        request_url = f"https://dt.miet.ru/ppo_it/api/hum/{self.id}"

        request_params = {
            "X-Auth-Token": AUTH_TOKEN,
        }

        response: requests.Response = requests.get(url=request_url,params=request_params)

        if response.status_code != 200:
            return response.status_code

        response_json = response.json()

        self.humidity = response_json["humidity"]
        return 200


class WateringSensor(Sensor):
    def __init__(self, id: int) -> None:
        self.id: int = id
        self.state: bool = False

    def get_state(self) -> bool:
        return self.state

    def toggle(self, state: Literal["on", "off"] | None = None) -> int:
        request_url = "https://dt.miet.ru/ppo_it/api/watering"

        _state = (1 if state == "on" else 0) if state else (1 if self.get_state()^True else 0)
        request_params = {
            "X-Auth-Token": AUTH_TOKEN,
            "id": self.id,
            "state": _state
        }

        response: requests.Response = requests.patch(
            url=request_url, params=request_params)

        if response.status_code != 200:
            return response.status_code

        if state is None:
            self.state ^= True
        else:
            self.state = bool(state)

        return 200


class SensorsPool:
    def __init__(self) -> None:
        db_init() # init database

        self.__sensors_pool = {}  # init sensors pool dict

        self.fork_drive = WindowDrive()  # fork drive
        self.total_hum = TotalHumSensor()  # global watering

        self.__sensors_pool["temp_hum"] = []  # air temperature and humidity
        self.__sensors_pool["hum"] = []  # soil humidity
        self.__sensors_pool["watering"] = []  # soil watering

    def __get_pool(self, pool_name: Literal["temp_hum", "hum", "watering"]) -> list:
        return self.__sensors_pool[pool_name]

    def __get_next_id(self, sensors_pool_name: Literal["temp_hum", "hum", "watering"]) -> int:
        return len(self.__get_pool(sensors_pool_name))+1 if type(self.__get_pool(sensors_pool_name)) is list else 0 # type: ignore

    def connect_sensor(self, sensor: Sensor) -> None:
        """
        Connect new sensor
        WARNING:
        (used only internally, deprecated because there is no need to allow the addition of new sensors in runtime)
        """
        sensor_type = sensor.get_type()
        id = self.__get_next_id(sensor_type)
        if sensor_type == "temp_hum":
            self.__sensors_pool[sensor_type].insert(id-1, TempHumSensor(id))
        elif sensor_type == "hum":
            self.__sensors_pool[sensor_type].insert(id-1, HumSensor(id))
        elif sensor_type == "watering":
            self.__sensors_pool[sensor_type].insert(id-1, WateringSensor(id))
        if DEBUG_MODE: logger.debug(f"connected {sensor_type} sensor")

    def update_temp_hum(self) -> None:
        """
        Add new temp_hum entry to database
        """
        temp_hum_pool = self.__get_pool("temp_hum")
        temp = []
        hum = []
        for sensor in temp_hum_pool:
            response = sensor.update_data()

            data = sensor.get_data()
            temp.append(data["temperature"] if response == 200 else None)
            hum.append(data["humidity"] if response == 200 else None)

        temp_hum_DB.add_entry(temp, hum)
        if DEBUG_MODE: logger.debug("temp_hum updated")

    def get_data_temp_hum(self, period: str) -> list:
        """
        Get temp_hum entries by period:
        
        Allowed examples of period format:
        "30s", "1m", "1h", "3h", "12h", "3D", "1M", "1Y"
        """
        export = temp_hum_DB.get_data_in_period(period)
        if DEBUG_MODE: logger.debug(f"fetched {len(export)} rows from temp_hum in {period}")
        return export

    def update_hum(self) -> None:
        """
        Add new hum entry to database
        """
        hum_pool = self.__get_pool("hum")
        hum = []
        for sensor in hum_pool:
            response = sensor.update_data()

            data = sensor.get_data()
            hum.append(data["humidity"] if response == 200 else None)

        hum_DB.add_entry(hum)
        if DEBUG_MODE: logger.debug("hum updated")

    def get_data_hum(self, period: str) -> list:
        """
        Get hum entries by period:
        
        Allowed examples of period format:
        "30s", "1m", "1h", "3h", "12h", "3D", "1M", "1Y"
        """
        export = hum_DB.get_data_in_period(period)
        if DEBUG_MODE: logger.debug(f"fetched {len(export)} rows from hum in {period}")
        return export

    def get_sensor_state(self, sensor: Literal["window", "watering", "total_hum"], id: (int | None) = None) -> str:
        if sensor == "window":
            return "open" if self.fork_drive.get_state() else "closed"
        elif sensor == "watering" and id:
            return "on" if self.__get_pool("watering")[id-1] else "off"
        elif sensor == "total_hum":
            return "on" if self.total_hum.get_state() else "off"
        else:
            return "unknown"

    def change_sensor_state(self, sensor: Literal["window", "watering", "total_hum"], state: Literal["open", "close", "on", "off"], id: (int | None) = None) -> int:
        """
        Runs sensors events

        sensor      | state            | id
        "window"    | "open" / "close" | None
        "total_hum" | "on" / "off"     | None
        "watering"  | "on" / "off"     | 1-6
        """

        response = None
        if sensor == "window":
            response = self.fork_drive.toggle(state) # type: ignore
        elif sensor == "watering":
            response = self.__get_pool("watering")[id-1].toggle(state) # type: ignore
        elif sensor == "total_hum":
            response = self.total_hum.toggle(state) # type: ignore
        else:
            response = 404

        events_DB.event_entry(sensor, state, id)

        return response

    def last_date_of_event(self, sensor: Literal['window', 'watering', 'total_hum'], state: Literal["open", "close", "on", "off"], id: (int | None) = None) -> Optional[datetime.datetime]:
        """
        Get date of event (or None if event wasn't registered)
        """

        return events_DB.last_date_of_event(sensor, state, id=id)
