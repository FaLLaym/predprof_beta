from flask import render_template

from backend import api_parser
from backend import flask_server
import front_server

from multiprocessing import Process

if __name__ == "__main__":
    parser_process = Process(target=api_parser.main)
    server = Process(target=flask_server.main)
    frontend_server = Process(target=front_server.main)

    try:
        parser_process.start()
        server.start()
        frontend_server.start()
        while 1:
            pass
    except KeyboardInterrupt:
        parser_process.terminate()
        server.terminate()
        frontend_server.terminate()
        print("Program successfully ended")
