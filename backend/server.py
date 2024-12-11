from flask import Flask, Blueprint
from flask_cors import CORS
from flask_login import LoginManager
from app.tools.limiter import limiter
from database.setup_db import setup_db
from app.models.user import User

from app.routes.auth_router import auth_router
from app.routes.config_router import config_router
from app.routes.project_router import project_router
from app.routes.user_router import user_router
from app.routes.misc_router import misc_router
from app.routes.language_router import language_router

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# App Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost:5432/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'very secret key' # change later


# Initialize the database
setup_db(app, add_init_data=True)

# Login Manager
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

# limiter = Limiter(
#     get_remote_address,
#     app=app,
#     default_limits=["100 per day", "20 per hour"]
# )
limiter.init_app(app)

# Routes
api = Blueprint('api', __name__, url_prefix='/api')
api.register_blueprint(auth_router)
api.register_blueprint(config_router)
api.register_blueprint(project_router)
api.register_blueprint(user_router)
api.register_blueprint(misc_router)
api.register_blueprint(language_router)
app.register_blueprint(api)

if __name__ == '__main__':
    # app.run(debug=True)
    app.run()