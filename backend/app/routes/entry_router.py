from flask import Blueprint, request
from flask_login import login_required
from app.tools.parse_follow import parse_follow
from app.models.entry import Entry
from database.db import db

entry_router = Blueprint('entries', __name__, url_prefix='/entries')

@entry_router.route('/', methods=['GET'])
@login_required
def get_all():
    follow = parse_follow(request)
    project_id = request.args.get('project_id', type=int)
    language_id = request.args.get('language_id', type=int)
    if not language_id:
        items = Entry.query.filter_by(project_id=project_id).all()
        data = [item.to_dict(follow) for item in items]
        return data
    else:
        items = Entry.query.filter_by(project_id=project_id).all()
        entries = []
        for entry in items:
            data = entry.to_dict(follow)
            data['status'] = entry.get_language_status(language_id)
            entries.append(data)
        return entries
    
@entry_router.route('/<int:entry_id>', methods=['GET'])
@login_required
def get_one(entry_id):
    follow = parse_follow(request)
    entry = Entry.query.get(entry_id)
    language_id = request.args.get('language_id', type=int)
    if not entry:
        return {'message': 'Entry not found.'}, 404
    
    if not language_id:
        return entry.to_dict(follow)
    else:
        data = entry.to_dict(follow)
        data['status'] = entry.get_language_status(language_id)
        if 'translations' in follow:
            data['translations'] = [t for t in data['translations'] if t['language_id'] == language_id]
        return data

@entry_router.route('/<int:entry_id>/context', methods=['POST'])
@login_required
def request_context(entry_id):
    entry = Entry.query.get(entry_id)
    if not entry:
        return {'message': 'Entry not found.'}, 404
    
    entry.context_requested = True
    db.session.commit()
    return '', 200