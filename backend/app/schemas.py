from typing import List, Literal, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


from pydantic import BaseModel

Role = Literal["client", "business"]


class ClientBase(BaseModel):
    full_name: str
    phone: str
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    notes: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    pass

class ClientOut(ClientBase):
    id: int
    full_name: str
    class Config:
        from_attributes = True
class BusinessCreate(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None

class BusinessOut(BusinessCreate):
    id: int
    name: str
    class Config:
        from_attributes = True

class ServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[float] = None
    duration_minutes: Optional[int] = None
    business_id: int

class ServiceOut(ServiceCreate):
    id: int
    name: str
    class Config:
        from_attributes = True

class EmployeeCreate(BaseModel):
    name: str
    role: Optional[str] = None
    phone: Optional[str] = None
    business_id: int

class EmployeeOut(EmployeeCreate):
    id: int
    name: str
    class Config:
        from_attributes = True

class BusinessNested(BaseModel):
    id: int
    name: str
    address: Optional[str]
    phone: Optional[str]
    class Config:
        orm_mode = True

class ServiceNested(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: Optional[float]
    duration_minutes: Optional[int]
    class Config:
        orm_mode = True


class AppointmentBase(BaseModel):
    appointment_time: datetime = Field(..., description="Fecha y hora de la cita")
    status: Optional[str] = Field(default="pending", description="Estado de la cita")
    business_id: int
    service_id: int
    employee_id: int
    client_id: int 

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    appointment_time: Optional[datetime]
    status: Optional[str]
    business_id: Optional[int]
    service_id: Optional[int]
    employee_id: Optional[int]
    client_id: Optional[int] 

class AppointmentOut(BaseModel):
    id: int
    appointment_time: datetime
    status: str
    created_at: datetime
    business: BusinessOut
    service: ServiceOut
    employee: EmployeeOut
    client: ClientOut

    class Config:
        orm_mode = True


class RegisterUser(BaseModel):
    email: EmailStr
    password: str
    role: Role
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None

class LoginUser(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class MeResponse(BaseModel):
    user_id: int
    email: EmailStr
    role: Role
    client_id: Optional[int] = None
    business_id: Optional[int] = None