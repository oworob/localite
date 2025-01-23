from flask import Response, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

def on_breach(_):
    response = jsonify({
        "message": "Too many requests! Please wait and try again."
    })
    return Response(response=response.get_data(as_text=True), status=429)

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["1000 per hour"],
    on_breach=on_breach
)