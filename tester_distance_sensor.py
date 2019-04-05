# import constants
from distance_sensor import Distance_Sensor
import time


ds = Distance_Sensor()
while True:
    print(ds.get_distance())
    time.sleep(1)