
# lengths
USERNAME_MIN_LENGTH = 3
USERNAME_MAX_LENGTH = 30
PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 60
PASSWORD_HASH_MAX_LENGTH = 128
EMAIL_MAX_LENGTH = 50

PROJECT_TITLE_MIN_LENGTH = 3
PROJECT_TITLE_MAX_LENGTH = 100

PROJECT_DESCRIPTION_MAX_LENGTH = 1000

PROJECT_NOTE_CONTENT_MIN_LENGTH = 3
PROJECT_NOTE_CONTENT_MAX_LENGTH = 500
PROJECT_MAX_NOTE_COUNT = 5

LANGUAGE_CODE_LENGTH = 2
LANGUAGE_NAME_LENGTH = 50

ENTRY_CONTENT_MIN_LENGTH = 1
ENTRY_CONTENT_MAX_LENGTH = 1000
PROJECT_MAX_ENTRY_COUNT = 1000
ENTRY_CONTEXT_MAX_LENGTH = 1000
TRANSLATION_CONTENT_MIN_LENGTH = 1
TRANSLATION_CONTENT_MAX_LENGTH = 2000

MESSAGE_CONTENT_MAX_LENGTH = 1000

COMMENT_CONTENT_MAX_LENGTH = 1000

# regexes
EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
PASSWORD_REGEX = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$'
USERNAME_REGEX = r'^[a-zA-Z0-9_]+$'
