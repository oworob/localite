from app.models.message import Message
from database.db import db

def SendMessage(user_id, message, link=None):
    message = Message(user_id=user_id, message=message, link=link)
    db.session.add(message)
    db.session.commit()
    return message

def SendBulkMessage(user_ids, message, link=None):
    messages = []
    for user_id in user_ids:
        message = Message(user_id=user_id, message=message, link=link)
        db.session.add(message)
        messages.append(message)
    db.session.commit()
    return messages