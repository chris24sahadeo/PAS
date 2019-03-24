# exceptions:
# no internet access
# keep looping until plate recognised OR opgect moved (need another object check here)

import requests
import base64
import json
import picamera


class OCR_Cloud:
    
    SECRET_KEY = 'sk_20e6522dcf04e440008719ec'
    
    def __init__(self, camera, distance_sensor):
        self.camera = camera
        self.distance_sensor = distance_sensor
        
        
    def perform_ocr(self):
        # if no image provided then take a picture with the camera
        IMAGE_PATH = 'images/image.jpg'
        print('Taking picture...')
        # self.camera.capture(IMAGE_PATH)
        
        # encoding the image as binary data
        print('Converting picture to binary data...')
        with open(IMAGE_PATH, 'rb') as image_file:
            img_base64 = base64.b64encode(image_file.read())
        
        # calling openALPR
        print('Calling openALPR for licence plate recognition')
        url = 'https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=0&country=th&secret_key=%s' % (self.SECRET_KEY)
        r = requests.post(url, data = img_base64)
        
        # return
        print(json.dumps(r.json(), indent=2))

        
        
        
        
        
        
        
    
    