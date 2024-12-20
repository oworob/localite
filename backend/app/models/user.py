from datetime import datetime
from database.db import db
from app.models.base_model import BaseModel
from app.config import EMAIL_MAX_LENGTH, PASSWORD_HASH_MAX_LENGTH, USERNAME_MAX_LENGTH, PASSWORD_MAX_LENGTH
from flask_login import UserMixin
from flask_bcrypt import generate_password_hash, check_password_hash

class User(db.Model, BaseModel, UserMixin):
    __tablename__ = 'user'
    
    username = db.Column(db.String(USERNAME_MAX_LENGTH), unique=True, nullable=False)
    password_hash = db.Column(db.String(PASSWORD_HASH_MAX_LENGTH), nullable=False)
    email = db.Column(db.String(EMAIL_MAX_LENGTH), unique=True, nullable=False)
    created_projects = db.relationship('Project', backref='owner', lazy=True)
    translations = db.relationship('Translation', backref='author', lazy=True)
    messages = db.relationship('Message', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf8')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)