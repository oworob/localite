from database.db import db
from app.models.base_model import BaseModel

class Vote(db.Model, BaseModel):
    __tablename__ = 'vote'
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    translation_id = db.Column(db.Integer, db.ForeignKey('translation.id'), nullable=False)
    is_upvote = db.Column(db.Boolean, nullable=False)
    
    user = db.relationship('User', backref=db.backref('votes', lazy=True))
    translation = db.relationship('Translation', backref=db.backref('votes', lazy=True))