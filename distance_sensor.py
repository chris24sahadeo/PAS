# import constants
import RPi.GPIO as GPIO
import time


class Distance_Sensor:
    
    SPEED_OF_SOUND_INVERSE = 0.000058 # divide a time by this to get distance in cm
    SLEEP = 0.00001 # a small sleep for a pulse
    MIN_OBJECT_DETECTION_DISTANCE = 100 # in cm
    
    def __init__(self, TRIG=4, ECHO=18):
        GPIO.setmode(GPIO.BCM)
        # TRIG = 4 # pin for trigger output
        # ECHO = 18 # pin for echo input        
        GPIO.setup(TRIG, GPIO.OUT)
        GPIO.setup(ECHO, GPIO.IN)
        print('Distance Sensor init successful')
    
    
    def get_distance(self):
        # issue signal out
        GPIO.output(TRIG, TRUE)
        time.sleep(SLEEP)
        GPIO.output(TRIG, FALSE)
        
        # get time of echo send
        print('Sending echo...')
        while GPIO.input(ECHO) == False:
            start = time.time()
        
        # get time of echo return
        print('Waiting for echo response...')
        while GPIO.input(ECHO) == True:
            end = time.time()
        print('Echo received')
        
        # calculate and return distance
        distance = (end-start)/self.SPEED_OF_SOUND_INVERSE
        print('Obejct at distance: {}'.format(distance))
        return distance
    
    
    def object_detected(self):
        return self.get_distance() <= self.MIN_OBJECT_DETECTION_DISTANCE
        
        
    
        
    
    
