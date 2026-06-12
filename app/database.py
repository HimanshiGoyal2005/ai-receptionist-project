from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import get_settings

settings = get_settings()

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    from app.models import user, company, lead, conversation, appointment, call_log
    Base.metadata.create_all(bind=engine)
    _ensure_lead_columns()


def _ensure_lead_columns():
    inspector = inspect(engine)
    if "leads" not in inspector.get_table_names():
        return

    existing = [column["name"] for column in inspector.get_columns("leads")]
    columns_to_add = []

    if "team_size" not in existing:
        columns_to_add.append("team_size VARCHAR")
    if "industry" not in existing:
        columns_to_add.append("industry VARCHAR")
    if "lead_score" not in existing:
        columns_to_add.append("lead_score VARCHAR")

    if columns_to_add:
        with engine.begin() as conn:
            for column_sql in columns_to_add:
                conn.execute(text(f"ALTER TABLE leads ADD COLUMN {column_sql}"))