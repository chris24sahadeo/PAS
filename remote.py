import RPi.GPIO as GPIO
import time

class Remote:
    
    PULSE_DURATION = 0.5
    
    
    def __init__(self):
        GPIO.setmode(GPIO.BCM)
        self.IN = 18
        GPIO.setup(self.IN, GPIO.OUT)
        self.OUT = 23
        GPIO.setup(self.OUT, GPIO.OUT)
        
    
    def raise_barrier(self, barrier):
        # barrier is a string: either IN or OUT
        if barrier == 'IN':
            PIN = self.IN
        elif barrier == 'OUT':
            PIN = self.OUT
        else:
            print('Invalid instruction')
            return -1
            
        print('Opening {} Barrier on pin {}'.format(barrier, PIN))
        GPIO.output(PIN, GPIO.HIGH)
        time.sleep(self.PULSE_DURATION)
        GPIO.output(PIN, GPIO.LOW)
        print('System paused to prevent signal overload')
        time.sleep(self.PULSE_DURATION)
        
        