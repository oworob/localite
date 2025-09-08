from database.db import db
from app.models.base_model import BaseModel
from app.config import ENTRY_CONTENT_MAX_LENGTH, ENTRY_CONTEXT_MAX_LENGTH

class Entry(db.Model, BaseModel):
    __tablename__ = 'entry'
    
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    content = db.Column(db.String(ENTRY_CONTENT_MAX_LENGTH), nullable=False)
    context = db.Column(db.String(ENTRY_CONTEXT_MAX_LENGTH))
    context_requested = db.Column(db.Boolean, nullable=False, default=False)
    translations = db.relationship('Translation', backref='entry', lazy=True, cascade='all, delete-orphan')

    def get_language_status(self, language_id):
        for translation in self.translations:
            if translation.language_id == language_id:
                if translation.approved:
                    return 'approved'
                else:
                    return 'pending'
        return 'needs_translation'
