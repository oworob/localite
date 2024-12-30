from database.db import db
from app.models.base_model import BaseModel
from app.config import MESSAGE_CONTENT_MAX_LENGTH

class Message(db.Model, BaseModel):
    __tablename__ = 'message'
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.String(MESSAGE_CONTENT_MAX_LENGTH), nullable=False)
    read = db.Column(db.Boolean, nullable=False, default=False)
    link = db.Column(db.String, nullable=True)