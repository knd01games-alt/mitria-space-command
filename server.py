import http.server
import socketserver
import webbrowser
import threading
import os

PORT = 8081

class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = super().translate_path(path)
        if os.path.isdir(path):
            index = os.path.join(path, 'index.html')
            if os.path.exists(index):
                return index
        return path

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

def open_browser():
    import time
    time.sleep(1)
    webbrowser.open(f"http://localhost:{PORT}")

print(f" Servidor do MITRIA Space Command rodando em http://localhost:{PORT}")
print(" Abrindo a página principal no navegador...")

threading.Thread(target=open_browser).start()

try:
    with ReusableTCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
except Exception as e:
    print(f"Erro ao iniciar servidor: {e}")
