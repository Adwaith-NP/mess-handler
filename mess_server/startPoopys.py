import subprocess
import os
import webbrowser
import threading
import time

def run_server():
    current_directory = os.path.dirname(os.path.abspath(__file__))
    subprocess.run(
        ["python3", "manage.py", "runserver"], 
        cwd=current_directory
    )

# Start the Django server in a separate thread
server_thread = threading.Thread(target=run_server)
server_thread.start()

# Allow some time for the server to start
time.sleep(1)  # Adjust the delay if needed

# Open the URL in the default web browser
url = "http://127.0.0.1:8000/dashboard/"
webbrowser.open(url)

