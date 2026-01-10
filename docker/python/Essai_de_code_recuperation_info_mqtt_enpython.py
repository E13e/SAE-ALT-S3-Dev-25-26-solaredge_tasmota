import paho.mqtt.client as mqtt
import json

# config
mqttServer = "mqtt.iut-blagnac.fr"
username = "student"
pwd = "student"

topic_subscribe = "energy/solaredge/blagnac/#"

print("On commence...")

# callback appele lors de la reception d'un message
def get_data(mqttc, obj, msg):
    jsonMsg = json.loads(msg.payload.decode())
    test = json.dumps(jsonMsg, indent=2, ensure_ascii=False) 
    print(test)

    with open('./pageweb.php', 'w') as fichier:
        fichier.write(#génération page php)

mqttc = mqtt.Client()
mqttc.username_pw_set(username, pwd)
mqttc.tls_set()
print("on se connecte");
mqttc.connect(mqttServer, port=8883, keepalive=60)

mqttc.on_message = get_data

# soucription au device
mqttc.subscribe(topic_subscribe, 0)


mqttc.loop_forever()

