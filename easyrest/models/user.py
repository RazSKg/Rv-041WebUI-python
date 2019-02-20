"""This module describe data model for "users" table"""

from sqlalchemy import (
    Column,
    Integer,
    Text,
    Date,
    ForeignKey,
    Boolean
)
from sqlalchemy.orm import relationship
from passlib.hash import pbkdf2_sha256

from .meta import Base
from validator import validation


class User(Base):
    """The data model of "users" table.

    Defines data structure of "users" table and methods of
    working with the model.

    Relationships:
        User->Restaurant: one to many
        User->Token: one to many
        User->UserStatus: one to one
    """
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(Text)
    email = Column(Text, unique=True)
    phone_number = Column(Text)
    birth_date = Column(Date)
    password = Column(Text)
    role_id = Column(Integer, ForeignKey('user_roles.id'), default=1)
    administrator_id = Column(Integer, ForeignKey('users.id'))
    rest_id = Column(Integer, ForeignKey('restaurants.id'))
    # waiter_id = Column(Integer, ForeignKey('users.id'))
    is_active = Column(Boolean, default=False)

    tokens = relationship('Token')
    role = relationship('UserRole')
    restaurants = relationship(
        'Restaurant', foreign_keys="[Restaurant.owner_id]")
    restaurant = relationship(
        'Restaurant', foreign_keys="[User.rest_id]")
    orders = relationship(
        'Order', foreign_keys="[Order.user_id]")
    w_orders = relationship(
        'Order', foreign_keys="[Order.waiter_id]")
    # waiters = relationship('User', remote_side=[
    #                        id], foreign_keys="[User.administrator_id]")
    # administrator = relationship('User', remote_side=administrator_id)

    @staticmethod
    def add(database, form_data):
        """Method for writing user data to a database.

        Method gets the database session and form data.
        Validates form inputs according to json schema,
        hashes the password and writes everything into the database.

        :param database: Database session
        :param form_data: JSON-decoded variant of the form inputs

        """
        schema = {
            "description": "Validate form inputs",
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "email": {"type": "string", "format": "email"},
                "password": {"type": "string", "minLength": 8}
            },
            "required": ["name", "email", "password"]
        }
        validation(schema, form_data)
        name = form_data['name']
        email = form_data['email']
        password = form_data['password']
        password_hash = pbkdf2_sha256.hash(password)

        database.add(User(name=name, email=email, password=password_hash))
