from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Employee, Business
from ..schemas import EmployeeCreate, EmployeeOut

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)

@router.post("/", response_model=EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(payload: EmployeeCreate, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == payload.business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    e = Employee(name=payload.name, role=payload.role, phone=payload.phone, business=business)
    db.add(e)
    db.commit()
    db.refresh(e)
    return e

@router.get("/", response_model=List[EmployeeOut])
def list_employees(business_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Employee).order_by(Employee.id)
    if business_id:
        query = query.filter(Employee.business_id == business_id)
    return query.all()

@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    e = db.query(Employee).filter(Employee.id == employee_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Employee not found")
    return e

@router.put("/{employee_id}", response_model=EmployeeOut)
def update_employee(employee_id: int, payload: EmployeeCreate, db: Session = Depends(get_db)):
    e = db.query(Employee).filter(Employee.id == employee_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    b = db.query(Business).filter(Business.id == payload.business_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Business not found")
        
    e.name = payload.name
    e.role = payload.role
    e.phone = payload.phone
    e.business = b
    db.commit()
    db.refresh(e)
    return e

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    deleted = db.query(Employee).filter(Employee.id == employee_id).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.commit()
    return None


@router.get("/by-business/{business_id}", response_model=List[EmployeeOut])
def get_employees_by_business(business_id: int, db: Session = Depends(get_db)):
    employees = db.query(Employee).filter(Employee.business_id == business_id).all()
    return employees
