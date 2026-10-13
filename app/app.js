// Secure Smart University Campus Network - Interactive Portal Logic

const SUBNETS = [
  { name: 'Hostel LAN & Wi-Fi', vlan: 50, cidr: '10.10.0.0/23', mask: '255.255.254.0', range: '10.10.0.1 - 10.10.1.254', bcast: '10.10.1.255', hosts: 510, req: 500, vip: '10.10.0.1', bin: '00001010.00001010.00000000.00000000', binMask: '11111111.11111111.11111110.00000000' },
  { name: 'Students LAN & Wi-Fi', vlan: 40, cidr: '10.10.2.0/23', mask: '255.255.254.0', range: '10.10.2.1 - 10.10.3.254', bcast: '10.10.3.255', hosts: 510, req: 500, vip: '10.10.2.1', bin: '00001010.00001010.00000010.00000000', binMask: '11111111.11111111.11111110.00000000' },
  { name: 'Computer Laboratories', vlan: 30, cidr: '10.10.4.0/25', mask: '255.255.255.128', range: '10.10.4.1 - 10.10.4.126', bcast: '10.10.4.127', hosts: 126, req: 120, vip: '10.10.4.1', bin: '00001010.00001010.00000100.00000000', binMask: '11111111.11111111.11111111.10000000' },
  { name: 'Faculty Department', vlan: 20, cidr: '10.10.4.128/25', mask: '255.255.255.128', range: '10.10.4.129 - 10.10.4.254', bcast: '10.10.4.255', hosts: 126, req: 100, vip: '10.10.4.129', bin: '00001010.00001010.00000100.10000000', binMask: '11111111.11111111.11111111.10000000' },
  { name: 'Administration Department', vlan: 10, cidr: '10.10.5.0/26', mask: '255.255.255.192', range: '10.10.5.1 - 10.10.5.62', bcast: '10.10.5.63', hosts: 62, req: 55, vip: '10.10.5.1', bin: '00001010.00001010.00000101.00000000', binMask: '11111111.11111111.11111111.11000000' },
  { name: 'University Library', vlan: 60, cidr: '10.10.5.64/26', mask: '255.255.255.192', range: '10.10.5.65 - 10.10.5.126', bcast: '10.10.5.127', hosts: 62, req: 50, vip: '10.10.5.65', bin: '00001010.00001010.00000101.01000000', binMask: '11111111.11111111.11111111.11000000' },
  { name: 'Data Center / Server Farm', vlan: 70, cidr: '10.10.5.128/27', mask: '255.255.255.224', range: '10.10.5.129 - 10.10.5.158', bcast: '10.10.5.159', hosts: 30, req: 25, vip: '10.10.5.129', bin: '00001010.00001010.00000101.10000000', binMask: '11111111.11111111.11111111.11100000' },
  { name: 'IT & NOC Management', vlan: 99, cidr: '10.10.5.160/28', mask: '255.255.255.240', range: '10.10.5.161 - 10.10.5.174', bcast: '10.10.5.175', hosts: 14, req: 10, vip: '10.10.5.161', bin: '00001010.00001010.00000101.10100000', binMask: '11111111.11111111.11111111.11110000' },
  { name: 'Remote Students & Labs', vlan: 140, cidr: '10.10.6.0/25', mask: '255.255.255.128', range: '10.10.6.1 - 10.10.6.126', bcast: '10.10.6.127', hosts: 126, req: 100, vip: '10.10.6.1', bin: '00001010.00001010.00000110.00000000', binMask: '11111111.11111111.11111111.10000000' },
  { name: 'Remote Staff & Admin', vlan: 110, cidr: '10.10.6.128/27', mask: '255.255.255.224', range: '10.10.6.129 - 10.10.6.158', bcast: '10.10.6.159', hosts: 30, req: 25, vip: '10.10.6.129', bin: '00001010.00001010.00000110.10000000', binMask: '11111111.11111111.11111111.11100000' },
  { name: 'Remote Management', vlan: 199, cidr: '10.10.6.160/28', mask: '255.255.255.240', range: '10.10.6.161 - 10.10.6.174', bcast: '10.10.6.175', hosts: 14, req: 5, vip: '10.10.6.161', bin: '00001010.00001010.00000110.10100000', binMask: '11111111.11111111.11111111.11110000' },
  { name: 'Core Interconnect R1-R2', vlan: 'Transit', cidr: '10.10.7.0/30', mask: '255.255.255.252', range: '10.10.7.1 - 10.10.7.2', bcast: '10.10.7.3', hosts: 2, req: 2, vip: 'N/A', bin: '00001010.00001010.00000111.00000000', binMask: '11111111.11111111.11111111.11111100' },
  { name: 'Transit R1 to Edge', vlan: 'Transit', cidr: '10.10.7.4/30', mask: '255.255.255.252', range: '10.10.7.5 - 10.10.7.6', bcast: '10.10.7.7', hosts: 2, req: 2, vip: 'N/A', bin: '00001010.00001010.00000111.00000100', binMask: '11111111.11111111.11111111.11111100' },
  { name: 'Transit R2 to Edge', vlan: 'Transit', cidr: '10.10.7.8/30', mask: '255.255.255.252', range: '10.10.7.9 - 10.10.7.10', bcast: '10.10.7.11', hosts: 2, req: 2, vip: 'N/A', bin: '00001010.00001010.00000111.00001000', binMask: '11111111.11111111.11111111.11111100' },
  { name: 'Public WAN 1 (Main-ISP)', vlan: 'WAN', cidr: '203.0.113.0/30', mask: '255.255.255.252', range: '203.0.113.1 - 203.0.113.2', bcast: '203.0.113.3', hosts: 2, req: 2, vip: '203.0.113.2', bin: '11001011.00000000.01110001.00000000', binMask: '11111111.11111111.11111111.11111100' },
  { name: 'Public WAN 2 (Remote-ISP)', vlan: 'WAN', cidr: '203.0.113.4/30', mask: '255.255.255.252', range: '203.0.113.5 - 203.0.113.6', bcast: '203.0.113.7', hosts: 2, req: 2, vip: '203.0.113.6', bin: '11001011.00000000.01110001.00000100', binMask: '11111111.11111111.11111111.11111100' },
  { name: 'Isolated RIP Test WAN', vlan: 'Test', cidr: '198.51.100.0/30', mask: '255.255.255.252', range: '198.51.100.1 - 198.51.100.2', bcast: '198.51.100.3', hosts: 2, req: 2, vip: 'N/A', bin: '11000110.00110011.01100100.00000000', binMask: '11111111.11111111.11111111.11111100' }
];

