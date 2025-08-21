from sqlalchemy import (
    Column, Integer, String, ForeignKey,
    DateTime, Numeric, func
)
from sqlalchemy.orm import relationship

from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # "admin", "business_owner", "client"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # relaciones
    business = relationship("Business", back_populates="user", uselist=False)
    client = relationship("Client", back_populates="user", uselist=False)

class Business(Base):
    __tablename__ = "businesses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    address = Column(String(300), nullable=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="business")
    services = relationship("Service", back_populates="business", cascade="all, delete-orphan")
    employees = relationship("Employee", back_populates="business", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="business", cascade="all, delete-orphan")



class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(String(1000), nullable=True)
    price = Column(Numeric(10,2), nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("Business", back_populates="services")
    appointments = relationship("Appointment", back_populates="service")

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    role = Column(String(100), nullable=True)
    phone = Column(String(50), nullable=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("Business", back_populates="employees")
    appointments = relationship("Appointment", back_populates="employee")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    appointment_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), default="pending", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id", ondelete="CASCADE"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False) 
    
    business = relationship("Business", back_populates="appointments")
    service = relationship("Service", back_populates="appointments")
    employee = relationship("Employee", back_populates="appointments")
    client = relationship("Client", back_populates="appointments")  


class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    address = Column(String(200), nullable=True)
    notes = Column(String(500), nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), unique=True) 
    
    user = relationship("User", back_populates="client")
    appointments = relationship("Appointment", back_populates="client", cascade="all, delete")

