from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models.project import Project
from app.tools.parse_follow import parse_follow
from app.models.invite import Invite
from database.db import db

invite_router = Blueprint('invites', __name__, url_prefix='/invites')

@invite_router.route('/', methods=['GET'])
@login_required
def get_all_invites():
    follow = parse_follow(request)
    user = current_user
    items = db.session.query(Invite).filter(Invite.user_id == user.id).all()
    data = [item.to_dict(follow) for item in items]
    return data

@invite_router.route('/<int:id>/accept', methods=['POST'])
@login_required
def accept_invite(id):
    invite = Invite.query.get_or_404(id)
    if invite.user_id != current_user.id:
        return {'message': 'Unauthorized'}, 403

    project = Project.query.get(invite.project_id)
    project.contributors.append(current_user)
    db.session.delete(invite)
    db.session.commit()
    return {'message': 'Invite accepted'}, 200

@invite_router.route('/<int:id>/decline', methods=['POST'])
@login_required
def decline_invite(id):
    invite = Invite.query.get_or_404(id)
    if invite.user_id != current_user.id:
        return {'message': 'Unauthorized'}, 403

    db.session.delete(invite)
    db.session.commit()
    return {'message': 'Invite declined'}, 200
