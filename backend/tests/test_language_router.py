from tests.helpers import add_test_languages, add_test_user, login_test_user

url = '/api/languages/'

def test_get_all(client):
    add_test_languages(client)
    add_test_user(client)
    login_test_user(client)
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.json) == 3