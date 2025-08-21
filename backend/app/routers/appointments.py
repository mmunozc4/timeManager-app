from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import Appointment, Business, Service, Employee, Client
from ..schemas import AppointmentCreate, AppointmentOut

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)

@router.post("/", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == payload.business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    service = db.query(Service).filter(Service.id == payload.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    employee = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    client = db.query(Client).filter(Client.id == payload.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    if service.business_id != business.id or employee.business_id != business.id:
        raise HTTPException(
            status_code=400,
            detail="Service and Employee must belong to the given Business"
        )

    overlap = db.query(Appointment).filter(
        Appointment.employee_id == payload.employee_id,
        Appointment.appointment_time == payload.appointment_time
    ).first()
    if overlap:
        raise HTTPException(status_code=400, detail="Employee already has an appointment at that time")

    appt = Appointment(
        appointment_time=payload.appointment_time,
        status="pending",
        business=business,
        service=service,
        employee=employee,
        client=client
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)

    return db.query(Appointment).options(
        joinedload(Appointment.business),
        joinedload(Appointment.service),
        joinedload(Appointment.employee),
        joinedload(Appointment.client)
    ).filter(Appointment.id == appt.id).first()


@router.get("/", response_model=List[AppointmentOut])
def list_appointments(db: Session = Depends(get_db)):
    appts = db.query(Appointment).options(
        joinedload(Appointment.business),
        joinedload(Appointment.service),
        joinedload(Appointment.employee),
        joinedload(Appointment.client)
    ).order_by(Appointment.id).all()
    return appts



@router.get("/{appointment_id}", response_model=AppointmentOut)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    a = db.query(Appointment).options(
        joinedload(Appointment.business),
        joinedload(Appointment.service),
        joinedload(Appointment.employee),
        joinedload(Appointment.client)
    ).filter(Appointment.id == appointment_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return a


@router.patch("/{appointment_id}/accept", response_model=AppointmentOut)
def accept_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appt.status = "accepted"
    db.commit()

    return db.query(Appointment).options(
        joinedload(Appointment.business),
        joinedload(Appointment.service),
        joinedload(Appointment.employee),
        joinedload(Appointment.client)
    ).filter(Appointment.id == appointment_id).first()


@router.patch("/{appointment_id}/cancel", response_model=AppointmentOut)
def cancel_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appt.status = "cancelled"
    db.commit()

    return db.query(Appointment).options(
        joinedload(Appointment.business),
        joinedload(Appointment.service),
        joinedload(Appointment.employee),
        joinedload(Appointment.client)
    ).filter(Appointment.id == appointment_id).first()


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    deleted = db.query(Appointment).filter(Appointment.id == appointment_id).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.commit()
    return None


@router.get("/client/{client_id}", response_model=List[AppointmentOut])
def get_appointments_by_client(client_id: int, db: Session = Depends(get_db)):
    appts = db.query(Appointment).options(
        joinedload(Appointment.business),
        joinedload(Appointment.service),
        joinedload(Appointment.employee),
        joinedload(Appointment.client)
    ).filter(Appointment.client_id == client_id).order_by(Appointment.appointment_time).all()

    if not appts:
        return []

    return appts

@router.get("/business/{business_id}", response_model=List[AppointmentOut])
def get_appointments_by_business(business_id: int, db: Session = Depends(get_db)):
    appts = db.query(Appointment).options(
        joinedload(Appointment.business),
        joinedload(Appointment.service),
        joinedload(Appointment.employee),
        joinedload(Appointment.client)
    ).filter(Appointment.business_id == business_id).order_by(Appointment.appointment_time).all()

    return appts