from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models.project import Project
from app.config import TRANSLATION_CONTENT_MAX_LENGTH, TRANSLATION_CONTENT_MIN_LENGTH
from app.models.entry import Entry
from app.models.language import Language
from app.models.translation import Translation
from database.db import db

translation_router = Blueprint('translations', __name__, url_prefix='/translations')

@translation_router.route('/', methods=['POST'])
@login_required
def create():
    data = request.get_json()
    project_id = data.get('project_id')
    entry_id = data.get('entry_id')
    language_id = data.get('language_id')
    content = data.get('content')

    project = Project.query.get(project_id)
    entry = Entry.query.get(entry_id)
    language = Language.query.get(language_id)

    if len(content) < TRANSLATION_CONTENT_MIN_LENGTH or len(content) > TRANSLATION_CONTENT_MAX_LENGTH:
        return {'message': f"Translation content must be between {TRANSLATION_CONTENT_MIN_LENGTH} and {TRANSLATION_CONTENT_MAX_LENGTH} characters."}, 400
    elif not project:
        return {'message': 'Project not found.'}, 404
    elif not entry:
        return {'message': 'Entry not found.'}, 404
    elif not language:
        return {'message': 'Language not found.'}, 404

    translation_exists = Translation.query.filter_by(project_id=project_id, entry_id=entry_id, language_id=language_id, content=content).first()
    if translation_exists:
        return {'message': 'Such translation already exists.'}, 400
    
    translation = Translation(project_id=project_id, entry_id=entry_id, author_id=current_user.id, content=content, language_id=language_id)
    db.session.add(translation)
    db.session.commit()

    return translation.to_dict(['author']), 201