const DEVICES = {
  'ISP-Router': {
    role: 'Simulated Internet Provider Core',
    model: 'Cisco 2911 ISR',
    interfaces: [
      { port: 'Gig0/0', ip: '203.0.113.2/30', to: 'Main-Edge-Rtr Gig0/2' },
      { port: 'Gig0/1', ip: '203.0.113.6/30', to: 'Remote-Edge-Rtr Gig0/0' },
      { port: 'Serial0/0/0', ip: '198.51.100.2/30', to: 'Main-Edge-Rtr Serial0/0/0 (DCE 64000)' },
      { port: 'Loopback0', ip: '8.8.8.8/32', to: 'Simulated Internet Root DNS' }
    ],
    features: ['Public Internet Transit', 'Isolated RIPv2 Testing Endpoint', 'Internet DNS Hosting']
  },
  'Main-Edge-Rtr': {
    role: 'Campus Border Security Gateway',
    model: 'Cisco 2911 ISR (Security K9)',
    interfaces: [
      { port: 'Gig0/0', ip: '10.10.7.6/30', to: 'Main-Core-R1 Gig0/2' },
      { port: 'Gig0/1', ip: '10.10.7.10/30', to: 'Main-Core-R2 Gig0/2' },
      { port: 'Gig0/2', ip: '203.0.113.1/30', to: 'ISP-Router Gig0/0' },
      { port: 'Serial0/0/0', ip: '198.51.100.1/30', to: 'ISP-Router Serial0/0/0' }
    ],
    features: ['OSPF Area 0 Backbone', 'Site-to-Site IPsec VPN (AES/SHA)', 'NAT/PAT with VPN Bypass', 'Inbound WAN Security Firewall']
  },
  'Main-Core-R1': {
    role: 'Primary Core Gateway (Odd VLANs)',
    model: 'Cisco 2911 ISR',
    interfaces: [
      { port: 'Gig0/0', ip: 'Trunk (Subinterfaces .10, .20, .30, .40, .50, .60, .70, .99)', to: 'Main-Core-SW1 Gig0/1' },
      { port: 'Gig0/1', ip: '10.10.7.1/30', to: 'Main-Core-R2 Gig0/1' },
      { port: 'Gig0/2', ip: '10.10.7.5/30', to: 'Main-Edge-Rtr Gig0/0' }
    ],
    features: ['Active HSRP (VLAN 10, 20, 30, 70, 99)', 'OSPF Area 1 ABR (10.10.0.0/21 Summary)', 'IOS DHCP Server (Admin, Faculty, Labs)', 'Inter-VLAN ACL Filtering']
  },
  'Main-Core-R2': {
    role: 'Secondary Core Gateway (Even VLANs)',
    model: 'Cisco 2911 ISR',
    interfaces: [
      { port: 'Gig0/0', ip: 'Trunk (Subinterfaces .10 - .99)', to: 'Main-Core-SW2 Gig0/1' },
      { port: 'Gig0/1', ip: '10.10.7.2/30', to: 'Main-Core-R1 Gig0/1' },
      { port: 'Gig0/2', ip: '10.10.7.9/30', to: 'Main-Edge-Rtr Gig0/1' }
    ],
    features: ['Active HSRP (VLAN 40, 50, 60)', 'OSPF Area 1 ABR (10.10.0.0/21 Summary)', 'Automatic Uplink Tracking Failover']
  },
  'Remote-Edge-Rtr': {
    role: 'Remote Satellite Campus Gateway',
    model: 'Cisco 2911 ISR',
    interfaces: [
      { port: 'Gig0/0', ip: '203.0.113.5/30', to: 'ISP-Router Gig0/1' },
      { port: 'Gig0/1', ip: 'Trunk (Subinterfaces .110, .140, .199)', to: 'Remote-SW1 Gig0/1' }
    ],
    features: ['Site-to-Site IPsec VPN Peer', 'Remote Inter-VLAN Routing', 'Remote DHCP Server Pools', 'Internet NAT/PAT']
  },
  'Main-Core-SW1': {
    role: 'Distribution Aggregation Switch 1',
    model: 'Catalyst 2960-24TT',
    interfaces: [
      { port: 'Gig0/1', ip: 'Trunk', to: 'Main-Core-R1 Gig0/0' },
      { port: 'Gig0/2', ip: 'Trunk', to: 'Main-Core-SW2 Gig0/2' },
      { port: 'Fa0/1 - Fa0/7', ip: '802.1Q Trunks', to: 'Department Access Switches' }
    ],
    features: ['Rapid-PVST Root Primary (10, 20, 30, 70, 99)', '802.1Q Trunking', 'Management SVI: 10.10.5.164']
  },
  'Main-Core-SW2': {
    role: 'Distribution Aggregation Switch 2',
    model: 'Catalyst 2960-24TT',
    interfaces: [
      { port: 'Gig0/1', ip: 'Trunk', to: 'Main-Core-R2 Gig0/0' },
      { port: 'Gig0/2', ip: 'Trunk', to: 'Main-Core-SW1 Gig0/2' }
    ],
    features: ['Rapid-PVST Root Primary (40, 50, 60)', 'Redundant Core Aggregation', 'Management SVI: 10.10.5.165']
  },
  'SW-ServerFarm': {
    role: 'Data Center Access Switch',
    model: 'Catalyst 2960-24TT',
    interfaces: [
      { port: 'Gig0/1', ip: 'Trunk', to: 'Main-Core-SW1 Fa0/7' },
      { port: 'Fa0/1', ip: 'VLAN 70', to: 'DNS-WebServer (10.10.5.130)' },
      { port: 'Fa0/2', ip: 'VLAN 70', to: 'Mail-Server (10.10.5.131)' },
      { port: 'Fa0/3', ip: 'VLAN 70', to: 'FTP-Syslog-Server (10.10.5.132)' },
      { port: 'Fa0/4', ip: 'VLAN 70', to: 'NetworkPrinter (10.10.5.133)' }
    ],
    features: ['PortFast Enabled', 'High Availability Server Access']
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  renderSubnetTable(SUBNETS);
  setupSubnetSearch();
  renderTopologySVG();
  inspectNode('Main-Core-R1');
  setupConfigViewer();
  setupSimulation();
});

