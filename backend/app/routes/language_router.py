from flask import Blueprint, request, abort
from flask_login import login_required
from app.tools.parse_follow import parse_follow
from app.models.language import Language

language_router = Blueprint('languages', __name__, url_prefix='/languages')

@language_router.route('/', methods=['GET'])
@login_required
def get_all():
    follow = parse_follow(request)
    items = Language.query.all()
    data = [item.to_dict(follow) for item in items]
    return data

@language_router.route('/<int:id>', methods=['GET'])
@login_required
def get_one(id):
    follow = parse_follow(request)
    item = Language.query.get(id)
    if not item:
        abort(404)
    return item.to_dict(follow)