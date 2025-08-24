url = '/api/misc'

def test_get_app_stats(client):
    response = client.get(f'{url}/app_stats')
    
    assert response.status_code == 200
    assert response.json['users'] == 5
    assert response.json['projects'] == 3
    assert response.json['entries'] == 3
    assert response.json['translations'] == 4
    assert response.json['languages'] == 10