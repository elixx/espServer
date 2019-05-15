import network

global MyName, debug, debugDNS, ip, runREPL, runDNS, runWeb, threaded

from config import *

if(debug==True):

    q = input("run access point? (Y/N) ")
    if q in ['y','Y']:
        ap = network.WLAN(network.AP_IF)
        ap.active(True)
        ap.config(dhcp_hostname=MyName, essid=MyName, authmode=network.AUTH_OPEN)
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
    q = input("start webrepl?")
    if q in ['Y','y']:
        runREPL = True

else:

    try:
        f = open("/client.cfg")
        param = f.read().split(':')
        param.append(None)
        print("client.cfg found and debug not set. using wifi settings.\n", \
               "connecting to",param[0],param[1])
        from utils import wifi_connect
        if(param[1] == None):
            ip = wifi_connect(param[0].strip())
        else:
            ip = wifi_connect(param[0].strip(),param[1].strip())

    except:
        ap = network.WLAN(network.AP_IF)
        ap.active(True)
        from time import sleep
        sleep(1)
        ap.config(dhcp_hostname=MyName, essid=MyName, authmode=network.AUTH_OPEN)
        ip = ap.ifconfig()[0]

try:
    print('my IP is',ip)
except NameError:
    print("Not online.")

if(runREPL):
    import webrepl
    from utils import replaceRe
    pat = "ws://(.*)\:8266/"
    replaceRe('/www/webrepl.html',pat,"ws://"+ip+":8266/")
    webrepl.start()

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
    try:
        import usocket as socket
    except:
        import socket

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

    def delayed_reboot(delay=3.5):
        from time import sleep
        from machine import reset
        sleep(delay)
        reset()
####################################### URL Route handling #################################
    @MicroWebSrv.route('/config')
    def _httpHandlerConfig(httpClient, httpResponse, args={}) :
        from utils import sys_config_html
        content = """\
            <!DOCTYPE html>
            <html lang=en>
            <head>
                <meta charset="UTF-8" />
                <title>CONFIG DUMP</title>
            </head>
            <body><PRE>"""
        content += sys_config_html()
        content += '<div style="alignt: center; text-align: center;">\n'
        content += '<P><h3><a href="/stats">status</a></h3></P>'
        content += "<br /><h5><a href=\"/config/reboot\">REBOOT?</A></h5>\n"
        content += "</div>"
        content += """\
            </PRE>
            </body>
            </html>
            """
        httpResponse.WriteResponseOk( headers            = None,
                                      contentType    = "text/html",
                                      contentCharset = "UTF-8",
                                      content                = content )
##############################################
    @MicroWebSrv.route('/config/reboot')
    @MicroWebSrv.route('/config/restart')
    def _httpHandlerReboot(httpClient, httpResponse, args={}) :
        from _thread import start_new_thread
        start_new_thread(delayed_reboot, ())
        content = """\
            <!DOCTYPE html>
            <html lang=en>
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="refresh" content="8;url=/" />
                <title>C U NEXT TUESDAY...</title>
            </head>
            <body><BR /><HR /><br />
            <P><center><img src="/reboot.gif"></center></P>
            <BR /><HR /><br /></body>
            </html>
            """
        httpResponse.WriteResponseOk( headers            = None,
                                      contentType    = "text/html",
                                      contentCharset = "UTF-8",
                                      content                = content )
############################################################
    @MicroWebSrv.route('/config/toggleAP')
    def _httpHandlerToggle(httpClient, httpResponse, args={}) :
        from os import rename
        apMode = None
        try:
            x = open('/client.cfg')
            x.close()
            apMode = False
            rename("/client.cfg","/client.disable")
        except:
            try:
                x = open('client.disable')
                x.close()
                apMode = True
                rename("/client.disable","/client.cfg")
            except:
                return()
        content = """\
            <!DOCTYPE html>
            <html lang=en>
            <head>
                    <meta charset="UTF-8" />
                <title>TEST EDIT</title>
            </head>
            <body>
            """
        if(apMode):
            content += "<H2>Switched to Wifi Client Mode</H2>"
            content += '<div style="alignt: center; text-align: center;">\n'
            content += '<P><h3><a href="/config/">config</a></h3></P>'
            content += "<br /><h5><a href=\"/config/reboot\">REBOOT?</A></h5>\n"
            content += "</div>"
        else:
            content += "<H2>Switched to Wifi AP Mode</H2>"
            content += '<div style="alignt: center; text-align: center;">\n'
            content += '<P><h3><a href="/config/">config</a></h3></P>'
            content += "<br /><h5><a href=\"/config/reboot\">REBOOT?</A></h5>\n"
            content += "</div>"
        content += """\
            </body>
        </html>
            """
        httpResponse.WriteResponseOk( headers            = None,
                                      contentType    = "text/html",
                                      contentCharset = "UTF-8",
                                      content                = content )
