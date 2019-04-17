# import constants
from distance_sensor import Distance_Sensor
import RPi.GPIO as GPIO
import time


ds = Distance_Sensor()
try:
    while True:
        ds.get_distance()
        time.sleep(1)
except KeyboardInterrupt:
    print('Quitting')
    GPIO.cleanup()