from slugify import slugify
from sqlmodel import select
from .models import Product

def generate_unique_slug(session, name: str, sku: str):
    base = slugify(name or sku) or slugify(sku)
    slug = base
    i = 1
    while session.exec(select(Product).where(Product.slug == slug)).first():
        slug = f"{base}-{i}"
        i += 1
    return slug