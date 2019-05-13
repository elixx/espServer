import network
from time import sleep
from _thread import start_new_thread
from MicroWebSrv import MicroWebSrv

global MyName
MyName = "ESPSERVER"

ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(dhcp_hostname=MyName, essid=MyName, authmode=network.AUTH_OPEN)
global ip
ip =  ap.ifconfig()[0]
print('my IP is ',str(ip))

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
    global ip
    start_new_thread(run_dns, ())
    mws = MicroWebSrv(port=80, bindIP='0.0.0.0', webPath="/www")
    mws.SetNotFoundPageUrl("http://"+ip)
    mws.Start(threaded=True)
