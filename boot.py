# This file is executed on every boot (including wake-boot from deepsleep)
#import esp
#esp.osdebug(None)
import uos, machine
#uos.dupterm(None, 1)  # disable REPL on UART(0)
import gc
import webrepl
webrepl.start()
gc.collect()

def wifi_connect(essid,password=''):
    import network
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('connecting to network...')
        wlan.connect(essid, password)
        while not wlan.isconnected():
            pass
    print('network config:', wlan.ifconfig())

def read(path):
    f=open(path,'r')
    print("["+path+"]:")
    for line in f.readlines():
        print(line,end='')
    f.close()

import esp32thing
esp32thing.run()
