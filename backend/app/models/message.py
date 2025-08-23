from database.db import db
from sqlalchemy import event
from app.models.base_model import BaseModel
from app.config import MESSAGE_CONTENT_MAX_LENGTH
from live.setup_socket import socket, user_sids

class Message(db.Model, BaseModel):
    __tablename__ = 'message'
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.String(MESSAGE_CONTENT_MAX_LENGTH), nullable=False)
    read = db.Column(db.Boolean, nullable=False, default=False)
    link = db.Column(db.String, nullable=True)

@event.listens_for(Message, 'after_insert')
def message_insert_listener(mapper, connection, target):
    sid = user_sids.get(target.user_id)
    msg = target.to_dict()
    msg['created_at'] = target.created_at.isoformat() if target.created_at else None
    if sid:
        socket.emit('new_message', msg, room=sid)