import os
from flask import Flask, Blueprint
from flask_cors import CORS
from flask_login import LoginManager
from app.tools.limiter import limiter
from database.setup_db import setup_db
from app.models.user import User
from dotenv import load_dotenv

from app.routes.auth_router import auth_router
from app.routes.project_router import project_router
from app.routes.user_router import user_router
from app.routes.misc_router import misc_router
from app.routes.language_router import language_router
from app.routes.message_router import message_router
from app.routes.translation_router import translation_router

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
CORS(app, resources={r"/api/*": {"origins": f"http://localhost:{os.getenv('CLIENT_PORT')}"}}, supports_credentials=True)

# App Config

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SERVER_SECRET_KEY')


# Initialize the database
setup_db(app, add_init_data=False)

# Login Manager
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

limiter.init_app(app)

# Routes
api = Blueprint('api', __name__, url_prefix='/api')
api.register_blueprint(auth_router)
api.register_blueprint(project_router)
api.register_blueprint(user_router)
api.register_blueprint(misc_router)
api.register_blueprint(language_router)
api.register_blueprint(message_router)
api.register_blueprint(translation_router)
app.register_blueprint(api)

if __name__ == '__main__':
    # app.run(debug=True)
    app.run()