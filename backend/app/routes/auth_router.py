from datetime import datetime
import re
from flask import Blueprint, request
from flask_login import login_user, logout_user, current_user, login_required
from sqlalchemy import Update
from app.models.user import User
from app.tools.limiter import limiter
from database.db import db
from app.config import EMAIL_MAX_LENGTH, EMAIL_REGEX, PASSWORD_MIN_LENGTH, PASSWORD_REGEX, USERNAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_REGEX

auth_router = Blueprint('auth', __name__, url_prefix='/auth')

def UpdateLastVisit(user):
    user.last_visit = datetime.now()
    db.session.commit()

@auth_router.route('/register', methods=['POST'])
@limiter.limit("5 per minute")
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return {'message': 'Please fill in all fields.'}, 400
    elif User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
        return {'message': 'User with this e-mail or username already exists.'}, 400
    elif not re.match(EMAIL_REGEX, email):
        return {'message': 'Please enter a valid e-mail.'}, 400
    elif len(email) > EMAIL_MAX_LENGTH:
        return {'message': f'E-mail length must be less than {EMAIL_MAX_LENGTH} characters.'}, 400
    elif not re.match(USERNAME_REGEX, username):
        return {'message': 'Username can contain only letters and numbers.'}, 400
    elif len(username) not in range(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH + 1):
        return {'message': f'Username length must be between {USERNAME_MIN_LENGTH} and {USERNAME_MAX_LENGTH} characters.'}, 400
    elif not re.match(PASSWORD_REGEX, password):
        return {'message': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'}, 400
    elif len(password) not in range(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH + 1):
        return {'message': f'Password length must be between {PASSWORD_MIN_LENGTH} and {PASSWORD_MAX_LENGTH} characters'}, 400
    
    
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    login_user(user)

    data = user.to_dict()
    return data, 201

@auth_router.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user is None or not user.check_password(password):
        return {'message': 'Invalid username or password.'}, 401

    login_user(user)
    UpdateLastVisit(user)
    data = user.to_dict()
    return data

@auth_router.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return {'message': 'Logged out successfully'}

@auth_router.route('/current_user', methods=['GET'])
def get_current_user():
    if current_user.is_authenticated:
        UpdateLastVisit(current_user)
        return current_user.to_dict()
    return {'message': 'No user is currently logged in'}, 401