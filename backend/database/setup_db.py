from .db import db
from sqlalchemy import text
from .init_data import init_data

def setup_db(app, add_init_data=False):
    db.init_app(app)

    with app.app_context(): # Test connection
        try:
            db.session.execute(text('SELECT 1'))
            print('------ Connected to database')
        except Exception as e:
            print('------ Failed to connect to database:', e)

    if add_init_data:
        with app.app_context(): # Create tables for all models
            db.drop_all()
            db.create_all()
            print('------ Database tables created')
            init_data(app)
            print('------ Added initial data to database')