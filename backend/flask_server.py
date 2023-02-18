from flask import (Flask, Response, abort, request)
from flask_restful import (Api, Resource)
from flask_cors import CORS
from typing import (Literal, Any)
import re
import json
import datetime

from .handlers import sensors_pool
from .handlers.config_handler import (preinstalled_watering as pre_w, preinstalled_temp_hum as pre_th, preinstalled_hum as pre_h)
from .handlers.config_handler import DEBUG_MODE

from .utils import (db_controller, logger)

app = Flask(__name__)
CORS(app)
api = Api(app)

class SensorState:
    class GetState(Resource):
        def get(self, sensor: Literal["window", "watering", "total_hum"]) -> dict[str, Any]:
            args = request.args

            export = {}
            if sensor in ["window", "total_hum"]:
                export["state"] = sensors_pool.get_sensor_state(sensor)

            elif sensor == "watering":
                if not "id" in args or args["id"] is None:
                    abort(Response("Param \"id\" was not specified", status=400))
                try:
                    id = args["id"]
                    if not id.isdigit():
                        raise IndexError
                    id = int(id)
                    if not 0 < id <= pre_w:
                        raise IndexError

                    export["state"] = sensors_pool.get_sensor_state(sensor, id)
                except IndexError:
                    abort(Response("Unknown id", status=404))
            else:
                abort(Response("Unknown sensor type", status=404))

            return export
    

    class ChangeState(Resource):
        def post(self, sensor: Literal["window", "watering", "total_hum"], state: Literal["open", "close", "on", "off"]) -> Response:
            args = request.args

            status = None
            if sensor in "window":
                if state not in ["open", "close"]:
                    abort(Response("Wrong state", status=400))

                status = sensors_pool.change_sensor_state(sensor, state)

            elif sensor == "total_hum":
                if state not in ["on", "off"]:
                    abort(Response("Wrong state", status=400))

                status = sensors_pool.change_sensor_state(sensor, state)

            elif sensor == "watering":
                if not "id" in args or args["id"] is None:
                    abort(Response("Param \"id\" was not specified", status=400))
                if state not in ["on", "off"]:
                    abort(Response("Wrong state", status=400))

                try:
                    id = args["id"]
                    if not id.isdigit():
                        raise IndexError
                    id = int(id)
                    if not 0 < id <= pre_w:
                        raise IndexError

                    status = sensors_pool.change_sensor_state(sensor, state, id)
                except IndexError:
                    abort(Response("Unknown id", status=404))
            else:
                abort(Response("Unknown sensor type", status=404))
            
            return Response("Request passed with status {status}",status=status)
    

    class LastStateChange(Resource):
        def get(self, sensor: Literal["window", "watering", "total_hum"], state: Literal["open", "close", "on", "off"]) -> dict[str, Any]:
            args = request.args
            
            export = {}
            if sensor == "window":
                if state not in ["open", "close"]:
                    abort(Response("Wrong state", status=400))

                date = sensors_pool.last_date_of_event(sensor, state) 
                export["date"] = f"{date}" if date else "null"

            elif sensor == "total_hum":
                if state not in ["on", "off"]:
                    abort(Response("Wrong state", status=400))

                date = sensors_pool.last_date_of_event(sensor, state)
                export["date"] = f"{date}" if date else "null"

            elif sensor == "watering":
                if not "id" in args or args["id"] is None:
                    abort(Response("Param \"id\" was not specified", status=400))
                if state not in ["on", "off"]:
                    abort(Response("Wrong state", status=400))
                
                try:
                    id = args["id"]
                    if not id.isdigit():
                        raise IndexError
                    id = int(id)
                    if not 0 < id <= pre_w:
                        raise IndexError

                    date = sensors_pool.last_date_of_event(sensor, state, id)
                    export["date"] = f"{date}" if date else "null"
                except IndexError:
                    abort(Response("Unknown id", status=404))
            else:
                abort(Response("Unknown sensor type", status=404))
            
            return export


api.add_resource(SensorState.GetState, "/api/sensor/<string:sensor>/get-state", endpoint="get_sensor_state")
api.add_resource(SensorState.ChangeState, "/api/sensor/<string:sensor>/change-state/<string:state>", endpoint="change_sensor_state")
api.add_resource(SensorState.LastStateChange, "/api/sensor/<string:sensor>/last-state-change/<string:state>", endpoint="last_state_change")


