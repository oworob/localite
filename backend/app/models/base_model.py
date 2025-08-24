from sqlalchemy.orm import as_declarative
from sqlalchemy import Column, Integer, DateTime
from datetime import datetime

@as_declarative()
class BaseModel:

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now)

    def to_dict(self, follow=[]):
        data = {column.name: getattr(self, column.name) for column in self.__table__.columns}

        dont_return = ['password', 'password_hash']
        for key in dont_return:
            if key in data:
                del data[key]
        
        follow_dict = {item.split('.')[0]: [] for item in follow}

        for item in follow:
            parts = item.split('.')
            if len(parts) > 1:
                follow_dict[parts[0]].append('.'.join(parts[1:]))
            else:
                follow_dict[parts[0]] = []

        for key, nested_follow in follow_dict.items():
            if hasattr(self, key):
                related_obj = getattr(self, key)
                if isinstance(related_obj, list):
                    data[key] = [obj.to_dict(follow=nested_follow) for obj in related_obj]
                else:
                    data[key] = related_obj.to_dict(follow=nested_follow)
        return data