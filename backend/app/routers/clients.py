
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models
from .. import schemas

router = APIRouter(
    prefix="/clients",
    tags=["Clients"]
)

@router.post("/", response_model=schemas.ClientOut, status_code=status.HTTP_201_CREATED)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    if client.email:
        existing_email = db.query(models.Client).filter(models.Client.email == client.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )

    new_client = models.Client(**client.dict())
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client

@router.get("/", response_model=List[schemas.ClientOut])
def get_clients(db: Session = Depends(get_db)):
    return db.query(models.Client).all()

@router.get("/{client_id}", response_model=schemas.ClientOut)
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")
    return client

@router.put("/{client_id}", response_model=schemas.ClientOut)
def update_client(client_id: int, updated_client: schemas.ClientUpdate, db: Session = Depends(get_db)):
    client_db = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")

    if updated_client.email:
        existing_email = db.query(models.Client).filter(
            models.Client.email == updated_client.email,
            models.Client.id != client_id
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado por otro cliente"
            )

    for key, value in updated_client.dict(exclude_unset=True).items():
        setattr(client_db, key, value)

    db.commit()
    db.refresh(client_db)
    return client_db

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")

    db.delete(client)
    db.commit()
    return None
