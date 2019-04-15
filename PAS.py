# TODO: ----------------------------------------------
# script triggered upon pi start
# need to configure for headless start
# need exception handling


# DONE: ----------------------------------------------
# GPIO cleanup on exit

# ====================================================



# imports
print('Importing modules...')
import time
import picamera
from distance_sensor import Distance_Sensor
from ocr_cloud import OCR_Cloud
from remote import Remote
import RPi.GPIO as GPIO
from database import Database


# init objects
print('Initializing objects...')
parking_lot = 'fst'
barrier = 'IN'
SLEEP_1 = 1

rm = Remote()
#time.sleep(SLEEP_1)

cam = picamera.PiCamera()
#time.sleep(SLEEP_1)

ds = Distance_Sensor()
#time.sleep(SLEEP_1)

ocr = OCR_Cloud(cam, ds)
#time.sleep(SLEEP_1)

db = Database(parking_lot = 'fst', barrier = 'IN')
#time.sleep(SLEEP_1)

# pausing...just cus
print('System ready in ')
for i in reversed(range(1,4)):
    print(i)
    time.sleep(SLEEP_1)



try: # stops upon Ctrl+C 
    
    while True:
        
        # waiting for a vehicle to approach barrier
        while(not ds.object_detected()):
            # pause
            time.sleep(1)
        
        # checks if parking lot has space
        if(db.parking_lot_has_space()):
            
            # taking picture of license plate and performing ocr
            plate = ocr.perform_ocr()
            if(plate != False): # ocr succeeded            
            
                # ocr succeeded, querying firebase
                if(db.is_valid_plate(plate)):
                    rm.raise_barrier(barrier='IN')
                    db.update_occupancy_count()
        
       

except KeyboardInterrupt:
    print('PAS Shutting down from PAS.py')
    GPIO.cleanup()
    
        
    
