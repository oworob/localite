from flask import Blueprint
from app import config

config_router = Blueprint('config', __name__, url_prefix='/config')

@config_router.route('/', methods=['GET'])
def get_all():
    data = {key: getattr(config, key) for key in dir(config) if key.isupper()}
    return data
