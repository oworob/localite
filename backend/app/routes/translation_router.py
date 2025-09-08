from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models.project import Project
from app.config import TRANSLATION_CONTENT_MAX_LENGTH, TRANSLATION_CONTENT_MIN_LENGTH
from app.models.entry import Entry
from app.models.language import Language
from app.models.translation import Translation
from app.models.vote import Vote
from app.tools.parse_follow import parse_follow
from database.db import db

translation_router = Blueprint('translations', __name__, url_prefix='/translations')

@translation_router.route('/', methods=['GET'])
def get_all_for_entry():
    follow = parse_follow(request)
    entry_id = request.args.get('entry_id', type=int)
    language_id = request.args.get('language_id', type=int)
    translations = Translation.query.filter_by(entry_id=entry_id, language_id=language_id).all()
    data = [t.to_dict(follow) for t in translations]
    return data

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

@translation_router.route('/<int:translation_id>', methods=['DELETE'])
@login_required
def delete(translation_id):
    translation = Translation.query.get(translation_id)
    if not translation:
        return {'message': 'Translation not found.'}, 404
    if not (translation.author_id == current_user.id or translation.project.owner_id == current_user.id):
        return {'message': 'You do not have permission to delete this translation.'}, 403

    db.session.delete(translation)
    db.session.commit()
    return '', 200

@translation_router.route('/<int:translation_id>/vote', methods=['POST'])
@login_required
def vote(translation_id):
    translation = Translation.query.get(translation_id)
    vote = request.json.get('vote')
    is_upvote = vote == 1
    if not translation:
        return {'message': 'Translation not found.'}, 404
    
    existing_vote = Vote.query.filter_by(user_id=current_user.id, translation_id=translation_id).first()

    if existing_vote:
        if vote == 0:
            db.session.delete(existing_vote)
        else:
            existing_vote.is_upvote = is_upvote
    else:
        vote = Vote(translation_id=translation.id, user_id=current_user.id, is_upvote=is_upvote)
        db.session.add(vote)

    db.session.commit()
    return '', 200
   
@translation_router.route('/<int:translation_id>/approve', methods=['PATCH'])
@login_required
def approve(translation_id):
    translation = Translation.query.get(translation_id)
    project = Project.query.get(translation.project_id)
    if not translation:
        return {'message': 'Translation not found.'}, 404
    if current_user.id != project.owner_id:
        return {'message': 'You do not have permission to approve this translation.'}, 403
    
    translation.approved = True

    Translation.query.filter(
        Translation.entry_id == translation.entry_id,
        Translation.id != translation.id,
        Translation.approved
    ).update({Translation.approved: False})

    db.session.commit()
    return '', 204