"""empty message

Revision ID: 51365b8b5c24
Revises: 306c8989129d
Create Date: 2020-05-29 23:50:19.561139

"""

# revision identifiers, used by Alembic.
revision = '51365b8b5c24'
down_revision = '306c8989129d'

from alembic import op
import sqlalchemy as sa


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('image')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('image',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('data', sa.BLOB(), nullable=True),
    sa.Column('categories', sa.VARCHAR(length=255), nullable=True),
    sa.Column('public', sa.INTEGER(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###
