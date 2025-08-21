import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import businesses, services, employees, appointments, clients, auth

app = FastAPI(title="API")

origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(businesses.router)
app.include_router(services.router)
app.include_router(employees.router)
app.include_router(appointments.router)
app.include_router(clients.router)
app.include_router(auth.router)
