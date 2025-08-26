from app.models.user import User
from app.models.language import Language
from database.db import db


def add_test_user(client):
    with client.application.app_context():
        user = User(username='user', email='user@example.com')
        user.set_password('user')
        db.session.add(user)
        db.session.commit()

def login_test_user(client):
    response = client.post('/api/auth/login', json={
        'username': 'user',
        'password': 'user'
    })
    assert response.status_code == 200

def add_test_languages(client):
    with client.application.app_context():
        language1 = Language(code='en', title_eng='English', title_native='English')
        language2 = Language(code='es', title_eng='Spanish', title_native='Español')
        language3 = Language(code='fr', title_eng='French', title_native='Français')
        db.session.add(language1)
        db.session.add(language2)
        db.session.add(language3)
        db.session.commit()