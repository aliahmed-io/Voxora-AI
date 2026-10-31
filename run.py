#!/usr/bin/env python3
"""
Voxora AI — Universal Zero-Config Launcher.
Automatically detects free ports for both FastAPI backend and Next.js frontend,
synchronizes port metadata so the frontend connects seamlessly,
and launches both services with unified logging and graceful shutdown.
"""

import os
import sys
import time
import socket
import json
import signal
import subprocess
import webbrowser
from typing import List, Optional

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

BACKEND_PREFERRED_PORTS = [8002, 8000, 8001, 8003, 8004, 8005]
FRONTEND_PREFERRED_PORTS = [3004, 3000, 3001, 3002, 3003, 3005]


def is_port_available(port: int, host: str = "127.0.0.1") -> bool:
    """Returns True if the port is free to bind, False if occupied."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        try:
            s.bind((host, port))
            return True
        except socket.error:
            return False


def find_available_port(preferred: List[int], default_start: int = 8000) -> int:
    """Finds the first available port from preferred list, or scans upward."""
    for port in preferred:
        if is_port_available(port):
            return port
    for port in range(default_start, default_start + 100):
        if port not in preferred and is_port_available(port):
            return port
    return default_start


def get_backend_python() -> str:
    """Returns path to backend virtualenv python or system python."""
    win_venv = os.path.join(BACKEND_DIR, "venv", "Scripts", "python.exe")
    posix_venv = os.path.join(BACKEND_DIR, "venv", "bin", "python")
    if os.path.exists(win_venv):
        return win_venv
    if os.path.exists(posix_venv):
        return posix_venv
    return sys.executable


def sync_port_metadata(backend_port: int, frontend_port: int):
    """Writes port discovery metadata for both backend and frontend."""
    payload = {
        "port": backend_port,
        "url": f"http://127.0.0.1:{backend_port}",
        "frontend_port": frontend_port,
        "frontend_url": f"http://localhost:{frontend_port}",
        "service": "Voxora AI API",
        "updated_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
    }

    # 1. Root backend_port.json
    root_json = os.path.join(ROOT_DIR, "backend_port.json")
    with open(root_json, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    # 2. Frontend public/backend_port.json (directly accessible by browser)
    public_dir = os.path.join(FRONTEND_DIR, "public")
    os.makedirs(public_dir, exist_ok=True)
    frontend_json = os.path.join(public_dir, "backend_port.json")
    with open(frontend_json, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    # 3. Frontend .env.local
    env_local = os.path.join(FRONTEND_DIR, ".env.local")
    env_content = f"NEXT_PUBLIC_API_URL=http://127.0.0.1:{backend_port}\n"
    with open(env_local, "w", encoding="utf-8") as f:
        f.write(env_content)


def main():
    print("=" * 65)
    print("  Voxora AI — Zero-Config Automatic Port Launcher")
    print("=" * 65)

    # 1. Detect free ports
    backend_port = find_available_port(BACKEND_PREFERRED_PORTS, 8000)
    frontend_port = find_available_port(FRONTEND_PREFERRED_PORTS, 3000)

    print(f"[*] Detected available backend port  : {backend_port}")
    print(f"[*] Detected available frontend port : {frontend_port}")

    # 2. Synchronize configuration
    sync_port_metadata(backend_port, frontend_port)
    print("[*] Synchronized port metadata and frontend .env.local")

    python_exe = get_backend_python()
    print(f"[*] Using Python executable: {python_exe}")

    backend_env = os.environ.copy()
    backend_env["PORT"] = str(backend_port)

    # 3. Start Backend
    print(f"[*] Launching FastAPI on http://127.0.0.1:{backend_port}...")
    backend_proc = subprocess.Popen(
        [
            python_exe,
            "-m",
            "uvicorn",
            "app.main:app",
            "--host",
            "127.0.0.1",
            "--port",
            str(backend_port),
        ],
        cwd=BACKEND_DIR,
        env=backend_env,
    )

    # 4. Start Frontend
    print(f"[*] Launching Next.js on http://localhost:{frontend_port}...")
    # Use pnpm start if build exists, otherwise pnpm dev
    has_build = os.path.exists(os.path.join(FRONTEND_DIR, ".next"))
    cmd = (
        ["pnpm", "start", "--", "-p", str(frontend_port)]
        if has_build
        else ["pnpm", "dev", "--", "-p", str(frontend_port)]
    )

    # Windows shell resolution for pnpm
    shell_val = sys.platform.startswith("win")
    frontend_proc = subprocess.Popen(cmd, cwd=FRONTEND_DIR, shell=shell_val)

    # 5. Open browser once ready
    def open_browser():
        time.sleep(2.5)
        url = f"http://localhost:{frontend_port}"
        print(f"\n[+] Opening Voxora AI in browser: {url}")
        try:
            webbrowser.open(url)
        except Exception:
            pass

    import threading
    t = threading.Thread(target=open_browser, daemon=True)
    t.start()

    print("\n" + "=" * 65)
    print(f"  Voxora AI is running!")
    print(f"  Frontend URL : http://localhost:{frontend_port}")
    print(f"  Backend API  : http://127.0.0.1:{backend_port}")
    print(f"  Swagger Docs : http://127.0.0.1:{backend_port}/docs")
    print("  Press Ctrl+C to terminate both servers.")
    print("=" * 65 + "\n")

    def cleanup(signum=None, frame=None):
        print("\n[*] Shutting down Voxora AI servers gracefully...")
        try:
            backend_proc.terminate()
        except Exception:
            pass
        try:
            frontend_proc.terminate()
        except Exception:
            pass
        sys.exit(0)

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    try:
        while True:
            time.sleep(1)
            # If any process dies unexpectedly, inform
            if backend_proc.poll() is not None:
                print("[!] Backend process exited.")
                break
            if frontend_proc.poll() is not None:
                print("[!] Frontend process exited.")
                break
    except KeyboardInterrupt:
        pass
    finally:
        cleanup()


if __name__ == "__main__":
    main()
