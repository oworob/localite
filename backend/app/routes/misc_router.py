from flask import Blueprint, request

from app.models.user import User
from app.models.project import Project
from app.models.entry import Entry
from app.models.translation import Translation
from app.models.language import Language

misc_router = Blueprint('misc', __name__, url_prefix='/misc')

@misc_router.route('/app_stats', methods=['GET'])
def get_app_stats():
    users = User.query.count()
    projects = Project.query.count()
    entries = Entry.query.count()
    translations = Translation.query.count()
    languages = Language.query.count()
    
    data = {
        'users': users,
        'projects': projects,
        'entries': entries,
        'translations': translations,
        'languages': languages
    }
    
    return data
