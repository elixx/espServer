def read(path):
    f=open(path,'r')
    print("["+path+"]:")
    for line in f.readlines():
        print(line,end='')
    f.close()

def wifi_connect(essid,password=''):
    import network
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('connecting...')
        wlan.connect(essid, password)
        while not wlan.isconnected():
            pass
    return(wlan.ifconfig()[0])

def sys_stats():
    import os, gc, machine, sys
    from binascii import hexlify
    hwid = str(hexlify(machine.unique_id()))    #Hardware ID
    output = "Hardware ID\t\t"+hwid + '\n'
    uname = os.uname()
    firmwareversion = str(uname.version)
    hardware = uname.machine
    output += "Hardware:\t\t"+hardware+'\n'
    output += "Firmware version:\t"+firmwareversion+'\n'
    mhz = str(machine.freq()/1000000) # Freq in MHz
    freeram = str(gc.mem_free())    # Free RAM
    usedram = str(gc.mem_alloc())   # Used RAM
    vfs = os.statvfs('/')
    freedisk = str(vfs[0] * vfs[4]) # Flash VFS size free
    output += "Python version:\t\t"+sys.version+'\n'
    output += "CPU Freq:\t\t"+mhz+"MHz\n"
    output += "Memory free:\t\t"+freeram+" bytes free\n"
    output += "Memory alloc:\t\t"+usedram+" bytes allocated\n"
    output += "Flash:\t\t\t"+freedisk+" bytes free\n"
    return(output)

def sys_config():
    from network import WLAN
    global MyName,debug,debugDNS,runREPL,runDNS,runWeb,threaded
    from config import *
    from config import MyName,debug,debugDNS,runREPL,runDNS,runWeb,threaded
    wlan=WLAN()
    ip = wlan.ifconfig()[0]
    if(ip == "0.0.0.0"): ip = "192.168.4.1"
    apMode = wlan.config('essid')
    try:
        x = open("/client.cfg")
        x.close()
        apMode += " - Wifi Client Mode"
    except:
        apMode += " - AP Enabled"
    if(wlan.isconnected()): apMode += ' - Connected'
    content = "MyName:\t\t" + str(MyName) + "\n"
    content += "Network:\t" + apMode + "\n"
    content += "IP Address:\t" + ip + "\n"
    content += "debug\t\t" + str(debug) + "\n"
    content += "debugDNS\t" + str(debugDNS) + "\n"
    content += "runREPL\t\t" + str(runREPL) + "\n"
    content += "runDNS\t\t" + str(runDNS) + "\n"
    content += "runWeb\t\t" + str(runWeb) + "\n"
    content += "threaded\t" + str(threaded) + "\n"
    return(content)

def sys_config_html():
    from network import WLAN
    global MyName,debug,debugDNS,runREPL,runDNS,runWeb,threaded
    from config import *
    from config import MyName,debug,debugDNS,runREPL,runDNS,runWeb,threaded
    wlan=WLAN()
    ip = wlan.ifconfig()[0]
    if(ip == "0.0.0.0"): ip = "192.168.4.1"
    apMode = wlan.config('essid')
    try:
        x = open("/client.cfg")
        x.close()
        apMode += " - Wifi Client Mode"
    except:
        apMode += " - AP Enabled"
    if(wlan.isconnected()):
        apMode += ' - Connected'
    apMode += ' <a href="/config/toggleAP">(switch)</a>'
    content = "Network:\t" + apMode + "\n"
    content += "IP Address:\t" + ip + "\n"
    for n in ["MyName","debug","debugDNS","runREPL","runDNS","runWeb","threaded"]:
        pad = " " * (15 - len(n))
        content += '<a href="/config/'+n+'">'+n+'</a>'+pad+ str(eval(n)) + "\n"
    return(content)

def findValue(file, param):
    import ure
    f = open(file)
    re = param + " = (.*)$"
    for line in f.readlines():
        if( ure.search(re,line) is None ):
            pass
        else:
            return(line.strip())
    f.close()

def replaceLine(FileName, pat, repline):
    newfile = ''
    f = open(FileName)
    for line in f.readlines():
        newline = line.replace(pat,repline)
        newfile += newline
    f.close()
    f = open(FileName,'w')
    f.write(newfile)
    f.close()

def replaceRe(FileName, pat, repline): 
    from ure import sub
    from os import rename
    f = open(FileName)
    newfile = '/'+FileName+'.tmp'
    f2 = open(newfile,'w')
    for line in f.readlines():
        newline = sub(pat,repline,line)
        f2.write(newline)
    f.close()
    f2.close()
    rename(newfile,FileName)