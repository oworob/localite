from database.db import db
from app.models.base_model import BaseModel

class Invite(db.Model, BaseModel):
    __tablename__ = 'invite'

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('invites', lazy=True))
    project = db.relationship('Project', backref=db.backref('invites', lazy=True))

    

    