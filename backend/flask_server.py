from flask import Flask, Response, abort, request
from flask_restful import Api, Resource
from typing import Literal, Any
import re
import json

from .handlers import sensors_pool
from .handlers.config_handler import (preinstalled_watering as pre_w)
from .handlers.config_handler import DEBUG_MODE

app = Flask(__name__)
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


class Data:
    class TempHum(Resource):
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


    class Hum(Resource):
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


api.add_resource(Data.TempHum, "/api/temp_hum/get-data", endpoint="get_temp_hum_data")
api.add_resource(Data.Hum, "/api/hum/get-data", endpoint="get_hum_data")


def main() -> None:
    app.run(debug=DEBUG_MODE)
