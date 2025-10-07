import getpass
from sqlmodel import Session, select
from app.db import engine
from app.models import User
from app.security import get_password_hash

def create_superuser():
    email = input("Email: ").strip()
    full_name = input("Full name (optional): ").strip()
    password = getpass.getpass("Password: ")
    password2 = getpass.getpass("Password (again): ")
    if password != password2:
        print("Passwords do not match")
        return
    with Session(engine) as session:
        exists = session.exec(select(User).where(User.email == email)).first()
        if exists:
            print("User with this email already exists")
            return
        u = User(email=email, full_name=full_name or None, hashed_password=get_password_hash(password), is_superuser=True)
        session.add(u)
        session.commit()
        print("Superuser created:", email)

if __name__ == "__main__":
    create_superuser()
