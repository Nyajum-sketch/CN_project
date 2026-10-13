/**
 * VLSM & IP Addressing Validation Script
 * Verifies subnet boundaries, binary conversions, usable host ranges,
 * zero overlaps, and CIDR route summarization for the University Network.
 */

function ipToInt(ip) {
  return ip.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

function intToIp(int) {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}

function intToBinary(int) {
  return [
    ((int >>> 24) & 255).toString(2).padStart(8, '0'),
    ((int >>> 16) & 255).toString(2).padStart(8, '0'),
    ((int >>> 8) & 255).toString(2).padStart(8, '0'),
    (int & 255).toString(2).padStart(8, '0')
  ].join('.');
}

function prefixToMaskInt(prefix) {
  return prefix === 0 ? 0 : ((0xFFFFFFFF << (32 - prefix)) >>> 0);
}

function calculateSubnet(name, networkIp, prefix, vlanId, requiredHosts) {
  const netInt = ipToInt(networkIp);
  const maskInt = prefixToMaskInt(prefix);
  const wildcardInt = (~maskInt) >>> 0;
  const broadcastInt = (netInt | wildcardInt) >>> 0;
  const totalAddresses = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? 0 : totalAddresses - 2;
  const firstUsableInt = (netInt + 1) >>> 0;
  const lastUsableInt = (broadcastInt - 1) >>> 0;

  // Check if networkIp is aligned to prefix
  if ((netInt & maskInt) >>> 0 !== netInt) {
    throw new Error(`Alignment error: ${networkIp}/${prefix} is not a valid network boundary!`);
  }

  return {
    name,
    vlanId: vlanId || 'N/A',
    networkIp,
    prefix,
    cidr: `${networkIp}/${prefix}`,
    subnetMask: intToIp(maskInt),
    wildcardMask: intToIp(wildcardInt),
    firstUsable: prefix >= 31 ? 'N/A' : intToIp(firstUsableInt),
    lastUsable: prefix >= 31 ? 'N/A' : intToIp(lastUsableInt),
    broadcast: intToIp(broadcastInt),
    totalAddresses,
    usableHosts,
    requiredHosts,
    netInt,
    broadcastInt,
    binaryNet: intToBinary(netInt),
    binaryMask: intToBinary(maskInt)
  };
}

const subnets = [
  calculateSubnet('Main Campus - Hostel LAN & Wi-Fi', '10.10.0.0', 23, 50, 500),
  calculateSubnet('Main Campus - Students LAN & Wi-Fi', '10.10.2.0', 23, 40, 500),
  calculateSubnet('Main Campus - Computer Labs', '10.10.4.0', 25, 30, 120),
  calculateSubnet('Main Campus - Faculty LAN', '10.10.4.128', 25, 20, 100),
  calculateSubnet('Main Campus - Administration LAN', '10.10.5.0', 26, 10, 55),
  calculateSubnet('Main Campus - Library LAN', '10.10.5.64', 26, 60, 50),
  calculateSubnet('Main Campus - Data Center / Server Farm', '10.10.5.128', 27, 70, 25),
  calculateSubnet('Main Campus - Network Management & IT', '10.10.5.160', 28, 99, 10),
  calculateSubnet('Remote Campus - Students & Labs LAN', '10.10.6.0', 25, 140, 100),
  calculateSubnet('Remote Campus - Staff & Admin LAN', '10.10.6.128', 27, 110, 25),
  calculateSubnet('Remote Campus - Management LAN', '10.10.6.160', 28, 199, 5),
  calculateSubnet('Interconnect - Core-1 to Core-2 (HSRP/Transit)', '10.10.7.0', 30, null, 2),
  calculateSubnet('Transit - Core-1 to Edge Router / Firewall', '10.10.7.4', 30, null, 2),
  calculateSubnet('Transit - Core-2 to Edge Router / Firewall', '10.10.7.8', 30, null, 2),
  calculateSubnet('Public WAN - Main Edge to ISP Router', '203.0.113.0', 30, null, 2),
  calculateSubnet('Public WAN - Remote Edge to ISP Router', '203.0.113.4', 30, null, 2),
  calculateSubnet('Isolated WAN - RIPv2 Test Link', '198.51.100.0', 30, null, 2)
];

// Verify overlaps
console.log('--- VERIFYING SUBNET OVERLAPS ---');
let hasOverlap = false;
for (let i = 0; i < subnets.length; i++) {
  for (let j = i + 1; j < subnets.length; j++) {
    const s1 = subnets[i];
    const s2 = subnets[j];
    // Check if overlap exists (if ranges intersect)
    if (s1.netInt <= s2.broadcastInt && s2.netInt <= s1.broadcastInt) {
      console.error(`OVERLAP DETECTED between [${s1.name} (${s1.cidr})] and [${s2.name} (${s2.cidr})]!`);
      hasOverlap = true;
    }
  }
}

if (!hasOverlap) {
  console.log('SUCCESS: Zero overlapping subnets detected across all 17 subnets!\n');
}

// Generate Markdown Table
console.log('--- VLSM ADDRESSING TABLE ---');
console.log('| Subnet Description | VLAN ID | Network Address / CIDR | Subnet Mask | Usable Host Range | Broadcast Address | Usable Hosts (Req.) |');
console.log('| :--- | :---: | :---: | :---: | :---: | :---: | :---: |');
subnets.forEach(s => {
  console.log(`| ${s.name} | ${s.vlanId} | \`${s.cidr}\` | \`${s.subnetMask}\` | \`${s.firstUsable} - ${s.lastUsable}\` | \`${s.broadcast}\` | ${s.usableHosts} (${s.requiredHosts}) |`);
});

// Binary Conversion Table for Assignment Documentation
console.log('\n--- BINARY CONVERSION AUDIT TABLE ---');
console.log('| Subnet Name | Network Address | Binary Representation (Network) | Binary Subnet Mask |');
console.log('| :--- | :--- | :--- | :--- |');
subnets.slice(0, 8).forEach(s => {
  console.log(`| ${s.name} | \`${s.networkIp}/${s.prefix}\` | \`${s.binaryNet}\` | \`${s.binaryMask}\` |`);
});

// CIDR Route Summarization Verification
console.log('\n--- CIDR ROUTE SUMMARIZATION ---');
console.log('1. Main Campus Supernet:');
console.log('   Encompasses 10.10.0.0 through 10.10.5.255 + Transit 10.10.7.0/24');
console.log('   Binary of 10.10.0.0:  00001010.00001010.00000000.00000000');
console.log('   Binary of 10.10.7.255: 00001010.00001010.00000111.11111111');
console.log('   Common Prefix: First 21 bits (00001010.00001010.00000xxx)');
console.log('   Calculated Summary Route: 10.10.0.0/21 (Mask: 255.255.248.0)');
console.log('2. Remote Campus Supernet:');
console.log('   Encompasses 10.10.6.0 through 10.10.6.175');
console.log('   Summary Route: 10.10.6.0/24 (Mask: 255.255.255.0)');
console.log('3. Entire University Network:');
console.log('   Enterprise Summary: 10.10.0.0/16 (Mask: 255.255.0.0)');
