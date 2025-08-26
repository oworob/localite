from flask import Blueprint, request
from flask_login import current_user, login_required
from app.tools.parse_follow import parse_follow
from app.models.message import Message
from database.db import db

message_router = Blueprint('messages', __name__, url_prefix='/messages')

@message_router.route('/', methods=['GET'])
@login_required
def get_all():
    follow = parse_follow(request)
    items = Message.query.filter_by(user_id=current_user.id).all()
    data = [item.to_dict(follow) for item in items]
    return data

@message_router.route('/<int:id>', methods=['PATCH'])
@login_required
def mark_as_read(id):
    message = Message.query.get(id)
    if not message:
        return {'message': 'Message not found.'}, 404
    elif message.user_id != current_user.id:
        return {'message': 'Access denied.'}, 403
    message.read = True
    db.session.commit()
    return '', 204

@message_router.route('/<int:id>', methods=['DELETE'])
@login_required
def delete(id):
    message = Message.query.get(id)
    if not message:
        return {'message': 'Message not found.'}, 404
    elif message.user_id != current_user.id:
        return {'message': 'Access denied.'}, 403
    db.session.delete(message)
    db.session.commit()
    return '', 204