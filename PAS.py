# script triggered upon pi start
# need to configure for headless start
# need exception handling
# need GPIO cleanup

# import constants
print('Importing modules...')
import picamera
from distance_sensor import Distance_Sensor
from ocr_cloud import OCR_Cloud
from remote import Remote
from database import Database

# init objects
cam = picamera.PiCamera()
ds = Distance_Sensor()
ocr = OCR_Cloud(cam, ds)
rm = Remote()
db = Database()

while True:
    
    # waiting for a vehicle to approach barrier
    while(not ds.object_detected()):
        print('Vehicle not present')    
    print('Vehicle detected')
    
    # taking picture of license plate and performing ocr
    plate = ocr.perform_ocr()
    if(plate == False):
        continue
    
    #querying firebase
    else:
        if(db.get_plate(plate)):
            rm.raise_barrier(barrier='IN')
            
        
    
