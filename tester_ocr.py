import picamera
from distance_sensor import Distance_Sensor
from ocr_cloud import OCR_Cloud

camera = picamera.PiCamera()
distance_sensor = Distance_Sensor()
ocr = OCR_Cloud(camera, distance_sensor)
ocr.perform_ocr()