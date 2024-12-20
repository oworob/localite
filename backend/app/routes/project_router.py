from flask import Blueprint, request, abort
from flask_login import login_required, current_user
from app.models.project import Project
from app.tools.parse_follow import parse_follow
from database.db import db

project_router = Blueprint('projects', __name__, url_prefix='/projects')

@project_router.route('/', methods=['GET'])
@login_required
def get_all():
    follow = parse_follow(request)
    user = current_user
    items = db.session.query(Project).filter(
        (Project.owner_id == user.id) | 
        (Project.contributors.any(id=user.id))
    ).all()
    data = [item.to_dict(follow) for item in items]
    return data

@project_router.route('/invites', methods=['GET'])
@login_required
def get_all_invites():
    follow = parse_follow(request)
    user = current_user
    items = db.session.query(Project).filter(
        Project.invites.any(user_id=user.id)
    ).all()
    data = [item.to_dict(follow) for item in items]
    return data

@project_router.route('/<int:id>', methods=['GET'])
@login_required
def get_one(id):
    follow = parse_follow(request)
    item = Project.query.get(id)
    if not item:
        abort(404)
    return item.to_dict(follow)

