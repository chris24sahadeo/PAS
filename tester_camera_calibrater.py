import picamera
import time

camera = picamera.PiCamera()
camera.capture('images/example.jpg')

#camera.vflip = True

#camera.capture('example2.jpg')