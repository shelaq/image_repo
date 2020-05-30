from flask import request, render_template, jsonify, url_for, redirect, g
from .models import User, Image
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token


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
@app.route("/images/all", methods=["GET"])
@requires_auth
def images_all():
    return jsonify(result=g.current_user)

@app.route("/images/<id>", methods=["GET"])
@requires_auth
def images_id(id):
    return jsonify(result=g.current_user)

@app.route("/image/new", methods=["POST"])
@requires_auth
def image_new():
    incoming = request.get_json()
    image = Image(
        user_id=g.current_user.id,
        data=incoming["data"]
    )
    db.session.add(image)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="Error inserting image in database"), 500

    return jsonify(
        id=image.id,
        data=image.data,
        categories=image.categories,
        public=image.public
    )

@app.route("/image/edit", methods=["POST"])
@requires_auth
def image_edit():
    return jsonify(result=g.current_user)
