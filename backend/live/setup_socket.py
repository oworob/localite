import os
from flask import request
from flask_login import current_user
from flask_socketio import SocketIO, disconnect

socket = SocketIO()
user_sids = {}

def setup_socket(app):
    socket.init_app(app, cors_allowed_origins=[f"http://localhost:{os.getenv('CLIENT_PORT')}"])

    @socket.on('connect')
    def handle_connect():
        if current_user.is_authenticated:
            user_sids[current_user.id] = request.sid
        else:
            disconnect()

    @socket.on('disconnect')
    def handle_disconnect():
        if current_user.is_authenticated and current_user.id in user_sids:
            del user_sids[current_user.id]