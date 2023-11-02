from app import db  # Assuming you've defined 'db' in your main app module

class Task(db.Model):
    """Task model"""
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    completed = db.Column(db.Boolean, default=False)

    def __init__(self, title, completed=False):
        self.title = title
        self.completed = completed

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'completed': self.completed
        }