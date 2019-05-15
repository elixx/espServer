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
        from config import MyName,debug,debugDNS,runREPL,runDNS,runWeb,threaded
        wlan=WLAN()
        ip = wlan.ifconfig()[0]
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

def replaceIn(FileName, searchStr, replaceStr):
    from time import sleep
    f = open(FileName)
    newText=f.read().replace(searchStr, replaceStr)
    f.close()
    sleep(.1)
    f = open(FileName, "w")
    f.write(newText)
    f.close()

def replaceRe(FileName, pat, repline):
    from ure import sub
    newfile = ''
    f = open(FileName)
    for line in f.readlines():
        newfile += sub(pat,repline,line, 1)
    f.close()
    f = open(FileName,'w')
    f.write(newfile)
    f.close()

def findValue(file, param):
    import ure
    f = open(file)
    re = param + " = (.*)$"
    for line in f.readlines():
        if( ure.search(re,line) is None ):
            pass
        else:
            return(line)
    f.close()
