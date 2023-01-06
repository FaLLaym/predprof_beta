from backend import api_parser
from backend import flask_server

from multiprocessing import Process

if __name__ == "__main__":
    parser_process = Process(target=api_parser.main)

    try:
        parser_process.start()
        flask_server.main()
        while 1:
            pass
    except KeyboardInterrupt:
        parser_process.kill()
        print("Program successfully ended")
