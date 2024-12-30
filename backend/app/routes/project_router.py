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
    items = db.session.query(Project).filter(
        (Project.owner_id == user.id) | 
        (Project.contributors.any(id=user.id))
    ).all()
    data = [item.to_dict(follow) for item in items]
    return data

@project_router.route('/invites', methods=['GET'])
@login_required
def get_all_invites():
    follow = parse_follow(request)
    user = current_user
    items = db.session.query(Project).filter(
        Project.invites.any(user_id=user.id)
    ).all()
    data = [item.to_dict(follow) for item in items]
    return data

@project_router.route('/<int:id>', methods=['GET'])
@login_required
def get_one(id):
    follow = parse_follow(request)
    item = Project.query.get(id)
    if not item:
        abort(404)
    return item.to_dict(follow)


@project_router.route('/', methods=['POST'])
@login_required
def create():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    notes = data.get('notes')
    entries = data.get('entries')
    original_language_id = data.get('original_language_id')
    languages = data.get('languages')
    contributors = data.get('contributors')

    print(data)

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

    for note in data.get('notes'):
        if len(note) < PROJECT_NOTE_CONTENT_MIN_LENGTH or len(note) > PROJECT_NOTE_CONTENT_MAX_LENGTH:
            return {'message': f"Project notes must be between {PROJECT_NOTE_CONTENT_MIN_LENGTH} and {PROJECT_NOTE_CONTENT_MAX_LENGTH} characters."}, 400

    for entry in data.get('entries'):
        if len(entry.get('content')) < ENTRY_CONTENT_MIN_LENGTH or len(entry.get('content')) > ENTRY_CONTENT_MAX_LENGTH:
            return {'message': f"Entry content must be between {ENTRY_CONTENT_MIN_LENGTH} and {ENTRY_CONTENT_MAX_LENGTH} characters."}, 400
        if len(entry.get('context')) > ENTRY_CONTEXT_MAX_LENGTH:
            return {'message': f"Entry context must be less than {ENTRY_CONTEXT_MAX_LENGTH} characters."}, 400

    db_entries = [Entry(**entry) for entry in entries]
    db_notes = [Note(content=note) for note in notes]
    db_languages = db.session.query(Language).filter(Language.id.in_(languages)).all()

    project = Project(
        title=title,
        description=description,
        original_language_id=original_language_id,
        languages=db_languages,
        notes=db_notes,
        entries=db_entries,
        owner_id=current_user.id
    )

    db.session.add(project)
    db.session.commit()

    # send invites to contributors
    for contributor_id in contributors:
        invite = Invite(user_id=contributor_id, project_id=project.id)
        db.session.add(invite)
        message_content = f"{current_user.username} has invited you to join '{project.title}'."
        message = Message(user_id=contributor_id, content=message_content, link=f"/projects/{project.id}")
        db.session.add(message)
    db.session.commit()

    return str(project.id), 201