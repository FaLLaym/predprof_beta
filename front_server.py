import http.server as server
import socketserver

PORT = 8081

handler = server.SimpleHTTPRequestHandler
handler.extensions_map={
        '.html': 'text/html',
        '.png': 'image/png',
        '.css': 'text/css',
        '.js':  'application/x-javascript',
        '': 'application/octet-stream'
    }

httpd = socketserver.TCPServer(("", PORT), handler)

def main() -> None:
    httpd.serve_forever()

if __name__ == "__main__":
    main()