##############################################
    @MicroWebSrv.route('/config/<param>/<value>')
    def _httpHandlerEditParams(httpClient, httpResponse, args={}) :
        from utils import replaceLine, findValue
        content = """\
            <!DOCTYPE html>
            <html lang=en>
            <head>
                    <meta charset="UTF-8" />
                <title>-=DAT CONFIG=-</title>
            </head>
            <body>
            """
        content += "<h3>CONFIG UPDATE</h3>"
        if 'param' in args :
            param = args['param'].strip()
            oldline = findValue('/config.py',param)
            content += "<p>[config: {}]</p>".format(oldline)
            content += "<br />"
        if 'value' in args :
            if(type(args['value']) == int):
                value = str(args['value'])
            else:
                value = args['value'].strip()
            content += "<p>[new value is {}]</p>".format(value)
            content += "<br />"
        if( ('value' in args) and ('param' in args) ):
            #re = args['param'].strip() + " = ([A-Za-z\"]+)"
            re = oldline
            if((value == str(1)) or ('rue' in value)):
                value = "True"
            elif((value == str(0)) or ('alse' in value)):
                value = "False"
            else:
                value = '"' + value + '"'
            newline = args['param'].strip() + " = " + value + "\n"
            content += "<P>" + newline + "</P><BR />"
            print("CONFIGURE:",param,' - ',value,' - ', re, '\n',newline)

            replaceLine("/config.py",re,newline)

            content += "<p>parameters updated.</p>"
            content += '<div style="alignt: center; text-align: center;">\n'
            content += '<P><h3><a href="/config/">config</a></h3></P>'
            content += "<br /><h5><a href=\"/config/reboot\">REBOOT?</A></h5>\n"
            content += "</div>"
        content += """
            </body>
        </html>
            """
        httpResponse.WriteResponseOk( headers            = None,
                                      contentType    = "text/html",
                                      contentCharset = "UTF-8",
                                      content                = content )

############################################################
    @MicroWebSrv.route('/config/<param>')
    def _httpHandlerEditParams(httpClient, httpResponse, args={}) :
        from utils import findValue
        content = """\
            <!DOCTYPE html>
            <html lang=en>
            <head>
                    <meta charset="UTF-8" />
                <title>-=DAT CONFIG=-</title>
            </head>
            <body>
            """
        content += "<h3>CONFIG REQUEST</h3>"
        if 'param' in args :
            param = args['param'].strip()
            oldline = findValue('/config.py',param)
            content += "<p>[config: {}]</p>".format(oldline)
            content += "<br />"
            content += '<div style="alignt: center; text-align: center;">\n'
            content += "<P><h5><a href='/config/" + param + "/1'>enable</a> / <a href='/config/" + param + "/0'>disable</a></h5></P>"
            content += '<P><h3><a href="/config/">config</a></h3></P>'
            content += "</div>"
        content += """
            </body>
        </html>
            """
        httpResponse.WriteResponseOk( headers            = None,
                                      contentType    = "text/html",
                                      contentCharset = "UTF-8",
                                      content                = content )
############################################################
    @MicroWebSrv.route('/stats')
    @MicroWebSrv.route('/status')    
    def _httpHandlerStats(httpClient, httpResponse, args={}) :
        from utils import sys_stats, sys_config
        global MyName, debug, debugDNS, ip, runREPL, runDNS, runWeb, threaded
        content = """\
            <!DOCTYPE html>
            <html lang=en>
            <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="refresh" content="2" />
                <title>STATUS ORGASM</title>
            </head>
            <body>
            """

        content += "<h2>SYSTEM STATS</h2>\n<PRE>" + sys_stats() + "</PRE>\n"
        content += "<H2>SYSTEM CONFIG</H2>\n<PRE>" + sys_config() + "</PRE>\n"
        content += "<h5><a href='/config'>configure</a></h5>"
        content += "<h3><a href='/'>HOME</a></h5>"
        content += """
            </body>
        </html>
            """
        httpResponse.WriteResponseOk( headers            = None,
                                      contentType    = "text/html",
                                      contentCharset = "UTF-8",
                                      content                = content )

############################################ End of Routes ##################################################

    mws = MicroWebSrv(port=80, bindIP='0.0.0.0', webPath="/www")
    mws.SetNotFoundPageUrl("http://"+ip)
    print("web server starting at http://" + ip + "/ .")
    mws.Start(threaded=threaded)

def run():
    global ip, debug, threaded

    if(debug==True):
        q = input("run dns server? (y/n) ")
        if q in ['y','Y']:
            from _thread import start_new_thread
            start_new_thread(run_dns, ())
    else:
        if(runDNS):
            from _thread import start_new_thread
            start_new_thread(run_dns, ())

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
        if(runWeb):
            run_web(threaded)
