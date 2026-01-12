FROM php:8.2-apache

# Installer Python et Supervisor (pour gérer Apache + Python)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    supervisor \
    && apt-get clean

# Installer les dépendances Python si nécessaire
RUN pip3 install --break-system-packages paho-mqtt

# Copier TOUS les dossiers
COPY ./php /var/www/html/php
COPY ./python /var/www/html/python
COPY ./json /var/www/html/json
COPY ./cpp /var/www/html/cpp

# Donner les permissions
RUN chown -R www-data:www-data /var/www/html

# Copier le script Python dans un endroit dédié
COPY ./python/Essai_de_code_recuperation_info_mqtt_enpython.py /app/mqtt_listener.py

# Créer le fichier de configuration Supervisor
RUN echo '[supervisord]\n\
nodaemon=true\n\
\n\
[program:apache2]\n\
command=/usr/sbin/apache2ctl -D FOREGROUND\n\
autostart=true\n\
autorestart=true\n\
\n\
[program:python-mqtt]\n\
command=/usr/bin/python3 /app/mqtt_listener.py\n\
autostart=true\n\
autorestart=true' > /etc/supervisor/conf. d/supervisord.conf

EXPOSE 80

# Lancer Supervisor qui va démarrer Apache ET Python
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]