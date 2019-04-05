'''
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

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


class Database():
    
    
    db = None
    
    
    def __init__(self):
        cred = credentials.Certificate('pas_admin_sdk_private_key.json')
        default_app = firebase_admin.initialize_app(cred)
        self.db = firestore.client()
    
    
    def get_plate(self, plate):
        print('Querying firebase')
        doc_ref = self.db.collection(u'license_plates').document(plate)

        try:
            doc = doc_ref.get()
            print(u'Document data: {}'.format(doc.to_dict()))
            return True
        except google.cloud.exceptions.NotFound:
            print(u'No such document!')
            return False
