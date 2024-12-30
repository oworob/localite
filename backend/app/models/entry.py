from database.db import db
from app.models.base_model import BaseModel
from app.config import ENTRY_CONTENT_MAX_LENGTH, ENTRY_CONTEXT_MAX_LENGTH

class Entry(db.Model, BaseModel):
    __tablename__ = 'entry'
    
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    content = db.Column(db.String(ENTRY_CONTENT_MAX_LENGTH), nullable=False)
    context = db.Column(db.String(ENTRY_CONTEXT_MAX_LENGTH))
    context_requested = db.Column(db.Boolean, nullable=False, default=False)
    translations = db.relationship('Translation', backref='entry', lazy=True)

    def to_dict(self, follow=[]):
        data = super().to_dict(follow)

        if 'languages' in follow: # language report
            languages = [lang.to_dict() for lang in self.project.languages]
            
            for lang in languages:
                lang['status'] = 'needs_translation'
                lang['translation_count'] = 0
                for translation in self.translations:
                    if translation.language.id == lang['id']:
                        lang['translation_count'] += 1
                        lang['status'] = 'pending'
                        if translation.accepted:
                            lang['status'] = 'accepted'
                            break

            data['languages'] = languages
        
        
        return data