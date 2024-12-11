from database.db import db
from app.models.base_model import BaseModel
from app.config import PROJECT_NOTE_CONTENT_MAX_LENGTH

class Note(db.Model, BaseModel):
    __tablename__ = 'note'
    
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    content = db.Column(db.String(PROJECT_NOTE_CONTENT_MAX_LENGTH), nullable=False)