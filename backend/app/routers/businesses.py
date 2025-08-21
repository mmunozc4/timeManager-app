from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Business
from ..schemas import BusinessCreate, BusinessOut

router = APIRouter(
    prefix="/businesses",
    tags=["Businesses"]
)

@router.post("/", response_model=BusinessOut, status_code=status.HTTP_201_CREATED)
def create_business(payload: BusinessCreate, db: Session = Depends(get_db)):
    exists = db.query(Business).filter(Business.name == payload.name).first()
    if exists:
        raise HTTPException(status_code=400, detail="Business with that name already exists")
    b = Business(name=payload.name, address=payload.address, phone=payload.phone)
    db.add(b)
    db.commit()
    db.refresh(b)
    return b

@router.get("/", response_model=List[BusinessOut])
def list_businesses(db: Session = Depends(get_db)):
    items = db.query(Business).order_by(Business.id).all()
    return items

@router.get("/{business_id}", response_model=BusinessOut)
def get_business(business_id: int, db: Session = Depends(get_db)):
    b = db.query(Business).filter(Business.id == business_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Business not found")
    return b

@router.put("/{business_id}", response_model=BusinessOut)
def update_business(business_id: int, payload: BusinessCreate, db: Session = Depends(get_db)):
    b = db.query(Business).filter(Business.id == business_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Business not found")
    b.name = payload.name
    b.address = payload.address
    b.phone = payload.phone
    db.commit()
    db.refresh(b)
    return b

@router.delete("/{business_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_business(business_id: int, db: Session = Depends(get_db)):
    deleted = db.query(Business).filter(Business.id == business_id).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Business not found")
    db.commit()
    return None