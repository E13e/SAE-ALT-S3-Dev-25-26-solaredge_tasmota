#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <ArduinoMqttClient.h>
#include <M5Stack.h>

const char ssid[] = "Bigger_Nalls";
const char pass[] = "smash420";

const char broker[] = "mqtt.iut-blagnac.fr";
int port = 8883;
const char topic[] = "energy/triphaso/by-room/B110/data";
const char topicSeuil[] = "sandbox/student/SaeSolaredge/etat/seuil";
//const char topicEcriture[] = "sandbox/SaeSolaredge/etat";
const char mqttUser[] = "student";
const char mqttPass[] = "student";
int seuil = 10000000;

WiFiClientSecure wifiClient;
MqttClient mqttClient(wifiClient);

unsigned long lastMillis = 0;
bool alerteActive = false;

void setup() {
  M5.begin();
  Serial.begin(115200);
  delay(1000);

  M5.Lcd.println("Connexion WiFi...");
  Serial.println("Connexion WiFi...");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    M5.Lcd.print(".");
  }
  M5.Lcd.clear();
  M5.Lcd.println("\nConnecté au WiFi");
  M5.Lcd.print("Adresse IP: ");
  M5.Lcd.println(WiFi.localIP());
  Serial.println("\nConnecté au WiFi");
  Serial.print("Adresse IP: ");
  Serial.println(WiFi.localIP());

  wifiClient.setInsecure();
  mqttClient.setUsernamePassword(mqttUser, mqttPass);

  M5.Lcd.println("Connexion au broker MQTT...");
  if (!mqttClient.connect(broker, port)) {
    M5.Lcd.println("Échec connexion. Code erreur = ");
    M5.Lcd.println(mqttClient.connectError());
    while (1);
  }
  M5.Lcd.println("OK !");
  
  mqttClient.subscribe(topic);
  mqttClient.subscribe(topicSeuil);
  M5.Lcd.println("Abonné au topic");
}

void loop() {
  M5.update();
  
  // Vérifier les appuis sur les boutons TOUJOURS - CORRIGÉ
  if (M5.BtnB.wasPressed() || M5.BtnC.wasPressed()) {
    if (alerteActive) {
      alerteActive = false;
      M5.Lcd.clear();
      M5.Lcd.fillScreen(BLACK);
      M5.Lcd.setTextColor(WHITE);
      M5.Lcd.setTextSize(2);
      M5.Lcd.setCursor(20, 100);
      M5.Lcd.println("Alerte STOP");
      M5.Lcd.println("");
      M5.Lcd.setTextSize(1);
      M5.Lcd.println("Attente nouveau message...");
      mqttClient.beginMessage("sandbox/student/SaeSolaredge/etat/consommation");
      mqttClient.print("{\"surconsommation\": false}");
      int messageId = mqttClient.endMessage();
      Serial.println("Message envoyé, ID: " + String(messageId));
      delay(20000);
      M5.Lcd.clear();
    }
  }
  
  // Si alerte est active, afficher le message rouge en boucle
  if (alerteActive) {
    M5.Lcd.fillScreen(RED);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setCursor(0, 50);
    M5.Lcd.setTextSize(3);
    M5.Lcd.println("ALERTE !");
    M5.Lcd.setTextSize(2);
    // probleme ca publie en boucle
    // mqttClient.beginMessage("sandbox/student/SaeSolaredge/etat");
    // mqttClient.print("[{\"alerte_terminée\": false}]");
    // int messageId = mqttClient.endMessage();
    // Serial.println("Message envoyé, ID: " + String(messageId));
    M5.Lcd.println("Forte energie");
    M5.Lcd.println("Appuyez bouton");
    M5.Lcd.println("pour arreter");
    return;
  }

    // Récupérer les nouveaux messages MQTT
    int messageSize = mqttClient.parseMessage();
    if (messageSize > 0) {
      String message = "";
      while (mqttClient.available()) {
        message += (char)mqttClient.read();
      }
       
      String s(message);

      if (s.lastIndexOf("seuil") != -1){

          int endroit = s.indexOf(":");

          s = s.substring(endroit, s.length() -1);

          s.trim();
          s = s.substring(2, s.length() -2);

          s.trim();

          seuil = s.toInt();
      }else {

      Serial.println("Message reçu: " + message);
      
      // Afficher le message reçu
      M5.Lcd.clear();
      M5.Lcd.setTextSize(1);
      M5.Lcd.setTextColor(WHITE);
      M5.Lcd.fillScreen(BLACK);
      M5.Lcd.println("=== Message recu ===");
      M5.Lcd.println(s.lastIndexOf("seuil"));
      M5.Lcd.println(message);
      
      // Extraire l'énergie - PREMIÈRE occurrence (la bonne)
      int energy = 0;
      int firstKeyPos = message.indexOf("sum_positive_active_energy_Wh");

      if (firstKeyPos != -1) {
        int colonPos = message.indexOf(":", firstKeyPos);
        if (colonPos != -1) {
          int startPos = colonPos + 1;
          
          // Sauter espaces/guillemets
          while (startPos < message.length() && 
                (message[startPos] == ' ' || message[startPos] == '"' || message[startPos] == '\n')) {
            startPos++;
          }

          int endPos = message.indexOf(",", startPos);
          if (endPos == -1) endPos = message.indexOf("}", startPos);
          if (endPos == -1) endPos = message.indexOf("]", startPos);

          if (endPos != -1) {
            String temp = message.substring(startPos, endPos);
            temp.trim();
            energy = temp.toInt();
            
            Serial.print("Energie PREMIERE: ");
            Serial.println(energy);
            
            M5.Lcd.setTextSize(2);
            M5.Lcd.print("Energie: ");
            M5.Lcd.print(energy);
            M5.Lcd.println(" Wh");
            
            if (energy > seuil) {
              alerteActive = true;
              M5.Lcd.setTextSize(3);
              M5.Lcd.setTextColor(RED);
              M5.Lcd.println("\nDEPASSEMENT !!!");
              mqttClient.beginMessage("sandbox/student/SaeSolaredge/etat/consommation");
              mqttClient.print("{\"surconsommation\": true}");
              int messageId = mqttClient.endMessage();
              Serial.println("Message envoyé, ID: " + String(messageId));
            }
          }
        }
      } else {
        M5.Lcd.println("Champ energie non trouvé");
      }
    }
  }
}