import network
from time import sleep

global MyName, debug, debugDNS, ip
### CONFIGURE THESE SETTINGS: ####
MyName = "ESPSERVER"
debug = False        # prompt for all startup options
debugDNS = False     # dump DNS queries
runDNS = True
runWeb = True
threaded = False     # allow interactive while running MicroWebSrv
##################################

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
            from utils import wifi_connect
            essid = input("ESSID? ")
            password = input("Password? ")
            ip = wifi_connect(essid,password)
        else:
            pass
else:
    ap = network.WLAN(network.AP_IF)
    ap.active(True)
    ap.config(dhcp_hostname=MyName, essid=MyName, authmode=network.AUTH_OPEN)
    sleep(.2)
    ip = ap.ifconfig()[0]

try:
    ip
    print('my IP is',ip)
except NameError:
    print("Not online.")

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
    global ip, debugDNS
    dnsserver = socket.socket(socket.AF_INET,
                              socket.SOCK_DGRAM)
    dnsserver.setsockopt(socket.SOL_SOCKET,
                         socket.SO_REUSEADDR,
                         1)
    dnsserver.bind(('0.0.0.0', 53))
    #dnsserver.setblocking(True)
    print("dns server starting...")
    while True:
        (packet, cliAddr) = dnsserver.recvfrom(256)
        qs = str(packet[13:])
        if debugDNS: print("<53",cliAddr, qs.replace('\\x03','.').replace('\\x0f','.').replace('\\x00',' ').replace('\\x07','.'))
        packet = response(packet)
        if packet:
            dnsserver.sendto(packet, cliAddr)
            qr = str(packet[13:])
            if debugDNS: print(">53",cliAddr, ip)

def run_web(threaded):
    from microWebSrv import MicroWebSrv
    mws = MicroWebSrv(port=80, bindIP='0.0.0.0', webPath="/www")
    mws.SetNotFoundPageUrl("http://"+ip)
    print("web server starting at http://" + ip + "/ .")
    mws.Start(threaded=threaded)

def run():
    from _thread import start_new_thread
    global ip, debug, threaded

    if(debug==True):
        q = input("run dns server? (y/n) ")
        if q in ['y','Y']:
            start_new_thread(run_dns, ())
    else:
        if(runDNS): start_new_thread(run_dns, ())

    if(debug==True):
        q = input("run web server? (y/n) ")
        if q in ['y','Y']:
            t = input("run www threaded? (y/n) ")
            if(t in ['N','n']):
                threaded = False
            elif(t in ['Y','y']):
                threaded = True
            run_web(threaded)
    else:
        if(runWeb): run_web(threaded)
