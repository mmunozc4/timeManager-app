from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta, timezone
from models import Base, User, Business, Service, Employee, Client, Appointment
import bcrypt

# Configuración de conexión
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Pas123456@localhost:5433/timeManager_db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_sample_data():
    db = next(get_db())
    try:
        # Limpieza básica para repoblar sin duplicados
        db.query(Appointment).delete()
        db.query(Service).delete()
        db.query(Employee).delete()
        db.query(Client).delete()
        db.query(Business).delete()
        db.query(User).delete()
        db.commit()

        # === Usuarios (roles válidos: "business" y "client") ===
        user_business = User(
            email="owner@beauty.com",
            password_hash=hash_password("password123"),
            role="business"
        )
        user_client = User(
            email="client@example.com",
            password_hash=hash_password("clientpass"),
            role="client"
        )
        db.add_all([user_business, user_client])
        db.commit()

        # === Negocio (pertenece al user con role=business) ===
        business = Business(
            name="Glamour Salon",
            address="Calle 123 #45-67",
            phone="3001234567",
            user_id=user_business.id
        )
        db.add(business)
        db.commit()

        # === Servicios del negocio ===
        services = [
            Service(
                name="Corte de cabello",
                description="Corte clásico y moderno",
                price=30000,
                duration_minutes=30,
                business_id=business.id
            ),
            Service(
                name="Manicure",
                description="Manicure profesional",
                price=20000,
                duration_minutes=40,
                business_id=business.id
            ),
            Service(
                name="Maquillaje",
                description="Maquillaje para eventos",
                price=80000,
                duration_minutes=60,
                business_id=business.id
            ),
        ]
        db.add_all(services)
        db.commit()

        # === Empleados del negocio ===
        employees = [
            Employee(name="Laura Gómez", role="Estilista", phone="3009876543", business_id=business.id),
            Employee(name="Carlos Ruiz", role="Barbero", phone="3014567890", business_id=business.id),
        ]
        db.add_all(employees)
        db.commit()

        # === Cliente vinculado a user con role=client ===
        client = Client(
            full_name="Ana Torres",
            phone="3021122334",
            email="anatorres@example.com",
            address="Cra 50 #20-15",
            notes="Prefiere atención en la tarde",
            user_id=user_client.id
        )
        db.add(client)
        db.commit()

        # === Citas (fechas conscientes de zona horaria UTC) ===
        now_utc = datetime.now(timezone.utc)
        appointments = [
            Appointment(
                appointment_time=now_utc + timedelta(days=1, hours=3),
                status="pending",
                business_id=business.id,
                service_id=services[0].id,
                employee_id=employees[0].id,
                client_id=client.id
            ),
            Appointment(
                appointment_time=now_utc + timedelta(days=2, hours=5),
                status="confirmed",
                business_id=business.id,
                service_id=services[2].id,
                employee_id=employees[1].id,
                client_id=client.id
            ),
        ]
        db.add_all(appointments)
        db.commit()

        print("✅ ¡La base de datos se ha poblado con éxito con roles 'business' y 'client'!")

    except Exception as e:
        print(f"❌ Ocurrió un error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()
