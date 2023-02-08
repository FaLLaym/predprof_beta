import datetime
from dateutil.relativedelta import relativedelta
from typing import Literal, Tuple, Optional
import re

from .logger import logger
from ..handlers.db_init import (db, sql)
from ..handlers.config_handler import (preinstalled_temp_hum as pre_th, preinstalled_hum as pre_h)

from sqlite3 import OperationalError

class temp_hum_DB:
    @staticmethod
    def add_entry(temp: list[float | None], hum: list[float | None], t_avg: (float | None) = None, h_avg: (float | None) = None) -> None:
        filtered_temp: list[float] = list(filter(lambda x: x is not None, temp))  # type: ignore
        t_avg = t_avg or (0.0 if not len(filtered_temp) > 0 else round(sum(filtered_temp) / len(filtered_temp), 2))
        filtered_hum: list[float] = list(filter(lambda x: x is not None, hum))  # type: ignore
        h_avg = h_avg or (0.0 if not len(filtered_hum) > 0 else round(sum(filtered_hum) / len(filtered_hum), 2))

        while 1: #UGLY
            try:
                sql.execute(f"""INSERT INTO temp_hum (date, {','.join(map(lambda x: f"t{x}", range(1, pre_th+1)))},
                    {','.join(map(lambda x: f"h{x}", range(1, pre_th+1)))}, t_avg, h_avg) 
                    VALUES (?,{",".join(["?"]*pre_th)},{",".join(["?"]*pre_th)},?,?)""",
                    [datetime.datetime.now().strftime("%Y-%m-%d %H-%M-%S.%f")[:23], *temp, *hum, t_avg, h_avg])
                break
            except OperationalError:
                pass
        db.commit()

    @staticmethod
    def get_data_in_period(period: str) -> list:
        def __snap_back(__period: str) -> Tuple[datetime.datetime, int]: # so sad there are no regex type annotations...
            """
            "30S", "1M", "5M", "10M", "30M", "1H", "3H", "6H", "12H", "1d", "3d", "7d", "1m", "3m", "6m", "1Y"
            """
            period_type = re.sub(r"^[\d]+", "", __period)
            period_time = int(re.sub(r"[\w]$", "", __period))

            if period_type == "S":
                return (datetime.datetime.now() - datetime.timedelta(seconds=period_time), 1)
            elif period_type == "M":
                return (datetime.datetime.now() - datetime.timedelta(minutes=period_time), 1)
            elif period_type == "H":
                return (datetime.datetime.now() - datetime.timedelta(hours=period_time), 1*period_time)
            elif period_type == "d":
                return (datetime.datetime.now() - datetime.timedelta(days=period_time), 24*period_time)
            elif period_type == "m":
                return (datetime.datetime.now() - relativedelta(month=period_time), 24*30*period_time)
            elif period_type == "Y":
                return (datetime.datetime.now() - relativedelta(years=period_time), 24*365*period_time)
            else:
                return (datetime.datetime.now() - datetime.timedelta(minutes=1), 1)

        snapback, divis = __snap_back(period)
        now = datetime.datetime.now()

        data = int(sql.execute("SELECT COUNT(date) FROM temp_hum WHERE date BETWEEN ? AND ?", [snapback, now]).fetchone()[0])
        if data <= 3600:
            divis = 1

        #TODO better way to select rows

        export = sql.execute(
            f"SELECT date, t1, t2, t3, t4, h1, h2, h3, h4, t_avg, h_avg FROM temp_hum WHERE date BETWEEN ? AND ? AND ROWID > 0 AND ROWID % ? = 0 ORDER BY date DESC",
            [snapback.strftime("%Y-%m-%d %H-%M-%S.%f")[:23], now.strftime("%Y-%m-%d %H-%M-%S.%f")[:23], divis]).fetchall() #UGLY

        return export


class hum_DB:
    @staticmethod
    def add_entry(hum: list[float | None], h_avg: (float | None) = None) -> None:
        filtered_hum: list[float] = list(
            filter(lambda x: x is not None, hum))  # type: ignore
        h_avg = h_avg or (0.0 if not len(
            filtered_hum) > 0 else round(sum(filtered_hum) / len(filtered_hum), 2))

        while 1: #UGLY
            try:
                sql.execute(f"""INSERT INTO hum (date, {','.join(map(lambda x: f"h{x}", range(1, pre_h+1)))}, h_avg) VALUES (?,{",".join(["?"]*pre_h)},?)""",
                    [datetime.datetime.now().strftime("%Y-%m-%d %H-%M-%S.%f")[:23], *hum, h_avg])
                break
            except OperationalError:
                pass
        db.commit()

    @staticmethod
    def get_data_in_period(period: str) -> list:
        def __snap_back(__period: str) -> Tuple[datetime.datetime, int]: # so sad there are no regex type annotations...
            """
            "30S", "1M", "5M", "10M", "30M", "1H", "3H", "6H", "12H", "1d", "3d", "7d", "1m", "3m", "6m", "1Y"
            """
            period_type = re.sub(r"^[\d]+", "", __period)
            period_time = int(re.sub(r"[\w]$", "", __period))

            if period_type == "S":
                return (datetime.datetime.now() - datetime.timedelta(seconds=period_time), 1)
            elif period_type == "M":
                return (datetime.datetime.now() - datetime.timedelta(minutes=period_time), 1)
            elif period_type == "H":
                return (datetime.datetime.now() - datetime.timedelta(hours=period_time), 1*period_time)
            elif period_type == "d":
                return (datetime.datetime.now() - datetime.timedelta(days=period_time), 24*period_time)
            elif period_type == "m":
                return (datetime.datetime.now() - relativedelta(month=period_time), 24*30*period_time)
            elif period_type == "Y":
                return (datetime.datetime.now() - relativedelta(years=period_time), 24*365*period_time)
            else:
                return (datetime.datetime.now() - datetime.timedelta(minutes=1), 1)
    
        snapback, divis = __snap_back(period)
        now = datetime.datetime.now()

        data = int(sql.execute("SELECT COUNT(date) FROM hum WHERE date BETWEEN ? AND ?", [snapback, now]).fetchone()[0])
        if data <= 3600:
            divis = 1

        #TODO better way to select rows

        export = sql.execute(
            "SELECT date, h1, h2, h3, h4, h5, h6, h_avg FROM hum WHERE date BETWEEN ? AND ? AND ROWID > 0 AND ROWID % ? = 0 ORDER BY date DESC", 
            [snapback.strftime("%Y-%m-%d %H-%M-%S.%f")[:23], now.strftime("%Y-%m-%d %H-%M-%S.%f")[:23], divis]).fetchall()

        return export


class events_DB:
    @staticmethod
    def event_entry(sensor_name: Literal["window", "watering", "total_hum"] | str, state: str, id: (int | None) = None) -> None:
        if id: sensor_name += f"{id}"

        while 1: #UGLY
            try:
                sql.execute("INSERT INTO events (date, type, state_data) VALUES (?,?,?)", [datetime.datetime.now().strftime("%Y-%m-%d %H-%M-%S.%f")[:23], sensor_name, state])
                break
            except OperationalError:
                pass
        db.commit()

    @staticmethod
    def last_date_of_event(sensor_name: Literal["window", "watering", "total_hum"] | str, state: str, id: (int | None) = None) -> Optional[datetime.datetime]:
        if id: sensor_name += f"{id}"

        date = sql.execute("SELECT date FROM events WHERE type = ? AND state_data = ? ORDER BY date DESC", [sensor_name, state]).fetchone()

        if date:
            return datetime.datetime.strptime(date[0]+"000", "%Y-%m-%d %H-%M-%S.%f")
