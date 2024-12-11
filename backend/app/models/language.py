from database.db import db
from app.models.base_model import BaseModel
from app.config import LANGUAGE_CODE_LENGTH, LANGUAGE_NAME_LENGTH

class Language(db.Model, BaseModel):
    __tablename__ = 'language'

    code = db.Column(db.String(LANGUAGE_CODE_LENGTH), nullable=False, unique=True)
    title_eng = db.Column(db.String(LANGUAGE_NAME_LENGTH), nullable=False)
    title_native = db.Column(db.String(LANGUAGE_NAME_LENGTH), nullable=False)
    translations = db.relationship('Translation', backref='language', lazy=True)

    