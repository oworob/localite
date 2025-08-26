from database.add_test_data import add_test_data

url = '/api/misc'

def test_get_app_stats(client):
    with client.application.app_context():
        add_test_data(client.application)

    response = client.get(f'{url}/app_stats')

    assert response.status_code == 200
    assert response.json['users'] == 3
    assert response.json['projects'] == 2
    assert response.json['entries'] == 3
    assert response.json['translations'] == 4
    assert response.json['languages'] == 9