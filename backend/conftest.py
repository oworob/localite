import pytest
from app.app import create_app
from database.init_data import init_data
from database.db import db

@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.app_context():
        db.drop_all()
        db.create_all()
        init_data(app)
        with app.test_client() as client:
            yield client