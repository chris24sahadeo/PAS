# import constants
import RPi.GPIO as GPIO
import time


class Distance_Sensor:
    
    TRIG = None
    ECHO = None
    SPEED_OF_SOUND_INVERSE = 0.000058 # divide a time by this to get distance in cm
    SLEEP = 0.00001 # a small sleep for a pulse
    MIN_OBJECT_DETECTION_DISTANCE = 100 # in cm
    
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
        # print('Object at distance: {}cm'.format(distance))
        return distance
    
    
    def object_detected(self):
        return self.get_distance() <= self.MIN_OBJECT_DETECTION_DISTANCE
        
        
    
        
    
    
