from flask import Blueprint, request, abort
from flask_login import login_required, current_user
from app.models.project import Project
from app.tools.parse_follow import parse_follow
from app.config import ENTRY_CONTENT_MAX_LENGTH, ENTRY_CONTENT_MIN_LENGTH, ENTRY_CONTEXT_MAX_LENGTH, PROJECT_DESCRIPTION_MAX_LENGTH, PROJECT_MAX_ENTRY_COUNT, PROJECT_MAX_NOTE_COUNT, PROJECT_NOTE_CONTENT_MAX_LENGTH, PROJECT_NOTE_CONTENT_MIN_LENGTH, PROJECT_TITLE_MAX_LENGTH, PROJECT_TITLE_MIN_LENGTH
from app.models.entry import Entry
from app.models.note import Note
from app.models.language import Language
from app.models.invite import Invite
from app.models.message import Message
from database.db import db

project_router = Blueprint('projects', __name__, url_prefix='/projects')

@project_router.route('/', methods=['GET'])
@login_required
def get_all():
    follow = parse_follow(request)
    user = current_user
    items = db.session.query(Project).filter(Project.contributors.any(id=user.id)).all()
    data = [item.to_dict(follow) for item in items]
    return data

@project_router.route('/<int:id>', methods=['GET'])
@login_required
def get_one(id):
    follow = parse_follow(request)
    item = Project.query.get(id)
    if current_user not in item.contributors:
        return {'message': 'You do not have access to this project.'}, 403
    else :
        item.update_last_visit(current_user.id)
    if not item:
        abort(404)
    return item.to_dict(follow)

@project_router.route('/', methods=['POST'])
@login_required
def create():
    data = request.get_json()
    title = data.get('title').strip()
    description = data.get('description').strip()
    notes = [note.strip() for note in data.get('notes')]
    entries = data.get('entries')
    source_language_id = data.get('source_language_id')
    languages = data.get('languages')
    contributors = data.get('contributors')

    if len(title) < PROJECT_TITLE_MIN_LENGTH or len(title) > PROJECT_TITLE_MAX_LENGTH:
        return {'message': f"Project title must be between {PROJECT_TITLE_MIN_LENGTH} and {PROJECT_TITLE_MAX_LENGTH} characters."}, 400
    elif len(description) > PROJECT_DESCRIPTION_MAX_LENGTH:
        return {'message': f"Project description must be less than {PROJECT_DESCRIPTION_MAX_LENGTH} characters."}, 400
    elif len(entries) == 0:
        return {'message': 'Please add at least one entry.'}, 400
    elif (len(entries) > PROJECT_MAX_ENTRY_COUNT):
        return {'message': f"Project can have maximum {PROJECT_MAX_ENTRY_COUNT} entries."}, 400
    elif len(notes) > PROJECT_MAX_NOTE_COUNT:
        return {'message': f"Project can have maximum {PROJECT_MAX_NOTE_COUNT} notes."}, 400
    elif len(languages) == 0:
        return {'message': 'Please add at least one language to translate to.'}, 400

    for note in notes:
        if len(note) < PROJECT_NOTE_CONTENT_MIN_LENGTH or len(note) > PROJECT_NOTE_CONTENT_MAX_LENGTH:
            return {'message': f"Project notes must be between {PROJECT_NOTE_CONTENT_MIN_LENGTH} and {PROJECT_NOTE_CONTENT_MAX_LENGTH} characters."}, 400

    for entry in entries:
        entry['content'] = entry.get('content').strip()
        entry['context'] = entry.get('context').strip()
        if len(entry['content']) < ENTRY_CONTENT_MIN_LENGTH or len(entry['content']) > ENTRY_CONTENT_MAX_LENGTH:
            return {'message': f"Entry content must be between {ENTRY_CONTENT_MIN_LENGTH} and {ENTRY_CONTENT_MAX_LENGTH} characters."}, 400
        if len(entry['context']) > ENTRY_CONTEXT_MAX_LENGTH:
            return {'message': f"Entry context must be less than {ENTRY_CONTEXT_MAX_LENGTH} characters."}, 400

    db_entries = [Entry(**entry) for entry in entries]
    db_notes = [Note(content=note) for note in notes]
    db_languages = db.session.query(Language).filter(Language.id.in_(languages)).all()

    project = Project(
        title=title,
        description=description,
        source_language_id=source_language_id,
        languages=db_languages,
        notes=db_notes,
        entries=db_entries,
        owner_id=current_user.id
    )

    db.session.add(project)
    db.session.commit()

    # add the owner as a contributor
    project.contributors.append(current_user)

    # send invites to contributors
    for contributor_id in contributors:
        invite = Invite(user_id=contributor_id, project_id=project.id)
        db.session.add(invite)
        message_content = f"{current_user.username} has invited you to join '{project.title}'."
        message = Message(user_id=contributor_id, content=message_content, link="/projects")
        db.session.add(message)
    db.session.commit()
    
    return str(project.id), 201

