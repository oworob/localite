from database.db import db
from app.models.base_model import BaseModel
from app.config import COMMENT_CONTENT_MAX_LENGTH

class Comment(db.Model, BaseModel):
    __tablename__ = 'comment'

    content = db.Column(db.String(COMMENT_CONTENT_MAX_LENGTH), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    entry_id = db.Column(db.Integer, db.ForeignKey('entry.id'), nullable=False)
    language_id = db.Column(db.Integer, db.ForeignKey('language.id'), nullable=True) # no language -> show for all languages

    user = db.relationship('User', backref=db.backref('comments', lazy=True))
    entry = db.relationship('Entry', backref=db.backref('comments', lazy=True))
    language = db.relationship('Language', backref=db.backref('languages', lazy=True))

    

    