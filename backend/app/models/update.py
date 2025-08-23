from database.db import db
from app.models.base_model import BaseModel

class Update(db.Model, BaseModel):
    __tablename__ = 'update'
    
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    content = db.Column(db.String, nullable=False)