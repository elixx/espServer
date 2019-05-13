import network
from time import sleep
from _thread import start_new_thread
from MicroWebSrv import MicroWebSrv

global MyName, debug, ip
MyName = "ESPSERVER"
debug = False
ip = "0.0.0.0"

def wifi_connect(essid,password=''):
    import network
    global ip
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('connecting to network...')
        wlan.connect(essid, password)
        while not wlan.isconnected():
            pass
    print('network config:', wlan.ifconfig())
    ip =  wlan.ifconfig()[0]

if(debug==True):
    q = input("run access point? (Y/N) ")
    if q in ['y','Y']:
        ap = network.WLAN(network.AP_IF)
        ap.active(True)
        ap.config(dhcp_hostname=MyName, essid=MyName, authmode=network.AUTH_OPEN)
        sleep(.2)
        ip = ap.ifconfig()[0]
    else:
        q = input("connect to wifi? (Y/N) ")
        if q in ['y','Y']:
            essid = input("ESSID? ")
            password = input("Password? ")
            wifi_connect(essid,password)
        else:
            pass
else:
    ap = network.WLAN(network.AP_IF)
    ap.active(True)
    ap.config(dhcp_hostname=MyName, essid=MyName, authmode=network.AUTH_OPEN)
    sleep(.2)
    ip = ap.ifconfig()[0]

if(ip != "0.0.0.0"):
    print('my IP is',ip)
else:
    print('not online.')

try:
  import usocket as socket
except:
  import socket

def response(packet):
    global ip
    bip = ip.split('.')
    for i in range(0,len(bip)):
        bip[i] = int(bip[i])
    bip = bytes(bip)
    return b''.join([
        packet[:2],             # Query identifier
        b'\x85\x80',            # Flags and codes
        packet[4:6],            # Query question count
        b'\x00\x01',            # Answer record count
        b'\x00\x00',            # Authority record count
        b'\x00\x00',            # Additional record count
        packet[12:],            # Query question
        b'\xc0\x0c',            # Answer name as pointer
        b'\x00\x01',            # Answer type A
        b'\x00\x01',            # Answer class IN
        b'\x00\x00\x00\x1E',    # Answer TTL 30 secondes
        b'\x00\x04',            # Answer data length
        bip])                    # Answer data

def run_dns():
    print("dns server started")
    dnsserver = socket.socket(socket.AF_INET,
                              socket.SOCK_DGRAM)
    dnsserver.setsockopt(socket.SOL_SOCKET,
                         socket.SO_REUSEADDR,
                         1)
    dnsserver.bind(('0.0.0.0', 53))
    # dnsserver.setblocking(True)
    while True:
        (packet, cliAddr) = dnsserver.recvfrom(256)
        print("<53",cliAddr, packet)
        packet = response(packet)
        if packet:
            dnsserver.sendto(packet, cliAddr)
            print(">53",cliAddr, packet)
            sleep(.1)

def run():
    global ip, debug

    if(debug==True):
        q = input("run dns server? (y/n)")
        if q in ['y','Y']:
            start_new_thread(run_dns, ())
    else:
        start_new_thread(run_dns, ())

    if(debug==True):
        q = input("run web server? (y/n)")
        if q in ['y','Y']:
            mws = MicroWebSrv(port=80, bindIP='0.0.0.0', webPath="/www")
            mws.SetNotFoundPageUrl("http://"+ip)
            mws.Start(threaded=True)
            print("web server started.")
    else:
        mws = MicroWebSrv(port=80, bindIP='0.0.0.0', webPath="/www")
        mws.SetNotFoundPageUrl("http://"+ip)
        mws.Start(threaded=True)
        print("web server started.")
