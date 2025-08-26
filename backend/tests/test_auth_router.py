from app.config import EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH, USERNAME_MAX_LENGTH
from app.models.user import User
from database.db import db

url = '/api/auth'

new_user = {
    'username': 'new_user',
    'email': 'new_user@example.com',
    'password': 'Password1!'
}

user = {
    'username': 'user',
    'email': 'user@example.com',
    'password': 'Password2!'
}

def add_existing_user(client):
    with client.application.app_context():
        added_user = User(username=user['username'], email=user['email'])
        added_user.set_password(user['password'])
        db.session.add(added_user)
        db.session.commit()

def test_register(client):
    response = client.post(f'{url}/register', json=new_user)
    assert response.status_code == 201
    assert 'id' in response.json

def test_register_missing_fields(client):
    response = client.post(f'{url}/register', json={})
    assert response.status_code == 400

def test_register_existing_user(client):
    add_existing_user(client)
    
    # existing username
    response = client.post(f'{url}/register', json={**new_user, 'username': 'user'})
    assert response.status_code == 400

    # existing email
    response = client.post(f'{url}/register', json={**new_user, 'email': 'user@example.com'})
    assert response.status_code == 400
    
def test_register_invalid_email(client):
    response = client.post(f'{url}/register', json={**new_user, 'email': 'invalid_email'})
    assert response.status_code == 400

    response = client.post(f'{url}/register', json={**new_user, 'email': 'a' * EMAIL_MAX_LENGTH + '@example.com'})
    assert response.status_code == 400

def test_register_invalid_username(client):
    response = client.post(f'{url}/register', json={**new_user, 'username': 'invalid username'})
    assert response.status_code == 400

    response = client.post(f'{url}/register', json={**new_user, 'username': 'u'})
    assert response.status_code == 400

    response = client.post(f'{url}/register', json={**new_user, 'username': 'u' * (USERNAME_MAX_LENGTH + 1)})
    assert response.status_code == 400

def test_register_invalid_password(client):
    response = client.post(f'{url}/register', json={**new_user, 'password': 'password'})
    assert response.status_code == 400

    response = client.post(f'{url}/register', json={**new_user, 'password': 'Pass1!'})
    assert response.status_code == 400

    response = client.post(f'{url}/register', json={**new_user, 'password': 'P' * PASSWORD_MAX_LENGTH + '1!a'})
    assert response.status_code == 400

def test_login_invalid(client):
    response = client.post(f'{url}/login', json={**user, 'password': 'wrong_password'})
    assert response.status_code == 401

    response = client.post(f'{url}/login', json={**user, 'username': 'nonexistent_user'})
    assert response.status_code == 401

def test_get_current_user(client):
    add_existing_user(client)

    response = client.get(f'{url}/current_user')
    assert response.status_code == 401

    response = client.post(f'{url}/login', json=user)
    assert response.status_code == 200
    
    response = client.get(f'{url}/current_user')
    assert response.status_code == 200
    assert 'id' in response.json
    assert response.json['username'] == user['username']

    response = client.post(f'{url}/logout')
    assert response.status_code == 200

    response = client.get(f'{url}/current_user')
    assert response.status_code == 401




    
