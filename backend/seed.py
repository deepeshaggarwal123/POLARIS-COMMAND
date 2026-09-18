from database import SessionLocal, engine
import models
import datetime
from sqlalchemy.orm import Session

def seed_data():
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Create Locations
    hub = models.Location(name="Cape Town Supply Hub", type="HUB", coordinates="[-33.92, 18.42]")
    station = models.Location(name="Bharati Station", type="STATION", coordinates="[-69.4, 76.19]")
    camp = models.Location(name="Ice Shelf Camp Alpha", type="CAMP", coordinates="[-70.1, 75.0]")
    db.add_all([hub, station, camp])
    db.commit()

    # Create Item Types
    drill = models.ItemType(name="Ice Core Drill", unit="pieces", category="equipment")
    battery = models.ItemType(name="High-Cap Polar Battery", unit="pieces", category="equipment")
    fuel = models.ItemType(name="Aviation Fuel", unit="liters", category="consumable")
    food = models.ItemType(name="Rations", unit="kg", category="consumable")
    db.add_all([drill, battery, fuel, food])
    db.commit()

    # Create Expedition and Missions
    expedition = models.Expedition(name="43rd ISEA", status="ACTIVE", start_date=datetime.datetime.utcnow())
    db.add(expedition)
    db.commit()

    m1 = models.Mission(name="Deep Ice Coring", expedition_id=expedition.id, location_id=camp.id, priority=1, status="AT_RISK")
    m2 = models.Mission(name="Penguin Colony Survey", expedition_id=expedition.id, location_id=station.id, priority=2, status="READY")
    m3 = models.Mission(name="Glacier Dynamics", expedition_id=expedition.id, location_id=camp.id, priority=3, status="BLOCKED")
    db.add_all([m1, m2, m3])
    db.commit()

    # Requirements
    req1 = models.MissionRequirement(mission_id=m1.id, item_type_id=drill.id, quantity=1, criticality="MANDATORY")
    req2 = models.MissionRequirement(mission_id=m1.id, item_type_id=battery.id, quantity=2, criticality="MANDATORY")
    db.add_all([req1, req2])
    
    # Stock and Assets
    db.add(models.Asset(item_type_id=drill.id, serial_number="DRL-001", condition="GOOD", location_id=station.id))
    db.add(models.Asset(item_type_id=battery.id, serial_number="BAT-001", condition="GOOD", location_id=hub.id)) # At hub, not station!
    
    db.add(models.StockLot(item_type_id=fuel.id, location_id=station.id, batch="F2026", quantity=6000))
    db.add(models.StockLot(item_type_id=food.id, location_id=station.id, batch="R2026", quantity=500))
    db.commit()
    
    print("Database populated with synthetic data.")

if __name__ == "__main__":
    seed_data()