// Tab Switcher
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

// Subnet Table Rendering
function renderSubnetTable(data) {
  const tbody = document.getElementById('subnet-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  data.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${s.name}</strong></td>
      <td><span class="tag-vlan">VLAN ${s.vlan}</span></td>
      <td><code>${s.cidr}</code></td>
      <td><code>${s.mask}</code></td>
      <td><code>${s.range}</code></td>
      <td><code>${s.vip}</code></td>
      <td><strong>${s.hosts}</strong> <span style="color:var(--text-dim)">(${s.req})</span></td>
      <td><button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="showBinary('${s.name}')">Binary</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function setupSubnetSearch() {
  const input = document.getElementById('vlsm-search');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = SUBNETS.filter(s => 
      s.name.toLowerCase().includes(val) || 
      String(s.vlan).includes(val) || 
      s.cidr.includes(val)
    );
    renderSubnetTable(filtered);
  });
}

window.showBinary = function(name) {
  const s = SUBNETS.find(item => item.name === name);
  if (!s) return;
  alert(`Subnet Binary Audit for ${s.name} (${s.cidr}):\n\nNetwork Address (Binary):\n${s.bin}\n\nSubnet Mask (Binary):\n${s.binMask}\n\nUsable Host Bits: 32 - Prefix = Capacity for ${s.hosts} hosts.`);
};

