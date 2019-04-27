'''
Code to fetch documents from Cloud firestore by license plate key

https://gist.github.com/ianakelly/2af989602c55f80aaf7f40b8f90d36a9
I noticed that I was missing gcloud app Python and Python Extentions

So I ran the following commands:
sudo apt-get install google-cloud-sdk-app-engine-python
sudo apt-get install google-cloud-sdk-app-engine-python-extras

I reran the Google Cloud Components and saw that I was now up to date with the required components for my project.

But when I tried running my project I again ran into the issue of the missing firebase_admin module.

The missing ingredient turned out to be pip3

So I ran sudo apt-get install python3-pip
and
c
and I was off and running!


Created with CodePilot.ai
'''

# increment count
# check expiration 
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


class Database():
    
    
    db = None
    
    
    def __init__(self, parking_lot = 'fst', barrier = 'IN'):
        cred = credentials.Certificate('pas_admin_sdk_private_key.json')
        default_app = firebase_admin.initialize_app(cred)
        self.db = firestore.client()
        self.parking_lot = parking_lot
        self.barrier = barrier
        print('Database init successful')
    
    
    def get_plate(self, plate):
        print('Querying firebase')
        doc_ref = self.db.collection(u'license_plates').document(plate)

        try:
            doc = doc_ref.get()
            plate_doc = doc.to_dict()
            if(plate_doc is None):
                return False
            print(u'Plate data: {}'.format(plate_doc))
            return plate_doc
        except google.cloud.exceptions.NotFound:
            print(u'No such plate!')
            return False
    
    
    def is_valid_plate(self, plate):
        
        plate_doc = self.get_plate(plate)
        if(plate_doc == False): # check if plate is in db
            return False
        
        expiry_date = datetime.strptime(plate_doc[u'expiry_date'], "%d/%m/%Y")
        if(expiry_date < datetime.now()): # check if plate is expired
            print('Plate expired!')
            return False
        
        # check if plate is allowed to park in that lot
        if(plate_doc[u'parking_lot_id'] != self.parking_lot):
            print('Can\'t park here ')
            return False
        
        print('Plate is valid')
        return plate_doc
        
        # commnet all above an uncomment the line below
        # return self.get_plate(plate)
    
    
    def parking_lot_has_space(self):
        # TODO: check if to dict fields fail
        print('Checking space availability for {} parking lot'.format(self.parking_lot))
        doc_ref = self.db.collection(u'parking_lots').document(self.parking_lot)
        try:
            doc = doc_ref.get().to_dict()
            max = doc[u'max_occupancy']
            current = doc[u'current_occupancy']
            print(u'Max occupancy: {}'.format(max))
            print(u'Current occupancy: {}'.format(current))
            
            if(current >= max):
                print('No space left')
                return False
            else:
                print('Space available')
                return True
            
        except google.cloud.exceptions.NotFound:
            print(u'No such parking lot!')
            return False
        
    
    def update_occupancy_count(self):
        print('Updating occupancy for {} parking lot'.format(self.parking_lot))
        doc_ref = self.db.collection(u'parking_lots').document(self.parking_lot)
        try:
            doc = doc_ref.get().to_dict()
            current = doc[u'current_occupancy']
                        
            if(self.barrier == 'IN'):
                print('Incrementing count')
                doc_ref.update({u'current_occupancy':current+1})
                return True
            else:
                print('Decrementing count')
                doc_ref.update({u'current_occupancy':current-1})
                return True
            
        except google.cloud.exceptions.NotFound:
            print(u'No such parking lot!')
            return False
    
