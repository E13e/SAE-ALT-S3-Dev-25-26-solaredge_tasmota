

import paho.mqtt.client as mqtt
import json

# config
mqttServer = "mqtt.iut-blagnac.fr"
appID = "00000000"
deviceID = "+" # + si tous les devices

topic_subscribe = "energy/solaredge/blagnac/"

print("On commence...")

# callback appele lors de la reception d'un message
def get_data(mqttc, obj, msg):
    print("test")
    jsonMsg = json.loads(msg.payload)
    print("test")
    print(type(jsonMsg))
    print(jsonMsg['object'])


mqttc = mqtt.Client()
print("on se connecte");
mqttc.connect(mqttServer, port=8883, keepalive=60)

mqttc.on_message = get_data

# soucription au device
mqttc.subscribe(topic_subscribe, 0)


mqttc.loop_forever()
