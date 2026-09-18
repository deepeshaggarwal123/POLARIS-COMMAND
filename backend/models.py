from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Boolean, Enum, JSON
from sqlalchemy.orm import declarative_base, relationship
import datetime
import enum

Base = declarative_base()

class RoleEnum(enum.Enum):
    ADMIN = "ADMIN"
    STOREKEEPER = "STOREKEEPER"
    TECHNICIAN = "TECHNICIAN"
    LEADER = "LEADER"
    RESEARCHER = "RESEARCHER"

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    role = Column(Enum(RoleEnum))
    station_id = Column(Integer, ForeignKey('locations.id'), nullable=True)
    authorization_scope = Column(String)

class Location(Base):
    __tablename__ = 'locations'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String) # HUB, STATION, CAMP
    parent_id = Column(Integer, ForeignKey('locations.id'), nullable=True)
    coordinates = Column(String) # Stored as JSON string "[lat, lng]" for SQLite compatibility

class Expedition(Base):
    __tablename__ = 'expeditions'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String) # PLANNED, ACTIVE, COMPLETED

class Mission(Base):
    __tablename__ = 'missions'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    expedition_id = Column(Integer, ForeignKey('expeditions.id'))
    location_id = Column(Integer, ForeignKey('locations.id'))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    priority = Column(Integer)
    status = Column(String) # READY, AT_RISK, BLOCKED

class ItemType(Base):
    __tablename__ = 'item_types'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    unit = Column(String) # liters, kg, pieces
    category = Column(String) # consumable, equipment
    storage_requirements = Column(String) # e.g. cold_chain

class MissionRequirement(Base):
    __tablename__ = 'mission_requirements'
    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey('missions.id'))
    item_type_id = Column(Integer, ForeignKey('item_types.id'))
    quantity = Column(Float)
    criticality = Column(String) # MANDATORY, OPTIONAL

class StockLot(Base):
    __tablename__ = 'stock_lots'
    id = Column(Integer, primary_key=True, index=True)
    item_type_id = Column(Integer, ForeignKey('item_types.id'))
    location_id = Column(Integer, ForeignKey('locations.id'))
    batch = Column(String)
    quantity = Column(Float)
    expiry_date = Column(DateTime, nullable=True)

class InventoryMovement(Base):
    __tablename__ = 'inventory_movements'
    event_id = Column(String, primary_key=True) # UUID for idempotency
    lot_id = Column(Integer, ForeignKey('stock_lots.id'))
    quantity = Column(Float)
    source_location_id = Column(Integer, ForeignKey('locations.id'), nullable=True)
    destination_location_id = Column(Integer, ForeignKey('locations.id'), nullable=True)
    reason = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Asset(Base):
    __tablename__ = 'assets'
    id = Column(Integer, primary_key=True, index=True)
    item_type_id = Column(Integer, ForeignKey('item_types.id'))
    serial_number = Column(String, unique=True)
    condition = Column(String) # GOOD, DAMAGED, MAINTENANCE_REQUIRED
    location_id = Column(Integer, ForeignKey('locations.id'))

class AssetAssignment(Base):
    __tablename__ = 'asset_assignments'
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey('assets.id'))
    mission_id = Column(Integer, ForeignKey('missions.id'))
    custodian_id = Column(Integer, ForeignKey('users.id'))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String) # RESERVED, ISSUED, RETURNED

class SyncEvent(Base):
    __tablename__ = 'sync_events'
    event_id = Column(String, primary_key=True)
    node_id = Column(String)
    sequence = Column(Integer)
    payload = Column(JSON)
    received_at = Column(DateTime, default=datetime.datetime.utcnow)
