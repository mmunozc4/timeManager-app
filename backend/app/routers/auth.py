# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Client, Business
from app.auth_utils import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user
from app.schemas import RegisterUser, LoginUser, Token, MeResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=Token)
def register(user_data: RegisterUser, db: Session = Depends(get_db)):
    # 1) Verifica email único
    print(user_data)
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    hashed_pw = hash_password(user_data.password)
    new_user = User(email=user_data.email, password_hash=hashed_pw, role=user_data.role)

    if user_data.role == "business":
        business = Business(name=user_data.name, phone=user_data.phone, address=user_data.address, user=new_user)
        db.add(business)
        # opcional: también enlazar FK en User si deseas
        new_user.business = business

    elif user_data.role == "client":
        client = Client(full_name=user_data.name, phone=user_data.phone or "", address=user_data.address, user=new_user)
        db.add(client)
        new_user.client = client

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id), "role": new_user.role, "email": new_user.email})
    return Token(access_token=token)

@router.post("/login", response_model=Token)
def login(credentials: LoginUser, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return Token(access_token=token)

@router.get("/me", response_model=MeResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Devuelve info del usuario y, según el rol:
    - client_id si es cliente
    - business_id si es comercio
    Si no existiera la entidad relacionada (raro tras register), la crea automáticamente.
    """
    client_id = None
    business_id = None

    if current_user.role == "client":
        client = current_user.client
        if not client:
            client = Client(full_name=current_user.email, phone="", user=current_user)
            db.add(client)
            db.commit()
            db.refresh(client)
        client_id = client.id

    elif current_user.role == "business":
        business = current_user.business
        if not business:
            business = Business(name=current_user.email, phone="", address="", user=current_user)
            db.add(business)
            db.commit()
            db.refresh(business)
        business_id = business.id

    return MeResponse(
        user_id=current_user.id,
        email=current_user.email,
        role=current_user.role, 
        client_id=client_id,
        business_id=business_id
    )
