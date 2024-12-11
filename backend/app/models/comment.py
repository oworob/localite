from database.db import db
from app.models.base_model import BaseModel
from app.config import COMMENT_CONTENT_MAX_LENGTH

class Comment(db.Model, BaseModel):
    __tablename__ = 'comment'

    content = db.Column(db.String(COMMENT_CONTENT_MAX_LENGTH), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    translation_id = db.Column(db.Integer, db.ForeignKey('translation.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('comments', lazy=True))
    translation = db.relationship('Translation', backref=db.backref('comments', lazy=True))

    

    