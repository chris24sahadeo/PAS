# exception handling
'''
Distance sensor read error
Traceback (most recent call last):
  File "/home/pi/Desktop/PAS/PAS.py", line 24, in <module>
    while(not ds.object_detected()):
  File "/home/pi/Desktop/PAS/distance_sensor.py", line 56, in object_detected
    return self.get_distance() <= self.MIN_OBJECT_DETECTION_DISTANCE
TypeError: unorderable types: NoneType() <= int()
'''

# import constants
import RPi.GPIO as GPIO
import time


class Distance_Sensor:
    
    TRIG = None
    ECHO = None
    SPEED_OF_SOUND_INVERSE = 0.000058 # divide a time by this to get distance in cm
    SLEEP = 0.00001 # a small sleep for a pulse
    MIN_OBJECT_DETECTION_DISTANCE = 30 # in cm
    
    def __init__(self, TRIG=25, ECHO=8):
        GPIO.setmode(GPIO.BCM)
        # TRIG = 4 # pin for trigger output
        # ECHO = 18 # pin for echo input
        self.TRIG = TRIG
        self.ECHO = ECHO
        GPIO.setup(TRIG, GPIO.OUT)
        GPIO.setup(ECHO, GPIO.IN)
        print('Distance Sensor init successful')
    
    
    def get_distance(self):
        try:
            # issue signal out
            GPIO.output(self.TRIG, True)
            time.sleep(self.SLEEP)
            GPIO.output(self.TRIG, False)
            
            # get time of echo send
            # print('Sending echo...')
            while GPIO.input(self.ECHO) == False:
                start = time.time()
            
            # get time of echo return
            # print('Waiting for echo response...')
            while GPIO.input(self.ECHO) == True:
                end = time.time()
            # print('Echo received')
            
            # calculate and return distance
            distance = (end-start)/self.SPEED_OF_SOUND_INVERSE
            print('Distance: {}cm'.format(distance))
            time.sleep(1)
            return distance
        
        except KeyboardInterrupt:
            print('PAS Shutting down from distance_sensor.py')
            GPIO.cleanup()
            exit()
                
        except:
            print('Distance sensor read error 1')
            return 
    
    
    def object_detected(self):
        try:
            detected = self.get_distance() <= self.MIN_OBJECT_DETECTION_DISTANCE
        except TypeError:
            print('Distance sensor read error 2: Type error')
        if(detected):
            print('Vehicle detected')
        else:
            print('No vehicle detected')
        time.sleep(1)
        return detected
        
        
        
    
        
    
    
