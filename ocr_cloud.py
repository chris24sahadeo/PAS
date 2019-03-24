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
        start = time.time()
        url = 'https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=0&country=th&secret_key=%s' % (self.SECRET_KEY)
        r = requests.post(url, data = img_base64)
        
        # return
        # print(json.dumps(r.json(), indent=2)) # dumps encodes json for storage or output...we dont need this
        # data_dump = json.dumps(r.json(), indent=2)
        print('OpenALPR responded in {} seconds'.format(time.time()-start))
        
        # exception handling goes here
        data_dump = r.json()
        results = data_dump['results'] # getting the first candidate
        if results is not []:
            plate = results[0]['plate'].lower()            
        else:
            plate = 'false'
            
        print('Plate Number: {}'.format(plate))        
        return(plate)
        

        
        
        
        
        
        
        
    
    