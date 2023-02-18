import http.server as server

handler = server.SimpleHTTPRequestHandler

handler.extensions_map['.html'] = 'text/html'
handler.extensions_map['.png'] = 'image/png'
handler.extensions_map['.css'] = 'text/css'
handler.extensions_map['.js'] = 'text/javascript'

def main(port: int = 8081) -> None:
    server.test(handler, port=port)

if __name__ == "__main__":
    main()
