from remote import Remote
import RPi.GPIO as GPIO

GPIO.cleanup()
r = Remote()

#while(True):
r.raise_barrier('IN')
r.raise_barrier('OUT')
   