// Interactive SVG Topology Renderer
function renderTopologySVG() {
  const svg = document.getElementById('topology-svg');
  if (!svg) return;
  
  // Coordinates for clean visual diagram
  const nodes = [
    { id: 'ISP-Router', label: 'ISP-Router', x: 450, y: 50, type: 'cloud' },
    { id: 'Main-Edge-Rtr', label: 'Main-Edge-Rtr', x: 280, y: 160, type: 'router' },
    { id: 'Remote-Edge-Rtr', label: 'Remote-Edge-Rtr', x: 680, y: 160, type: 'router' },
    { id: 'Main-Core-R1', label: 'Main-Core-R1', x: 180, y: 280, type: 'router' },
    { id: 'Main-Core-R2', label: 'Main-Core-R2', x: 380, y: 280, type: 'router' },
    { id: 'Main-Core-SW1', label: 'Core-SW1', x: 180, y: 390, type: 'switch' },
    { id: 'Main-Core-SW2', label: 'Core-SW2', x: 380, y: 390, type: 'switch' },
    { id: 'SW-ServerFarm', label: 'SW-ServerFarm', x: 80, y: 510, type: 'switch' },
    { id: 'SW-Admin', label: 'SW-Admin (V10)', x: 200, y: 510, type: 'switch' },
    { id: 'SW-Labs', label: 'SW-Labs (V30)', x: 320, y: 510, type: 'switch' },
    { id: 'SW-Students', label: 'SW-Students (V40)', x: 440, y: 510, type: 'switch' },
    { id: 'Remote-SW1', label: 'Remote-SW1', x: 680, y: 390, type: 'switch' }
  ];

  const links = [
    { from: 'Main-Edge-Rtr', to: 'ISP-Router', color: '#f59e0b', label: 'Public WAN 1' },
    { from: 'Remote-Edge-Rtr', to: 'ISP-Router', color: '#f59e0b', label: 'Public WAN 2' },
    { from: 'Main-Core-R1', to: 'Main-Edge-Rtr', color: '#38bdf8', label: 'Transit 1' },
    { from: 'Main-Core-R2', to: 'Main-Edge-Rtr', color: '#38bdf8', label: 'Transit 2' },
    { from: 'Main-Core-R1', to: 'Main-Core-R2', color: '#22c55e', label: 'HSRP Interconnect' },
    { from: 'Main-Core-R1', to: 'Main-Core-SW1', color: '#818cf8', label: '802.1Q Trunk' },
    { from: 'Main-Core-R2', to: 'Main-Core-SW2', color: '#818cf8', label: '802.1Q Trunk' },
    { from: 'Main-Core-SW1', to: 'Main-Core-SW2', color: '#818cf8', label: 'Inter-Switch' },
    { from: 'Main-Core-SW1', to: 'SW-ServerFarm', color: '#94a3b8' },
    { from: 'Main-Core-SW1', to: 'SW-Admin', color: '#94a3b8' },
    { from: 'Main-Core-SW1', to: 'SW-Labs', color: '#94a3b8' },
    { from: 'Main-Core-SW1', to: 'SW-Students', color: '#94a3b8' },
    { from: 'Remote-Edge-Rtr', to: 'Remote-SW1', color: '#818cf8', label: 'Remote Trunk' }
  ];

  let html = `<defs>
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;

  // Draw links
  links.forEach(l => {
    const n1 = nodes.find(n => n.id === l.from);
    const n2 = nodes.find(n => n.id === l.to);
    if (n1 && n2) {
      html += `<line x1="${n1.x}" y1="${n1.y}" x2="${n2.x}" y2="${n2.y}" stroke="${l.color}" stroke-width="2.5" class="topo-link" />`;
    }
  });

  // VPN Encrypted Tunnel Virtual Overlay Line
  const mainEdge = nodes.find(n => n.id === 'Main-Edge-Rtr');
  const remoteEdge = nodes.find(n => n.id === 'Remote-Edge-Rtr');
  html += `<path d="M ${mainEdge.x} ${mainEdge.y} Q 480 230 ${remoteEdge.x} ${remoteEdge.y}" fill="none" stroke="#f43f5e" stroke-width="3" stroke-dasharray="8" filter="url(#glow)"/>`;
  html += `<text x="480" y="220" fill="#f43f5e" font-size="12" font-weight="bold" text-anchor="middle">IPsec AES Tunnel (ESP)</text>`;

  // Draw nodes
  nodes.forEach(n => {
    const color = n.type === 'router' ? '#38bdf8' : (n.type === 'cloud' ? '#f59e0b' : '#818cf8');
    html += `
      <g class="topo-node" onclick="inspectNode('${n.id}')">
        <circle cx="${n.x}" cy="${n.y}" r="22" fill="#0f172a" stroke="${color}" stroke-width="3" filter="url(#glow)"/>
        <circle cx="${n.x}" cy="${n.y}" r="14" fill="${color}" opacity="0.3"/>
        <text x="${n.x}" y="${n.y + 36}" fill="#f8fafc" font-size="11" font-weight="600" text-anchor="middle">${n.label}</text>
      </g>
    `;
  });

  svg.innerHTML = html;
}

window.inspectNode = function(id) {
  const d = DEVICES[id];
  const container = document.getElementById('inspector-content');
  if (!container || !d) {
    if (container) {
      container.innerHTML = `<h3>${id}</h3><p style="color:var(--text-muted); margin-top:8px;">Access switch operating in assigned Department VLAN. Refer to <code>configs/Access-Switches.cfg</code> for full port-security configuration.</p>`;
    }
    return;
  }

  let ifHtml = d.interfaces.map(i => `
    <div class="meta-row">
      <span class="meta-label">${i.port}</span>
      <span class="meta-val">${i.ip}</span>
    </div>
    <div style="font-size:0.75rem; color:var(--text-dim); margin-bottom:4px;">Connected to: ${i.to}</div>
  `).join('');

  let featHtml = d.features.map(f => `<li style="font-size:0.82rem; color:var(--cyan); margin-left:1.2rem; margin-bottom:4px;">${f}</li>`).join('');

  container.innerHTML = `
    <h3 class="inspector-title">${id}</h3>
    <div class="meta-row"><span class="meta-label">Role</span><span class="meta-val">${d.role}</span></div>
    <div class="meta-row"><span class="meta-label">Model</span><span class="meta-val">${d.model}</span></div>
    <h4 style="margin: 1rem 0 0.5rem 0; font-size:0.9rem; color:#fff;">Active Interfaces:</h4>
    ${ifHtml}
    <h4 style="margin: 1rem 0 0.5rem 0; font-size:0.9rem; color:#fff;">Key Enabled Features:</h4>
    <ul>${featHtml}</ul>
  `;
};

// Config Viewer Logic
const CONFIGS = {
  'Main-Core-R1': `! Device: Main-Core-R1 (Cisco 2911 ISR)
hostname Main-Core-R1
ip domain-name smartcampus.edu
enable secret CiscoUni2026!
username admin privilege 15 secret CiscoUni2026!

! HSRP Subinterfaces
interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 ip address 10.10.5.2 255.255.255.192
 standby 10 ip 10.10.5.1
 standby 10 priority 110
 standby 10 preempt
 standby 10 track GigabitEthernet0/2 25

interface GigabitEthernet0/0.40
 encapsulation dot1Q 40
 ip address 10.10.2.2 255.255.254.0
 standby 40 ip 10.10.2.1
 standby 40 priority 90

! Multi-Area OSPF with Route Summarization
router ospf 1
 router-id 1.1.1.1
 network 10.10.7.4 0.0.0.3 area 0
 network 10.10.0.0 0.0.1.255 area 1
 area 1 range 10.10.0.0 255.255.248.0`,

  'Main-Core-R2': `! Device: Main-Core-R2 (Cisco 2911 ISR)
hostname Main-Core-R2
ip domain-name smartcampus.edu
enable secret CiscoUni2026!

! HSRP Active for Even VLANs (Students, Hostel, Library)
interface GigabitEthernet0/0.40
 encapsulation dot1Q 40
 ip address 10.10.2.3 255.255.254.0
 standby 40 ip 10.10.2.1
 standby 40 priority 110
 standby 40 preempt
 standby 40 track GigabitEthernet0/2 25

router ospf 1
 router-id 2.2.2.2
 network 10.10.7.8 0.0.0.3 area 0
 network 10.10.0.0 0.0.1.255 area 1
 area 1 range 10.10.0.0 255.255.248.0`,

  'Main-Edge-Rtr': `! Device: Main-Edge-Rtr (Cisco 2911 ISR)
hostname Main-Edge-Rtr
ip route 0.0.0.0 0.0.0.0 203.0.113.2

! Multi-Area OSPF Backbone
router ospf 1
 router-id 3.3.3.3
 network 10.10.7.4 0.0.0.3 area 0
 network 10.10.7.8 0.0.0.3 area 0
 default-information originate

! Site-to-Site IPsec VPN to Remote Campus
crypto isakmp policy 10
 encr aes
 hash sha
 authentication pre-share
 group 2
 lifetime 86400
crypto isakmp key CiscoUni2026! address 203.0.113.5
crypto ipsec transform-set CAMPUS-TS esp-aes esp-sha-hmac

ip access-list extended ACL-VPN-TRAFFIC
 permit ip 10.10.0.0 0.0.7.255 10.10.6.0 0.0.0.255

crypto map CAMPUS-VPN-MAP 10 ipsec-isakmp
 set peer 203.0.113.5
 set transform-set CAMPUS-TS
 match address ACL-VPN-TRAFFIC

interface GigabitEthernet0/2
 crypto map CAMPUS-VPN-MAP`,

  'Remote-Edge-Rtr': `! Device: Remote-Edge-Rtr (Cisco 2911 ISR)
hostname Remote-Edge-Rtr
ip route 0.0.0.0 0.0.0.0 203.0.113.6

crypto isakmp policy 10
 encr aes
 hash sha
 authentication pre-share
 group 2
crypto isakmp key CiscoUni2026! address 203.0.113.1
crypto ipsec transform-set CAMPUS-TS esp-aes esp-sha-hmac

ip access-list extended ACL-REMOTE-VPN
 permit ip 10.10.6.0 0.0.0.255 10.10.0.0 0.0.7.255

crypto map CAMPUS-VPN-MAP 10 ipsec-isakmp
 set peer 203.0.113.1
 set transform-set CAMPUS-TS
 match address ACL-REMOTE-VPN`
};

function setupConfigViewer() {
  const btns = document.querySelectorAll('.cfg-item-btn');
  const codeBox = document.getElementById('code-content');
  const nameBox = document.getElementById('code-filename');
  
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const dev = btn.dataset.dev;
      nameBox.textContent = `${dev}.cfg`;
      codeBox.textContent = CONFIGS[dev] || `! Configuration available in workspace: configs/${dev}.cfg`;
    });
  });

  const copyBtn = document.getElementById('btn-copy-code');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeBox.textContent).then(() => {
        const orig = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied to Clipboard!';
        setTimeout(() => { copyBtn.textContent = orig; }, 2000);
      });
    });
  }
}

// Simulation & Failover Demo
function setupSimulation() {
  const simBtn = document.getElementById('btn-start-sim');
  if (!simBtn) return;
  
  simBtn.addEventListener('click', () => {
    const logBox = document.getElementById('sim-log');
    logBox.innerHTML = '<span style="color:var(--cyan)">[SIMULATION] Initiating HTTP GET from Student-Laptop1 to www.smartcampus.edu (10.10.5.130)...</span><br>';
    
    setTimeout(() => {
      logBox.innerHTML += '<span>[HOP 1] Workstation encapsulating L2 Ethernet (Dst MAC: HSRP VIP Virtual MAC 0000.0c07.ac28), L3 IP (Src: 10.10.2.11, Dst: 10.10.5.130, TTL: 128)</span><br>';
    }, 800);
    
    setTimeout(() => {
      logBox.innerHTML += '<span>[HOP 2] Ingress Core-R2 (Active HSRP for VLAN 40) -> Decrement TTL (128 -> 127) -> Routing table lookup (Area 1 connected VLAN 70)</span><br>';
    }, 1800);
    
    setTimeout(() => {
      logBox.innerHTML += '<span>[HOP 3] Forward across 802.1Q trunk to SW-ServerFarm -> Destination Port 80 HTTP daemon receives packet -> TCP 200 OK Handshake initiated!</span><br>';
      logBox.innerHTML += '<strong style="color:var(--emerald)">✓ END-TO-END SIMULATION VERIFIED SUCCESSFUL!</strong>';
    }, 2800);
  });
}

window.runConvergenceDemo = function() {
  const timerOspf = document.getElementById('timer-ospf');
  const timerRip = document.getElementById('timer-rip');
  
  timerOspf.textContent = 'Recalculating...';
  timerRip.textContent = 'Holddown...';
  
  setTimeout(() => {
    timerOspf.textContent = '1.24s (FULL)';
  }, 1240);
  
  let ripSec = 0;
  const interval = setInterval(() => {
    ripSec += 10;
    timerRip.textContent = `${ripSec}s...`;
    if (ripSec >= 180) {
      clearInterval(interval);
      timerRip.textContent = '180.0s (Flushed)';
    }
  }, 100);
};
