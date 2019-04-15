import RPi.GPIO as GPIO
import time

class Remote:
    
    PULSE_DURATION = 1
    
    
    def __init__(self, IN = 18, OUT = 23):
        GPIO.setmode(GPIO.BCM)
        self.IN = IN
        GPIO.setup(self.IN, GPIO.OUT)
        GPIO.output(self.IN, GPIO.HIGH)
        self.OUT = OUT
        GPIO.setup(self.OUT, GPIO.OUT)
        GPIO.output(self.OUT, GPIO.HIGH)
        print('Barrier remote init successful')
        
    
    def raise_barrier(self, barrier='IN'):
        # barrier is a string: either IN or OUT
        if barrier == 'IN':
            PIN = self.IN
        elif barrier == 'OUT':
            PIN = self.OUT
        else:
            print('Invalid instruction')
            return -1
            
        print('Opening {} Barrier on pin {}'.format(barrier, PIN))
        GPIO.output(PIN, GPIO.LOW)
        time.sleep(self.PULSE_DURATION)
        GPIO.output(PIN, GPIO.HIGH)
        print('System paused to prevent signal overload')
        time.sleep(self.PULSE_DURATION)
        
        