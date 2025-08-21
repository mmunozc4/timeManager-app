from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from .config import settings


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Decodifica el token y devuelve el usuario autenticado."""
    print("TOKEN:", token)
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o faltante",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        print("PAYLOAD:", payload)

        user_id = payload.get("sub")
        print("USER ID:", user_id)

        if user_id is None:
            raise credentials_exc
    except JWTError as e:
        print("JWT ERROR:", e)
        raise credentials_exc

    user = db.query(User).filter(User.id == user_id).first()
    print("USER FROM DB:", user)
    
    if user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user
