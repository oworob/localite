from flask import Blueprint, request

from app.models.user import User
from app.models.project import Project
from app.models.entry import Entry
from app.models.translation import Translation
from app.models.language import Language
from database.db import db

misc_router = Blueprint('misc', __name__, url_prefix='/misc')

@misc_router.route('/app_stats', methods=['GET'])
def get_app_stats():
    users = db.session.query(User).count()
    projects = db.session.query(Project).count()
    entries = db.session.query(Entry).count()
    translations = db.session.query(Translation).count()
    languages = db.session.query(Language).count()
    
    data = {
        'users': users,
        'projects': projects,
        'entries': entries,
        'translations': translations,
        'languages': languages
    }
    
    return data
