from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title='PolarOps API - POLARIS Command')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {
        'status': 'offline-ready',
        'mission': 'PolarOps - POLARIS Expedition Command',
        'system': 'Online',
        'telemetry': '100% Signal Integrity',
        'stations': ['Bharati', 'Maitri', 'Himadri']
    }

@app.get('/api/locations')
def get_locations(db: Session = Depends(get_db)):
    locs = db.query(models.Location).all()
    return [{"id": l.id, "name": l.name, "type": l.type, "coordinates": l.coordinates} for l in locs]

@app.get('/api/missions')
def get_missions(db: Session = Depends(get_db)):
    missions = db.query(models.Mission).all()
    return [{"id": m.id, "name": m.name, "priority": m.priority, "status": m.status} for m in missions]

@app.get('/api/inventory')
def get_inventory(db: Session = Depends(get_db)):
    lots = db.query(models.StockLot).all()
    return [{"id": lot.id, "batch": lot.batch, "quantity": lot.quantity, "item_type_id": lot.item_type_id} for lot in lots]

@app.get('/api/assets')
def get_assets(db: Session = Depends(get_db)):
    assets = db.query(models.Asset).all()
    return [{"id": a.id, "serial_number": a.serial_number, "condition": a.condition, "location_id": a.location_id} for a in assets]
