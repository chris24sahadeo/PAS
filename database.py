# https://firebase.google.com/docs/firestore/quickstart
# pip install --upgrade firebase-admin
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


class Database():
    
    
    db = None
    
    
    def __init__(self):
        # Use the application default credentials
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred, {
          'projectId': project_id,
        })

        db = firestore.client()
    
    
    def get_plate(self, plate):
        doc_ref = db.collection(u'license_plates').document(plate)

        try:
            doc = doc_ref.get()
            print(u'Document data: {}'.format(doc.to_dict()))
        except google.cloud.exceptions.NotFound:
            print(u'No such document!')
