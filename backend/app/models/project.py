from datetime import datetime
from flask_login import current_user
from sqlalchemy import event
from app.models.update import Update
from app.models.language import Language
from app.models.user import User
from database.db import db
from app.models.base_model import BaseModel
from app.config import PROJECT_DESCRIPTION_MAX_LENGTH, PROJECT_TITLE_MAX_LENGTH

project_contributor = db.Table('project_contributor',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'), primary_key=True),
    db.Column('last_project_visit', db.DateTime, nullable=False, default=datetime.now),
    db.Column('is_manager', db.Boolean, nullable=False, default=False)
)

project_language = db.Table('project_language',
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'), primary_key=True),
    db.Column('language_id', db.Integer, db.ForeignKey('language.id'), primary_key=True)
)

class Project(db.Model, BaseModel):
    __tablename__ = 'project'
    
    title = db.Column(db.String(PROJECT_TITLE_MAX_LENGTH), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    description = db.Column(db.String(PROJECT_DESCRIPTION_MAX_LENGTH), nullable=True)
    source_language_id = db.Column(db.Integer, db.ForeignKey('language.id'), nullable=False)
    source_language = db.relationship('Language', foreign_keys=[source_language_id]) # ???
    languages = db.relationship('Language', secondary=project_language, lazy='subquery',
        backref=db.backref('projects', lazy=True))
    contributors = db.relationship('User', secondary=project_contributor, lazy='subquery',
        backref=db.backref('joined_projects', lazy=True))
    entries = db.relationship('Entry', backref='project', lazy=True, cascade='all, delete-orphan')
    translations = db.relationship('Translation', backref='project', lazy=True, cascade='all, delete-orphan')
    notes = db.relationship('Note', backref='project', lazy=True, cascade='all, delete-orphan')
    updates = db.relationship('Update', backref='project', lazy=True, cascade='all, delete-orphan')
    invites = db.relationship('Invite', backref='project', lazy=True, cascade='all, delete-orphan')
        
    def to_dict(self, follow=[]):
        data = super().to_dict(follow)
        data['last_project_visit'] = self.get_last_visit(current_user.id)
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
        if 'updates' in follow:
            data['updates'] = [u.to_dict() for u in sorted(self.updates, key=lambda x: x.created_at, reverse=True)]
        
        return data
              
    def get_last_visit(self, user_id):
        result = db.session.query(project_contributor).filter(
            project_contributor.c.user_id == user_id,
            project_contributor.c.project_id == self.id
        ).one_or_none()
        return result.last_project_visit if result else None
    
    def update_last_visit(self, user_id):
        db.session.execute(
            project_contributor.update()
            .where(project_contributor.c.user_id == user_id)
            .where(project_contributor.c.project_id == self.id)
            .values(last_project_visit = datetime.now())
        )
        db.session.commit()

    def is_manager(self, user_id):
        result = db.session.query(project_contributor).filter(
            project_contributor.c.user_id == user_id,
            project_contributor.c.project_id == self.id,
            project_contributor.c.is_manager
        ).one_or_none()
        return result is not None
    

@event.listens_for(Project, 'after_insert')
def project_insert_listener(mapper, connection, target):
    owner = db.session.get(User, target.owner_id)
    source_lang = db.session.get(Language, target.source_language_id)
    target_langs = db.session.query(Language).filter(Language.id.in_([lang.id for lang in target.languages])).all()
    update = Update(project_id=target.id, content=f"Project '{target.title}' created by {owner.username}. Source language set to {source_lang.title_eng}. Target languages added: {', '.join([lang.title_eng for lang in target_langs])}. {len(target.entries)} entries added.")
    if len(target.notes) > 0:
        update.content += f" {len(target.notes)} notes added."
    db.session.add(update)
    
@event.listens_for(Project, 'after_update')
def project_update_listener(mapper, connection, target):
    state = db.inspect(target)
    changes = []

    if state.attrs.title.history.has_changes():
        old_title = state.attrs.title.history.deleted[0]
        changes.append(f"Title changed from '{old_title}' to '{target.title}'.")

    if state.attrs.description.history.has_changes():
        old_desc = state.attrs.description.history.deleted[0]
        changes.append(f"Description changed from '{old_desc}' to '{target.description}'.")

    if state.attrs.notes.history.has_changes():
        added = state.attrs.notes.history.added
        removed = state.attrs.notes.history.deleted
        added_content = set(f"'{note.content}'" for note in added)
        removed_content = set(f"'{note.content}'" for note in removed)
        truly_added = added_content - removed_content
        truly_removed = removed_content - added_content

        if truly_added:
            changes.append(f"Notes added: {', '.join(truly_added)}.")
        if truly_removed:
            changes.append(f"Notes removed: {', '.join(truly_removed)}.")

    if state.attrs.contributors.history.has_changes():
        added = state.attrs.contributors.history.added
        removed = state.attrs.contributors.history.deleted
        if added:
            changes.append(f"{', '.join([user.username for user in added])} joined the project.")
        if removed:
            changes.append(f"{', '.join([user.username for user in removed])} left the project.")

    if changes:
        update = Update(project_id=target.id, content=' '.join(changes))
        db.session.add(update)
