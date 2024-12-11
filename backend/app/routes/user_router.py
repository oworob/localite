from flask import Blueprint, request
from app.models.user import User
from app.tools.parse_follow import parse_follow

user_router = Blueprint('users', __name__, url_prefix='/users')

@user_router.route('/', methods=['GET'])
def get_all():
    follow = parse_follow(request)
    items = User.query.all()
    data = [item.to_dict(follow) for item in items]
    return data
