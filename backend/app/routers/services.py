from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Service, Business
from ..schemas import ServiceCreate, ServiceOut

router = APIRouter(
    prefix="/services",
    tags=["Services"]
)

@router.post("/", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
def create_service(payload: ServiceCreate, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == payload.business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    s = Service(
        name=payload.name,
        description=payload.description,
        price=payload.price,
        duration_minutes=payload.duration_minutes,
        business=business
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    return s

@router.get("/", response_model=List[ServiceOut])
def list_services(db: Session = Depends(get_db)):
    return db.query(Service).order_by(Service.id).all()

@router.get("/{service_id}", response_model=ServiceOut)
def get_service(service_id: int, db: Session = Depends(get_db)):
    s = db.query(Service).filter(Service.id == service_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Service not found")
    return s

@router.put("/{service_id}", response_model=ServiceOut)
def update_service(service_id: int, payload: ServiceCreate, db: Session = Depends(get_db)):
    s = db.query(Service).filter(Service.id == service_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Service not found")
        
    b = db.query(Business).filter(Business.id == payload.business_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Business not found")
    
    s.name = payload.name
    s.description = payload.description
    s.price = payload.price
    s.duration_minutes = payload.duration_minutes
    s.business = b
    db.commit()
    db.refresh(s)
    return s

@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(service_id: int, db: Session = Depends(get_db)):
    deleted = db.query(Service).filter(Service.id == service_id).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Service not found")
    db.commit()
    return None

@router.get("/by-business/{business_id}", response_model=List[ServiceOut])
def get_services_by_business(business_id: int, db: Session = Depends(get_db)):
    services = db.query(Service).filter(Service.business_id == business_id).all()
    if not services:
        raise HTTPException(status_code=404, detail="No se encontraron servicios para este comercio")
    return services
