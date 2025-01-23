from app.models.vote import Vote
from database.db import db
from app.models.base_model import BaseModel
from app.config import TRANSLATION_CONTENT_MAX_LENGTH

class Translation(db.Model, BaseModel):
    __tablename__ = 'translation'
    
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    entry_id = db.Column(db.Integer, db.ForeignKey('entry.id'), nullable=False)
    accepted = db.Column(db.Boolean, nullable=False, default=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.String(TRANSLATION_CONTENT_MAX_LENGTH), nullable=False)
    language_id = db.Column(db.Integer, db.ForeignKey('language.id'), nullable=False)

    def to_dict(self, follow=[]):
        data = super().to_dict(follow)
        
        upvotes = sum([1 for vote in self.votes if vote.is_upvote])
        downvotes = sum([1 for vote in self.votes if not vote.is_upvote])
        data['total_votes'] = upvotes - downvotes
        data['user_upvoted'] = False
        data['user_downvoted'] = False

        vote = Vote.query.filter_by(user_id=self.author_id, translation_id=self.id).first()
        if vote:
            data['user_upvoted'] = vote.is_upvote
            data['user_downvoted'] = not vote.is_upvote


        
        return data