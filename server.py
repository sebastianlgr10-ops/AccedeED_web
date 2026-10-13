import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    os.chdir(DIRECTORY)
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            url = f"http://localhost:{PORT}"
            print(f"==================================================")
            print(f"  AccedeED Web - Servidor Local Iniciado")
            print(f"  Abre en tu navegador: {url}")
            print(f"  Presiona Ctrl + C para detener el servidor")
            print(f"==================================================")
            webbrowser.open(url)
            httpd.serve_forever()
    except OSError:
        # Fallback to alternate port if 8080 is in use
        alt_port = 8081
        with socketserver.TCPServer(("", alt_port), Handler) as httpd:
            url = f"http://localhost:{alt_port}"
            print(f"Iniciado en puerto alternativo: {url}")
            webbrowser.open(url)
            httpd.serve_forever()

if __name__ == "__main__":
    run()
