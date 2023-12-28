import os from 'os';
import QDate from './date';
import {IQNetwork} from './qfuncs.i';

class QNetwork extends QDate implements IQNetwork {
  getIPAddressByNetworkInterface (networkInterface: string, defaultVal = '0.0.0.0', regExpStr?: string): string {
    let ipAddress = defaultVal;
    if (networkInterface) return ipAddress;

    try {
      let isBreak = false;
      const interfaces = os.networkInterfaces();
      for (const devName in interfaces) {
        const iface = interfaces[devName];
        if (iface && networkInterface === devName) {
          for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (
              alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal
              && (!regExpStr || new RegExp(regExpStr).test(alias.address))
            ) {
              ipAddress = alias.address;
              isBreak = true;
              break;
            }
          }
        }

        if (isBreak)
          break;
      }
    } catch (err) {
      this._printlog('error', 'getIPAddressByNetworkInterface err:', err);
    }

    return ipAddress;
  }

  getNetworkInterfacePrivateIPAddress (networkInterface?: string, defaultVal = '0.0.0.0', regExpStr?: string): string {
    // A类地址:10.0.0.0~10.255.255.255
    // B类地址:172.16.0.0~172.31.255.255
    // C类地址:192.168.0.0~192.168.255.255

    const aIpAddressArr: string[] =  [];
    const bIpAddressArr: string[] =  [];
    const cIpAddressArr: string[] =  [];

    try {
      const interfaces = os.networkInterfaces();
      for (const devName in interfaces) {
        const iface = interfaces[devName];
        if (iface && (!networkInterface || networkInterface === devName)) {
          for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (
              alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal
              && (!regExpStr || new RegExp(regExpStr).test(alias.address))
            ) {
              if (/^\b(?:192\.168)(?:\.(?:2[0-4]\d|25[0-5]|[01]?\d\d?)){2}\b$/.test(alias.address)) {
                // C类地址:192.168.0.0~192.168.255.255
                cIpAddressArr.push(alias.address);
              } else if (/^\b(172\.0?(?:1[6-9]|2\d|3[01]))(?:\.(?:2[0-4]\d|25[0-5]|[01]?\d\d?)){2}\b$/.test(alias.address)) {
                // B类地址:172.16.0.0~172.31.255.255
                bIpAddressArr.push(alias.address);
              } else if (/^\b(10\.(?:2[0-4]\d|25[0-5]|[01]?\d\d?))(?:\.(?:2[0-4]\d|25[0-5]|[01]?\d\d?)){2}\b$/.test(alias.address)) {
                // A类地址:10.0.0.0~10.255.255.255
                aIpAddressArr.push(alias.address);
              }
            }
          }
        }
      }
    } catch (err) {
      this._printlog('error', 'getNetworkInterfacePrivateIPAddress err:', err);
    }

    if ((aIpAddressArr.length + bIpAddressArr.length + cIpAddressArr.length) <= 1)
      return cIpAddressArr[0] || bIpAddressArr[0] || aIpAddressArr[0] || defaultVal;

    // eslint-disable-next-line arrow-body-style
    const ipAddress = cIpAddressArr.find(item => !/(0|1)$/.test(item)) || bIpAddressArr.find(item => !/(0|1)$/.test(item)) || aIpAddressArr.find(item => !/(0|1)$/.test(item));
    if (ipAddress) return ipAddress;

    return cIpAddressArr[0] || bIpAddressArr[0] || aIpAddressArr[0] || defaultVal;
  }

  getNetworkInterfacePublicIPAddress (networkInterface?: string, defaultVal = '0.0.0.0', regExpStr?: string): string {
    let ipAddress = defaultVal;

    try {
      let isBreak = false;
      const interfaces = os.networkInterfaces();
      for (const devName in interfaces) {
        const iface = interfaces[devName];
        if (iface && (!networkInterface || networkInterface === devName)) {
          for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (
              alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal
              && (!regExpStr || new RegExp(regExpStr).test(alias.address))
              && !/^\b(?:192\.168|172\.0?(?:1[6-9]|2\d|3[01])|10\.(?:2[0-4]\d|25[0-5]|[01]?\d\d?))(?:\.(?:2[0-4]\d|25[0-5]|[01]?\d\d?)){2}\b$/.test(alias.address)
            ) {
              ipAddress = alias.address;
              isBreak = true;
              break;
            }
          }
        }

        if (isBreak)
          break;
      }
    } catch (err) {
      this._printlog('error', 'getNetworkInterfacePublicIPAddress err:', err);
    }

    return ipAddress;
  }

  ipv42NumberStr (ipv4: string): string {
    const ipv4Arr = ipv4.split('.');
    let _ipv4NumTmp = '';
    for (const val of ipv4Arr) {
    // eslint-disable-next-line no-nested-ternary
      _ipv4NumTmp += (val.length === 1 ? '00' + val : (val.length === 2 ? '0' + val : val));
    }
    return _ipv4NumTmp;
  }
}

export default QNetwork;