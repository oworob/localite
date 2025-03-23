from datetime import datetime
from database.db import db
from app.models.base_model import BaseModel
from app.config import PROJECT_DESCRIPTION_MAX_LENGTH, PROJECT_TITLE_MAX_LENGTH

project_contributor = db.Table('project_contributor',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'), primary_key=True),
    db.Column('last_project_visit', db.DateTime, nullable=False, default=datetime.now)
)

project_language = db.Table('project_language',
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'), primary_key=True),
    db.Column('language_id', db.Integer, db.ForeignKey('language.id'), primary_key=True)
)

class Project(db.Model, BaseModel):
    __tablename__ = 'project'
    
    title = db.Column(db.String(PROJECT_TITLE_MAX_LENGTH), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    owner_last_project_visit = db.Column(db.DateTime, nullable=False, default=datetime.now)
    description = db.Column(db.String(PROJECT_DESCRIPTION_MAX_LENGTH), nullable=True)
    source_language_id = db.Column(db.Integer, db.ForeignKey('language.id'), nullable=False)
    source_language = db.relationship('Language', foreign_keys=[source_language_id]) # ???
    languages = db.relationship('Language', secondary=project_language, lazy='subquery',
        backref=db.backref('projects', lazy=True))
    contributors = db.relationship('User', secondary=project_contributor, lazy='subquery',
        backref=db.backref('joined_projects', lazy=True))
    entries = db.relationship('Entry', backref='project', lazy=True)
    translations = db.relationship('Translation', backref='project', lazy=True)
    notes = db.relationship('Note', backref='project', lazy=True)
        
    def to_dict(self, follow=[]):
        data = super().to_dict(follow)
        if 'contributors' in follow:
            for contributor in data['contributors']:
                contributor['last_project_visit'] = self.get_last_visit(contributor['id'])
        if 'stats' in follow:
            data['stats'] = {
                'languages': len(self.languages),
                'contributors': len(self.contributors),
                'entries': len(self.entries),
                'translations': len(self.translations),
                'notes': len(self.notes)
            }
        return data
              
    def get_last_visit(self, user_id):
        result = db.session.query(project_contributor).filter(
            project_contributor.c.user_id == user_id,
            project_contributor.c.project_id == self.id
        ).one()
        return result.last_project_visit
