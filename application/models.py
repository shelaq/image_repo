from index import db, bcrypt


class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    images = db.relationship('Image', backref='user', lazy=True)

    def __init__(self, email, password):
        self.email = email
        self.active = True
        self.password = User.hashed_password(password)

    @staticmethod
    def hashed_password(password):
        return bcrypt.generate_password_hash(password).decode("utf-8")

    @staticmethod
    def get_user_with_email_and_password(email, password):
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return None

class Image(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False)
    data = db.Column(db.LargeBinary())
    categories = db.Column(db.String(255))
    public = db.Column(db.Integer())
    file_name = db.Column(db.String(255))

    def __init__(self, user_id, file_name, data):
        self.data = data
        self.categories = ''
        self.public = 0
        self.user_id = User.query.get(user_id).id
        self.file_name = file_name

    @staticmethod
    def get_all_public_images():
        images = Image.query.filter(Image.public == 1)
        return images

    @staticmethod
    def get_allowed_images_from_user(queried_user, querying_user):
        if queried_user == querying_user:
            return Image.query.filter(Image.user_id == querying_user)
        else:
            return Image.query.filter((Image.user_id == queried_user) & Image.public)
