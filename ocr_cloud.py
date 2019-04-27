'''
Class to take a picture using the Pi Camera and make a POST request to the OpenALPR cloud service.
OpenALPR returns a string representing the vehicle's license plate number
'''

# exceptions:
# no internet access
# keep looping (taking pictures) until plate recognised and validated OR object moved (need another object check here)
# use return codes in the openalpr rest api for exception handling

import requests
import base64
import json
import picamera
import time


class OCR_Cloud:
    
    SECRET_KEY = 'sk_20e6522dcf04e440008719ec'
    
    def __init__(self, camera, distance_sensor):
        self.camera = camera
        self.distance_sensor = distance_sensor
        print('OCR init successful')
        
        
    def perform_ocr(self):
        # if no image provided then take a picture with the camera
        IMAGE_PATH = 'images/image.jpg'
        print('Scanning licence plate')
        self.camera.capture(IMAGE_PATH)
        
        # encoding the image as binary data
        print('Converting image.jpg to binary data...')
        with open(IMAGE_PATH, 'rb') as image_file:
            img_base64 = base64.b64encode(image_file.read())
        
        # calling openALPR
        print('Calling openALPR for licence plate recognition')
        start = time.time()
        url = 'https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=0&country=th&secret_key=%s' % (self.SECRET_KEY)
        r = requests.post(url, data = img_base64)
        
        # return
        # print(json.dumps(r.json(), indent=2)) # dumps encodes json for storage or output...we dont need this
        # data_dump = json.dumps(r.json(), indent=2)
        end = time.time()-start
        print('OpenALPR responded in {} seconds'.format(end))
        
        # exception handling goes here
        data_dump = r.json()
        results = data_dump['results'] # getting the first candidate
        # print(results)
        if results:
            plate = results[0]['plate'].lower()
            print('Plate number: {}'.format(plate))
            return plate
        else:
            print('OCR Failed')
            return False
        
        
        
        
        
        
        
    
    