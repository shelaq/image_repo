from flask import request, render_template, jsonify, url_for, redirect, g, send_file
from .models import User, Image
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token
from werkzeug.utils import secure_filename
import io


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    return jsonify(result=g.current_user)


@app.route("/api/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    user = User(
        email=incoming["email"],
        password=incoming["password"]
    )
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="User with that email already exists"), 409

    new_user = User.query.filter_by(email=incoming["email"]).first()

    return jsonify(
        id=user.id,
        token=generate_token(new_user)
    )


@app.route("/api/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(incoming["email"], incoming["password"])
    if user:
        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403

"""------------------ Image endpoints -----------------------"""
@app.route("/api/all_public_images", methods=["GET"])
@requires_auth
def all_public_images():
    all_allowed_images = Image.get_all_public_images()  # Permissions
    result = []
    for image in all_allowed_images:
        result.append({
            'id':image.id,
            'categories':image.categories,
            'public':image.public,
            'file_name':image.file_name
        })
    return jsonify(result=result)

@app.route("/api/all_images_by_user/<user_id>", methods=["GET"])
@requires_auth
def all_images_by_user(user_id):
    all_images_by_user = Image.get_allowed_images_from_user(int(user_id), g.current_user['id'])  # Permissions
    result = []
    for image in all_images_by_user:
        result.append({
            'id':image.id,
            'categories':image.categories,
            'public':image.public,
            'file_name':image.file_name
        })
    return jsonify(result=result)

@app.route("/api/image/<id>", methods=["GET"])
@requires_auth
def get_image(id):
    image = Image.query.get(int(id))
    if image.user_id != g.current_user['id'] and not image.public:  # Permissions control
        return jsonify(error=True), 403

    return jsonify(
        id=image.id,
        categories=image.categories,
        public=image.public,
        file_name=image.file_name
    )

@app.route("/api/image/<id>", methods=["POST"])
@requires_auth
def edit_image(id):
    image = Image.query.get(id)
    if image.user_id != g.current_user['id'] :  # Permissions control
        return jsonify(result=g.current_user)

    incoming = request.get_json()
    image.categories = incoming["categories"]
    image.public = incoming["public"]

    db.session.commit()

    return jsonify(
        id=image.id,
        categories=image.categories,
        public=image.public,
        file_name=image.file_name
    )

@app.route("/api/image_file/<id>", methods=["GET"])
@requires_auth
def get_image_file(id):
    image = Image.query.get(id)
    if image.user_id == g.current_user['id'] or image.public:  # Permissions control
        return send_file(io.BytesIO(image.data), attachment_filename=image.file_name)
    else:
        return jsonify(error=True), 403

@app.route("/api/image_file", methods=["POST"])
@requires_auth
def new_image():
    file = request.files['image_data']
    image = Image(
        user_id=g.current_user['id'],
        data=file.read(),
        file_name=secure_filename(file.filename)
    )
    db.session.add(image)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="Error inserting image in database"), 500

    return jsonify(
        id=image.id,
        categories=image.categories,
        public=image.public,
        file_name=image.file_name
    )
