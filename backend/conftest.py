import pytest
from app.app import create_app

@pytest.fixture()
def client():
    app = create_app(testing=True)
    with app.app_context():
        with app.test_client() as client:
            yield client