import sys
sys.path.append('../app')

from app.db import Base, engine
from app.models import Product, User, Order

Base.metadata.create_all(bind=engine)