class TempHum:
    class GetData(Resource):
        def get(self) -> Response:
            args = request.args

            export = {}

            if not "t" in args or args["t"] is None:
                data = sensors_pool.get_data_temp_hum("1m")
                export["data"] = data if data else "null"
            elif re.match(r"^[\d]+[a-zA-Z]$", args["t"]):
                try:
                    period_n = re.search(r"^[\d]+",args["t"])
                    period_l = re.search(r"[a-zA-Z]$",args["t"])

                    if not period_n or not period_l:
                        raise IndexError
                    period_n, period_l = period_n[0], period_l[0]

                    if not period_n.isdigit() or int(period_n) <= 0:
                        raise IndexError
                    if period_l not in ["s", "m", "h", "D", "M", "Y"]:
                        raise IndexError

                    data = sensors_pool.get_data_temp_hum(f"{period_n}{period_l}")
                    export["data"] = data if data else "null"
                except IndexError:
                    abort(Response("Wrong t param format", status=400))

            else:
                abort(Response("Wrong t param format", status=400))

            return Response(json.dumps(export), status=200, mimetype="application/json")

    class AddData(Resource):
        def post(self) -> Response:
            if not request.is_json:
                abort(Response("No JSON data in request", status=400))

            try:
                content = json.loads(str(request.get_data(), encoding="utf-8").replace("'", "\""))
                print(content)
            except:
                abort(Response("Wrong JSON", status=400))

            if not content:
                abort(Response("JSON is empty", status=400))

            export = {"date": None, "temp": [], "hum": [], "t_avg": None, "h_avg": None}

            if not "date" in content:
                abort(Response("JSON must contain \"date\" field", status=400))

            try:
                export["date"] = datetime.datetime.strptime(content["date"], '%Y-%m-%dT%H:%M:%S.%fZ')
            except:
                abort(Response(r"Wrong date format, should be %Y-%m-%dT%H:%M:%S.%fZ", status=400))

            if "t" in content:
                temps = content["t"]
                if not len(temps) == 0 and len(temps) != pre_th:
                    abort(Response("\"t\" needs a full list of data or NULL", status=400))

                for t in temps:
                    if not type(t) in (None, int, float): 
                        abort(Response("Wrong \"t\" data datatype", status=400))

                export["temp"] = temps

            if "h" in content:
                hums = content["h"]
                if not len(hums) == 0 and len(hums) != pre_th:
                    abort(Response("\"h\" needs a full list of data or NULL", status=400))

                for h in hums:
                    if not type(h) in (None, int, float):
                        abort(Response("Wrong \"h\" data datatype", status=400))

                export["hum"] = hums

            t_avg = None
            if "t_avg" in content:
                t_avg = content["t_avg"]
                if not type(t_avg) in (None, int, float):
                    abort(Response("Wrong \"t_avg\" data datatype", status=400))
                export["t_avg"] = t_avg

            h_avg = None
            if "h_avg" in content:
                h_avg = content["h_avg"]
                if not type(h_avg) in (None, int, float):
                    abort(Response("Wrong \"h_avg\" data datatype", status=400))
                export["h_avg"] = h_avg

            db_controller.temp_hum_DB.add_entry(**export)
            if DEBUG_MODE: logger.debug("added custom entry to temp_hum")

            return Response("success", status=200)


api.add_resource(TempHum.GetData, "/api/temp_hum/get-data", endpoint="get_temp_hum_data")
api.add_resource(TempHum.AddData, "/api/temp_hum/add-data", endpoint="add_temp_hum_data")


class Hum:
    class GetData(Resource):
        def get(self) -> Response:
            args = request.args

            export = {}

            if not "t" in args or args["t"] is None:
                data = sensors_pool.get_data_hum("1m")
                export["data"] = data if data else "null"
            elif re.match(r"^[\d]+[a-zA-Z]$", args["t"]):
                try:
                    period_n = re.search(r"^[\d]+",args["t"])
                    period_l = re.search(r"[a-zA-Z]$",args["t"])

                    if not period_n or not period_l:
                        raise IndexError
                    period_n, period_l = period_n[0], period_l[0]

                    if not period_n.isdigit() or int(period_n) <= 0:
                        raise IndexError
                    if period_l not in ["s", "m", "h", "D", "M", "Y"]:
                        raise IndexError

                    data = sensors_pool.get_data_hum(f"{period_n}{period_l}")
                    export["data"] = data if data else "null"
                except IndexError:
                    abort(Response("Wrong t param format", status=400))

            else:
                abort(Response("Wrong t param format", status=400))

            return Response(json.dumps(export), status=200, mimetype="application/json")

    class AddData(Resource):
        def post(self) -> Response:
            if not request.is_json:
                abort(Response("No JSON data in request", status=400))

            try:
                content = json.loads(str(request.get_data(), encoding="utf-8").replace("'", "\""))
                print(content)
            except:
                abort(Response("Wrong JSON", status=400))

            if not content:
                abort(Response("JSON is empty", status=400))

            export = {"date": None, "hum": [], "h_avg": None}

            if not "date" in content:
                abort(Response("JSON must contain \"date\" field", status=400))

            try:
                export["date"] = datetime.datetime.strptime(content["date"], '%Y-%m-%dT%H:%M:%S.%fZ')
            except:
                abort(Response(r"Wrong date format, should be %Y-%m-%dT%H:%M:%S.%fZ", status=400))

            if "h" in content:
                hums = content["h"]
                if not len(hums) == 0 and len(hums) != pre_h:
                    abort(Response("\"h\" needs a full list of data or NULL", status=400))

                for h in hums:
                    if not type(h) in (None, int, float):
                        abort(Response("Wrong \"h\" data datatype", status=400))

                export["hum"] = hums

            h_avg = None
            if "h_avg" in content:
                h_avg = content["h_avg"]
                if not type(h_avg) in (None, int, float):
                    abort(Response("Wrong \"h_avg\" data datatype", status=400))
                export["h_avg"] = h_avg

            db_controller.hum_DB.add_entry(**export)
            if DEBUG_MODE: logger.debug("added custom entry to hum")

            return Response("success", status=200)


api.add_resource(Hum.GetData, "/api/hum/get-data", endpoint="get_hum_data")
api.add_resource(Hum.AddData, "/api/hum/add-data", endpoint="add_hum_data")


def main() -> None:
    app.run(debug=DEBUG_MODE)