@project_router.route('/<int:id>/leave', methods=['DELETE'])
@login_required
def leave(id):
    project = Project.query.get(id)
    if current_user not in project.contributors:
        return {'message': 'You do not have access to this project.'}, 403
    if current_user.id == project.owner_id:
        return {'message': 'You must transfer project ownership before leaving.'}, 403
    project.contributors.remove(current_user)
    db.session.commit()
    return '', 204

@project_router.route('/<int:id>/details', methods=['PATCH'])
@login_required
def update_project_details(id):
    project = Project.query.get(id)
    if current_user.id != project.owner_id:
        return {'message': 'You are not allowed to change this data.'}, 403

    data = request.get_json()
    title = data.get('title').strip()
    description = data.get('description').strip()

    if len(title) < PROJECT_TITLE_MIN_LENGTH or len(title) > PROJECT_TITLE_MAX_LENGTH:
        return {'message': f"Project title must be between {PROJECT_TITLE_MIN_LENGTH} and {PROJECT_TITLE_MAX_LENGTH} characters."}, 400
    elif len(description) > PROJECT_DESCRIPTION_MAX_LENGTH:
        return {'message': f"Project description must be less than {PROJECT_DESCRIPTION_MAX_LENGTH} characters."}, 400

    if title != project.title:
        project.title = title
    if description != project.description:
        project.description = description
  
    db.session.commit()

    return '', 204

@project_router.route('/<int:id>/notes', methods=['PATCH'])
@login_required
def update_project_notes(id):
    project = Project.query.get(id)
    if current_user.id != project.owner_id:
        return {'message': 'You are not allowed to change this data.'}, 403

    notes = request.get_json()
    
    if len(notes) > PROJECT_MAX_NOTE_COUNT:
        return {'message': f"Project can have maximum {PROJECT_MAX_NOTE_COUNT} notes."}, 400
    
    stripped_notes = [note.strip() for note in notes]
    for note in stripped_notes:
        if len(note) < PROJECT_NOTE_CONTENT_MIN_LENGTH or len(note) > PROJECT_NOTE_CONTENT_MAX_LENGTH:
            return {'message': f"Note content must be between {PROJECT_NOTE_CONTENT_MIN_LENGTH} and {PROJECT_NOTE_CONTENT_MAX_LENGTH} characters."}, 400

    project.notes = [Note(content=note) for note in stripped_notes]
    db.session.commit()

    return '', 204

@project_router.route('/<int:id>', methods=['DELETE'])
@login_required
def delete(id):
    project = Project.query.get(id)
    if current_user.id != project.owner_id:
        return {'message': 'You are not allowed to delete this project.'}, 403
        
    # Delete all entries, notes, translations, and updates related to the project
    db.session.delete(project)

    db.session.commit()
    return '', 204