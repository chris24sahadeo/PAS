from database import Database
import time

db = Database(parking_lot = 'fst', barrier = 'IN')

doc = db.get_plate(u'pbc6972')
print(type(doc[u'expiry_date']))
print(time.time())
