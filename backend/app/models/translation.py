from database.db import db
from app.models.base_model import BaseModel
from app.config import TRANSLATION_CONTENT_MAX_LENGTH

class Translation(db.Model, BaseModel):
    __tablename__ = 'translation'
    
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    entry_id = db.Column(db.Integer, db.ForeignKey('entry.id'), nullable=False)
    approved = db.Column(db.Boolean, nullable=False, default=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.String(TRANSLATION_CONTENT_MAX_LENGTH), nullable=False)
    language_id = db.Column(db.Integer, db.ForeignKey('language.id'), nullable=False)
    votes = db.relationship('Vote', backref='translation', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, follow=[]):
        data = super().to_dict(follow)
        data['rating'] = sum(v.is_upvote for v in self.votes) - sum(not v.is_upvote for v in self.votes)
        data['user_vote'] = 0
        for vote in self.votes:
            if vote.user_id == self.author_id:
                data['user_vote'] = 1 if vote.is_upvote else -1
                break

        return data