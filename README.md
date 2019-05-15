# espServer - Embedded Wifi Server / Captive Portal in MicroPython
### Captive Portal Web Server for esp32 -- and maybe esp8266, eventually
*a little wifi hotspot with a web server that could share content or apps where there is no internet connection, possible to be battery powered for hours (days?)*

This allows for a small, battery-operated webserver to be stood up in places where there is no network connectivity.
This could be used for event coordination, to provide social connectivity in areas with no WiFi (perhaps in demographic areas with limited Internet access), or to help provide communications in emergency or disaster situations.

---

#### Tech Details

This was tested against MicroPython firmware `esp32-20190511-v1.10-338-gf812394c3.bin` on a bootleg [LOLIN32](https://docs.platformio.org/en/latest/boards/espressif32/lolin32.html) board.

This uses [jczic/MicroWebSrv](https://github.com/jczic/MicroWebSrv) 

There is a primitive API to allow configuration changes or trigger a reboot without a serial / USB connection.

System stats are exposed via HTTP at `/stats` or `/status`.

webrepl.html is updated upon boot to default connecting to the correct IP address.

#### Setup

* If you have [adafruit-ampy](https://pypi.org/project/adafruit-ampy/0.6.3/) installed, you can just run './deploy.sh' assuming your device is on /dev/ttyUSB0.

* You can edit config.py or hit http://ip/config for a primitive configuration API (be careful!)

* If you don't want to run an access point,  create a one-line "client.cfg" file in the format `ESSID:password`. This can be toggled from the /config interface.

Mobile wifi devices should see an open wifi network and be prompted to sign in.
The captive portal page will be served from /www

### TODOs:
* esp8266 port - This should be possible to port to esp3266 by porting to use uasyncio instead of _threads.
* sdcard support - [moar storage](https://learn.adafruit.com/micropython-hardware-sd-cards/micropython)
* clean up /config API
* webapp content
    * with a MicroWebSrv handler for an API endpoint to handle get/post/put requests:
      * javascript single-page app for message board / graffiti wall / chatroom / file sharing portal
      * javascript emulators / games like [this](https://github.com/fcambus/jsemu/blob/master/README.md) or [this](https://github.com/marciot/retroweb-vintage-computer-museum/blob/master/README.md)
      * GPIO control interface - interactive crowd-controlled LED matrix
* Interface with another device via GPIO for upstream connectivity or logging - post new content, access logs, etc. externally
* Mesh networking to allow for upstream connectivity / distributed ESP servers
