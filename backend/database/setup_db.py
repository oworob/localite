from .db import db
from sqlalchemy import text
def setup_db(app, reset_db=False):
    db.init_app(app)

    with app.app_context():
        try:
            db.session.execute(text('SELECT 1'))
            print('------ Connected to database')
        except Exception as e:
            print('------ Failed to connect to database:', e)

        if reset_db:
            db.drop_all()
            db.create_all()
            print('------ Database tables deleted and created')