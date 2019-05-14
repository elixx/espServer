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
        print('connecting to network...')
        wlan.connect(essid, password)
        while not wlan.isconnected():
            pass
    print('network config:', wlan.ifconfig())
    return(wlan.ifconfig()[0])



def sys_stats():
    import os, gc, machine, sys
    from binascii import hexlify
    output = "System Stats:\n"
    hwid = str(hexlify(machine.unique_id()))    #Hardware ID
    output += "Hardware ID\t\t"+hwid + '\n'
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

    output += "Python version:\t\t\t"+sys.version+'\n'
    output += "CPU Freq:\t\t"+mhz+"MHz\n"
    output += "Memory free:\t\t"+freeram+" bytes free\n"
    output += "Memory alloc:\t\t"+usedram+" bytes allocated\n"
    output += "Flash:\t\t\t"+freedisk+" bytes free\n"

    print ("Stats!")
    return(output)

def replaceIn(FileName, searchStr, replaceStr):
    from time import sleep
    f = open(FileName)
    newText=f.read().replace(searchStr, replaceStr)
    f.close()
    sleep(.1)
    f = open(FileName, "w")
    f.write(newText)
    f.close()