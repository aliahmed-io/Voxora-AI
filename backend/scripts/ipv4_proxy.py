import socket
import threading
import sys

def handle_client(client_sock):
    try:
        req_data = client_sock.recv(4096)
        if not req_data:
            client_sock.close()
            return
        
        lines = req_data.decode('latin1').split('\r\n')
        first_line = lines[0]
        parts = first_line.split(' ')
        if len(parts) < 2:
            client_sock.close()
            return
        
        method, target = parts[0], parts[1]
        
        if method.upper() == 'CONNECT':
            host, port = target.split(':')
            port = int(port)
            
            # Force IPv4 resolution
            addr_info = socket.getaddrinfo(host, port, socket.AF_INET, socket.SOCK_STREAM)
            target_ip, target_port = addr_info[0][4][:2]
            
            server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            server_sock.connect((target_ip, target_port))
            
            client_sock.sendall(b"HTTP/1.1 200 Connection Established\r\n\r\n")
            
            # Bi-directional pipe
            def forward(src, dst):
                try:
                    while True:
                        data = src.recv(8192)
                        if not data:
                            break
                        dst.sendall(data)
                except Exception:
                    pass
                finally:
                    src.close()
                    dst.close()
            
            t1 = threading.Thread(target=forward, args=(client_sock, server_sock), daemon=True)
            t2 = threading.Thread(target=forward, args=(server_sock, client_sock), daemon=True)
            t1.start()
            t2.start()
            t1.join()
            t2.join()
        else:
            client_sock.close()
    except Exception as e:
        try:
            client_sock.close()
        except Exception:
            pass

def main():
    port = 8899
    proxy_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    proxy_server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    proxy_server.bind(('127.0.0.1', port))
    proxy_server.listen(128)
    print(f"IPv4 tunnel proxy listening on 127.0.0.1:{port}", flush=True)
    
    while True:
        client_sock, _ = proxy_server.accept()
        t = threading.Thread(target=handle_client, args=(client_sock,), daemon=True)
        t.start()

if __name__ == '__main__':
    main()
