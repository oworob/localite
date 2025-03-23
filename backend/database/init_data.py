from .db import db
from app.models.language import Language
from app.models.project import Project
from app.models.user import User
from app.models.entry import Entry
from app.models.translation import Translation
from app.models.vote import Vote
from app.models.note import Note
from app.models.message import Message
from app.models.comment import Comment
from app.models.invite import Invite

def init_data(app):
    with app.app_context():

        # languages
        language1 = Language(code='en', title_eng='English', title_native='English')
        language2 = Language(code='es', title_eng='Spanish', title_native='Español')
        language3 = Language(code='fr', title_eng='French', title_native='Français')
        language4 = Language(code='de', title_eng='German', title_native='Deutsch')
        language5 = Language(code='pl', title_eng='Polish', title_native='Polski')
        language6 = Language(code='it', title_eng='Italian', title_native='Italiano')
        language7 = Language(code='pt', title_eng='Portuguese', title_native='Português')
        language8 = Language(code='ru', title_eng='Russian', title_native='Русский')
        language9 = Language(code='ja', title_eng='Japanese', title_native='日本語')
        language10 = Language(code='zh', title_eng='Chinese', title_native='中文')

        db.session.add(language1)
        db.session.add(language2)
        db.session.add(language3)
        db.session.add(language4)
        db.session.add(language5)
        db.session.add(language6)
        db.session.add(language7)
        db.session.add(language8)
        db.session.add(language9)
        db.session.add(language10)
        db.session.commit()

        # users
        user1 = User(username='admin', email='admin@email.com')
        user1.set_password('admin')
        user2 = User(username='user', email='user@email.com')
        user2.set_password('user')
        user3 = User(username='bob', email='bob@email.com')
        user3.set_password('bob')
        user4 = User(username='user4', email='user4@email.com')
        user4.set_password('user4')
        user5 = User(username='user5', email='user5@email.com')
        user5.set_password('user5')

        db.session.add(user1)
        db.session.add(user2)
        db.session.add(user3)
        db.session.add(user4)
        db.session.add(user5)
        db.session.commit()

        # messages
        message1 = Message(
            user_id=user1.id,
            content='Hello!'
        )

        db.session.add(message1)
        db.session.commit()

        # projects
        project1 = Project(
            title='Dinosaur Game',
            owner_id=user1.id,
            source_language_id=language1.id,
            description='A simple game where you play as a dinosaur.'
        )
        project2 = Project(
            title='Książka kucharska',
            owner_id=user2.id,
            source_language_id=language5.id,
            description='A Polish cookbook.'
        )
        project3 = Project(
            title='Social media app',
            owner_id=user3.id,
            source_language_id=language1.id,
            description='An app for sharing photos and messages.'
        )

        db.session.add(project1)
        db.session.add(project2)
        db.session.add(project3)
        db.session.commit()

        # invites
        invite1 = Invite(user_id=user3.id, project_id=project1.id)
        invite2 = Invite(user_id=user1.id, project_id=project3.id)

        db.session.add(invite1)
        db.session.commit()

        # project contributors and languages
        project1.contributors.append(user1)
        project1.contributors.append(user2)
        project2.contributors.append(user1)
        project2.contributors.append(user2)

        project1.languages.append(language2)
        project1.languages.append(language3)

        project2.languages.append(language1)
        project2.languages.append(language2)
        project2.languages.append(language3)
        project2.languages.append(language4)

        project3.languages.append(language2)
        db.session.commit()

        # notes
        note1 = Note(
            project_id=project1.id,
            content='Please remember about punctuation.'
        )

        db.session.add(note1)
        db.session.commit()

        # entries
        entry1 = Entry(
            project_id=project1.id,
            content='Press E to eat.',
            created_at='2025-01-01'
        )
        entry2 = Entry(
            project_id=project1.id,
            content='You can hide in the jungle to avoid predators.',
            created_at='2025-01-02'
        )
        entry3 = Entry(
            project_id=project2.id,
            content='Dodaj 1 szklankę mąki.',
            created_at='2025-01-03'
        )

        db.session.add(entry1)
        db.session.add(entry2)
        db.session.add(entry3)
        db.session.commit()

        # translations

        translation1 = Translation(
            project_id=project1.id,
            entry_id=entry1.id,
            author_id=user2.id,
            language_id=language2.id,
            content='Presiona E para comer.',
            accepted=True
        )
        translation2 = Translation(
            project_id=project1.id,
            entry_id=entry1.id,
            author_id=user2.id,
            language_id=language3.id,
            content='Appuyez sur E pour manger.',
        )
        translation3 = Translation(
            project_id=project1.id,
            entry_id=entry2.id,
            author_id=user2.id,
            language_id=language4.id,
            content='Sie können sich im Dschungel verstecken, um Raubtiere zu vermeiden.',
        )
        translation4 = Translation(
            project_id=project2.id,
            entry_id=entry3.id,
            author_id=user1.id,
            language_id=language1.id,
            content='Add 1 cup of flour.',
        )

        db.session.add(translation1)
        db.session.add(translation2)
        db.session.add(translation3)
        db.session.add(translation4)
        db.session.commit()

        # comments

        # comment1 = Comment(
        #     user_id=user1.id,
        #     entry_id=entry1.id,
        #     language_id=lang
        #     content='You forgot to translate the word "press".'
        # )

        # comment2 = Comment(
        #     user_id=user1.id,
        #     entry_id=entry2.id,
        #     content='Hello everyone!'
        # )

        # db.session.add(comment1)
        # db.session.commit()

        # votes

        vote1 = Vote(
            user_id=user1.id,
            translation_id=translation1.id,
            is_upvote=True
        )
        vote2 = Vote(
            user_id=user2.id,
            translation_id=translation2.id,
            is_upvote=False
        )

        db.session.add(vote1)
        db.session.add(vote2)
        db.session.commit()