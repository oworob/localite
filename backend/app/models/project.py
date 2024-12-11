from database.db import db
from app.models.base_model import BaseModel
from app.config import PROJECT_TITLE_MAX_LENGTH, LANGUAGE_CODE_LENGTH

project_contributor = db.Table('project_contributor',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'), primary_key=True)
)

project_language = db.Table('project_language',
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'), primary_key=True),
    db.Column('language_id', db.Integer, db.ForeignKey('language.id'), primary_key=True)
)

class Project(db.Model, BaseModel):
    __tablename__ = 'project'
    
    title = db.Column(db.String(PROJECT_TITLE_MAX_LENGTH), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    private = db.Column(db.Boolean, nullable=False, default=False)
    original_language_id = db.Column(db.Integer, db.ForeignKey('language.id'), nullable=False)
    original_language = db.relationship('Language', foreign_keys=[original_language_id]) # ???
    languages = db.relationship('Language', secondary=project_language, lazy='subquery',
        backref=db.backref('projects', lazy=True))
    contributors = db.relationship('User', secondary=project_contributor, lazy='subquery',
        backref=db.backref('joined_projects', lazy=True))
    entries = db.relationship('Entry', backref='project', lazy=True)
    translations = db.relationship('Translation', backref='project', lazy=True)
    notes = db.relationship('Note', backref='project', lazy=True)
        