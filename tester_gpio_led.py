import RPi.GPIO as GPIO
import time

# GPIO.cleanup()
LED = 18

GPIO.setmode(GPIO.BCM)
PIN = LED

print('Setting pin 18 to high')
GPIO.setup(PIN, GPIO.OUT)
GPIO.output(PIN, GPIO.HIGH)

for i in reversed(range(10)):
    print(i)
    time.sleep(1)

GPIO.output(PIN, GPIO.LOW)
print('Setting pin 18 to low')
GPIO.cleanup()