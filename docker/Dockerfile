FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    supervisor \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --break-system-packages paho-mqtt

RUN npm install -g mqtt

COPY ./php /var/www/html/php
COPY ./python /var/www/html/python
COPY ./json /var/www/html/json
COPY ./cpp /var/www/html/cpp

RUN chown -R www-data:www-data /var/www/html

COPY ./python/Essai_de_code_recuperation_info_mqtt_enpython.py /app/mqtt_listener.py

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN mkdir -p /var/log/supervisor

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
