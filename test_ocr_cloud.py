import ocr_cloud
import pytest

# get filenames in dir
from os import listdir
from os.path import isfile, join, splitext

'''
@pytest.fixture(scope='session')
def get_test_images(PATH='images/test_images_bad_lighting'):
    filenames = [splitext(f)[0] for f in listdir(PATH) if isfile(join(PATH, f))]
    return filenames

# print(get_test_images('images/test_images_bad_lighting'))

def test_ocr_cloud(get_test_images):
    ocr = ocr_cloud.OCR_Cloud(None,None)
    for filename in get_test_images:
        path = 'images/test_images_good_lighting/'+filename+'.jpg'
        assert ocr.perform_ocr(IMAGE_PATH=path) == filename

'''

PATH = 'images/test_images_good_lighting/'
filenames =  [splitext(f)[0] for f in listdir(PATH) if isfile(join(PATH, f))]


@pytest.fixture(params=filenames)
def filename(request):
    return request.param


def test_ocr_cloud(filename):
    OCR = ocr_cloud.OCR_Cloud(camera=None, distance_sensor=None)
    assert OCR.perform_ocr(IMAGE_PATH=PATH+filename+'.jpg') == filename
