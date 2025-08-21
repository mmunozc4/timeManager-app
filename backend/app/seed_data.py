from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
from models import Base, User, Business, Service, Employee, Client, Appointment
import bcrypt

# Reemplaza 'your_models_file' con el nombre de tu archivo que contiene los modelos
# Reemplaza 'sqlite:///./test.db' con la cadena de conexión de tu base de datos
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Pas123456@localhost:5433/timeManager_db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    # Genera el hash de la contraseña
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_sample_data():
    db = next(get_db())
    try:
        # Crea la estructura de la base de datos si no existe
        Base.metadata.create_all(bind=engine)

        print("Poblando la base de datos...")

        # --- 1. Crear un usuario de negocio ---
        hashed_pw_business = hash_password("business123")
        business_user = User(
            email="business@example.com",
            password_hash=hashed_pw_business,
            role="business"
        )
        db.add(business_user)
        db.commit()
        db.refresh(business_user)

        # Crear el negocio asociado
        business_profile = Business(
            name="Salón de Belleza 'Glamour'",
            address="Calle 10 # 5-20, Centro",
            phone="3001234567",
            user=business_user
        )
        db.add(business_profile)
        db.commit()
        db.refresh(business_profile)

        # --- 2. Crear un usuario cliente ---
        hashed_pw_client = hash_password("client123")
        client_user = User(
            email="client@example.com",
            password_hash=hashed_pw_client,
            role="client"
        )
        db.add(client_user)
        db.commit()
        db.refresh(client_user)

        # Crear el perfil del cliente asociado
        client_profile = Client(
            full_name="Ana García",
            phone="3109876543",
            address="Carrera 20 # 30-10",
            user=client_user
        )
        db.add(client_profile)
        db.commit()
        db.refresh(client_profile)

        # --- 3. Crear servicios para el negocio ---
        service_haircut = Service(
            name="Corte de cabello",
            description="Corte de cabello para hombre o mujer.",
            price=35.00,
            duration_minutes=45,
            business=business_profile
        )
        service_manicure = Service(
            name="Manicura y pedicura",
            description="Manicura y pedicura clásica con esmalte.",
            price=25.00,
            duration_minutes=60,
            business=business_profile
        )
        db.add_all([service_haircut, service_manicure])
        db.commit()
        db.refresh(service_haircut)
        db.refresh(service_manicure)

        # --- 4. Crear un empleado para el negocio ---
        employee_ana = Employee(
            name="Ana Torres",
            role="Estilista principal",
            phone="3011112233",
            business=business_profile
        )
        db.add(employee_ana)
        db.commit()
        db.refresh(employee_ana)

        # --- 5. Crear una cita de ejemplo ---
        appointment_date = datetime.now() + timedelta(days=2, hours=10)
        appointment = Appointment(
            appointment_time=appointment_date,
            status="scheduled",
            business=business_profile,
            service=service_haircut,
            employee=employee_ana,
            client=client_profile
        )
        db.add(appointment)
        db.commit()
        
        print("¡La base de datos se ha poblado con éxito!")

    except Exception as e:
        print(f"Ocurrió un error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()