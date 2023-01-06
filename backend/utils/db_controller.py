import datetime
from dateutil.relativedelta import relativedelta
from typing import Literal, Tuple, Optional
import re

from .logger import logger
from ..handlers.db_init import (db, sql)
from ..handlers.config_handler import (preinstalled_temp_hum as pre_th, preinstalled_hum as pre_h)

class temp_hum_DB:
    @staticmethod
    @logger.catch
    def add_entry(temp: list[float | None], hum: list[float | None], t_avg: (float | None) = None, h_avg: (float | None) = None) -> None:
        filtered_temp: list[float] = list(filter(lambda x: x is not None, temp))  # type: ignore
        t_avg = t_avg or (0.0 if not len(filtered_temp) > 0 else round(sum(filtered_temp) / len(filtered_temp), 2))
        filtered_hum: list[float] = list(filter(lambda x: x is not None, hum))  # type: ignore
        h_avg = h_avg or (0.0 if not len(filtered_hum) > 0 else round(sum(filtered_hum) / len(filtered_hum), 2))

        sql.execute(f"""INSERT INTO temp_hum (date, {','.join(map(lambda x: f"t{x}", range(1, pre_th+1)))},
                    {','.join(map(lambda x: f"h{x}", range(1, pre_th+1)))}, t_avg, h_avg) 
                    VALUES (?,{",".join(["?"]*pre_th)},{",".join(["?"]*pre_th)},?,?)""",
                    [datetime.datetime.now(), *temp, *hum, t_avg, h_avg])
        db.commit()

    @staticmethod
    @logger.catch
    def get_data_in_period(period: str) -> list:
        def __snap_back(__period: str) -> Tuple[datetime.datetime, int]: # so sad there are no regex type annotations...
            """
            "30s", "1m", "5m", "10m", "30m", "1h", "3h", "6h", "12h", "1D", "3D", "7D", "1M", "3M", "6M", "1Y"
            """
            period_type = re.sub(r"^[\d]+", "", __period)
            period_time = int(re.sub(r"[\w]$", "", __period))

            if period_type == "s":
                return (datetime.datetime.now() - datetime.timedelta(seconds=period_time), 1)
            elif period_type == "m":
                return (datetime.datetime.now() - datetime.timedelta(minutes=period_time), 1)
            elif period_type == "h":
                return (datetime.datetime.now() - datetime.timedelta(hours=period_time), 1*period_time)
            elif period_type == "D":
                return (datetime.datetime.now() - datetime.timedelta(days=period_time), 24*period_time)
            elif period_type == "M":
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

        export = sql.execute(
            f"SELECT * FROM temp_hum WHERE date BETWEEN ? AND ? AND ROWID > 0 AND ROWID % ? = 0 ORDER BY date DESC",
            [snapback, now, divis]).fetchall()

        return export


class hum_DB:
    @staticmethod
    @logger.catch
    def add_entry(hum: list[float | None], h_avg: (float | None) = None) -> None:
        filtered_hum: list[float] = list(
            filter(lambda x: x is not None, hum))  # type: ignore
        h_avg = h_avg or (0.0 if not len(
            filtered_hum) > 0 else round(sum(filtered_hum) / len(filtered_hum), 2))

        sql.execute(f"""INSERT INTO hum (date, {','.join(map(lambda x: f"h{x}", range(1, pre_h+1)))}, h_avg) VALUES (?,{",".join(["?"]*pre_h)},?)""",
            [datetime.datetime.now(), *hum, h_avg])
        db.commit()

    @staticmethod
    @logger.catch
    def get_data_in_period(period: str) -> list:
        def __snap_back(__period: str) -> Tuple[datetime.datetime, int]: # so sad there are no regex type annotations...
            """
            "30s", "1m", "5m", "10m", "30m", "1h", "3h", "6h", "12h", "1D", "3D", "7D", "1M", "3M", "6M", "1Y"
            """
            period_type = re.sub(r"^[\d]+", "", __period)
            period_time = int(re.sub(r"[\w]$", "", __period))

            if period_type == "s":
                return (datetime.datetime.now() - datetime.timedelta(seconds=period_time), 1)
            elif period_type == "m":
                return (datetime.datetime.now() - datetime.timedelta(minutes=period_time), 1)
            elif period_type == "h":
                return (datetime.datetime.now() - datetime.timedelta(hours=period_time), 1*period_time)
            elif period_type == "D":
                return (datetime.datetime.now() - datetime.timedelta(days=period_time), 24*period_time)
            elif period_type == "M":
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

        export = sql.execute(
            "SELECT * FROM hum WHERE date BETWEEN ? AND ? AND ROWID > 0 AND ROWID % ? = 0 ORDER BY date DESC", 
            [snapback, now, divis]).fetchall()

        return export


class events_DB:
    @staticmethod
    @logger.catch
    def event_entry(sensor_name: Literal["window", "watering", "total_hum"] | str, state: str, id: (int | None) = None) -> None:
        if id: sensor_name += f"{id}"

        sql.execute("INSERT INTO events (date, type, state_data) VALUES (?,?,?)", [datetime.datetime.now(), sensor_name, state])
        db.commit()

    @staticmethod
    @logger.catch
    def last_date_of_event(sensor_name: Literal["window", "watering", "total_hum"] | str, state: str, id: (int | None) = None) -> Optional[datetime.datetime]:
        if id: sensor_name += f"{id}"

        date = sql.execute("SELECT date FROM events WHERE type = ? AND state_data = ? ORDER BY date DESC", [sensor_name, state]).fetchone()

        if date:
            return datetime.datetime.strptime(date[0], "%Y-%m-%d %H:%M:%S.%f")
