# exception handling
'''
Distance sensor code
'''

# import constants
import RPi.GPIO as GPIO
import time


class Distance_Sensor:
    
    TRIG = None
    ECHO = None
    SPEED_OF_SOUND_INVERSE = 0.000058 # divide a time by this to get distance in cm
    SLEEP = 0.00001 # a small sleep for a pulse
     # in cm
    
    def __init__(self, TRIG=25, ECHO=8, min_distance = 30):
        GPIO.setmode(GPIO.BCM)
        # TRIG = 4 # pin for trigger output
        # ECHO = 18 # pin for echo input
        self.TRIG = TRIG
        self.ECHO = ECHO
        self.MIN_OBJECT_DETECTION_DISTANCE = min_distance
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
        
        
        
    
        
    
    
