# University Campus Network Topology & Architecture Specification

**Project:** Secure Smart University Campus Network  
**Simulator Target:** Cisco Packet Tracer 8.0 / 8.1 / 8.2+  
**Architecture:** Cisco Hierarchical 3-Tier Enterprise Campus Model (Core / Distribution / Access)

---

## 1. Network Assessment & Campus Requirements

A modern university requires a robust, high-availability, high-security digital infrastructure to support academic, administrative, and residential services. 

### 1.1 Organizational Units & Departments
The campus is divided into the following functional departments:
1. **Administration Department:** Handles confidential records, student admissions, financial billing, and human resources. Requires strict isolation from general student traffic.
2. **Faculty Department:** Supports academic staff, teaching portals, lecture notes, grading, and departmental communication.
3. **Computer Laboratories:** High-density desktop environments running demanding lab curriculum, requiring high bandwidth, controlled external internet access, and multicast support.
4. **Student LAN & Wireless:** Extensive BYOD (Bring Your Own Device) environment across classrooms and campus commons, demanding dynamic IP allocation via DHCP, wireless isolation, and rate-limiting.
5. **Hostel (Residential Halls):** 24/7 high-volume residential internet traffic, peer-to-peer restrictions, and dedicated Wi-Fi access points.
6. **University Library:** Digital catalog access, research databases, OPAC workstations, and quiet-zone study laptops.
7. **Data Center / Server Farm:** Centralized servers delivering core enterprise services: DNS, University Web Portal (`www.smartcampus.edu`), Corporate Email (SMTP/POP3), FTP repository, Syslog, and shared network printing.
8. **Network Management (IT & NOC):** Secure out-of-band management VLAN for switches, routers, and SNMP network monitoring.
9. **Remote Campus (Branch Location):** A geographically separated satellite campus hosting remote administrative staff and computer labs, requiring a secure Site-to-Site IPsec VPN tunnel back to the main university data center over the public Internet.

---

## 2. Comparative Topology Analysis & Architectural Justification

| Topology Type | Physical / Logical Layout | Advantages | Disadvantages | Suitability in University Design |
| :--- | :--- | :--- | :--- | :--- |
| **Bus Topology** | Single shared backbone cable with terminators at both ends. | Inexpensive, minimal cabling required. | Single point of failure; collisions increase dramatically with load; difficult to troubleshoot. | **Not Suitable:** Unacceptable failure domain for modern campus networks. |
| **Ring Topology** | Devices connected in a closed circular loop (token passing). | Equal resource access, no packet collisions under token ring. | Break in the ring downs the network; difficult to reconfigure; high latency. | **Not Suitable:** Obsolete for campus LANs; only legacy FDDI or SONET rings in WAN backbones. |
| **Star Topology** | All end devices connect directly to a central node (Switch/Hub). | Easy to install, cable failure isolates only one host, centralized troubleshooting. | Central switch failure isolates all attached hosts; higher cabling requirements. | **Highly Suitable for Access Layer:** Standard LAN topology for all department workstations. |
| **Full Mesh Topology** | Every node is directly connected to every other node ($N(N-1)/2$ links). | Ultimate redundancy, zero single point of failure, optimal data paths. | Prohibitively expensive, cabling complexity, port exhaustion. | **Not Practical for entire campus:** Cost-prohibitive across hundreds of switches. |
| **Hierarchical Hybrid / Extended Star (Selected)** | Combination of Star topology at the Access Layer, interconnected via Partial Mesh at the Core/Distribution Layers. | High scalability, predictable traffic flows, modular growth, localized failure domains, cost-effective redundancy. | Requires careful design, multiple routers, and Layer 2/3 control protocols (STP, HSRP, OSPF). | **OPTIMAL & SELECTED:** Industry-standard Cisco 3-Tier Enterprise Campus Model. |

---

## 3. Hardware Roles & Device Inventory

To ensure complete reproducibility within **Cisco Packet Tracer**, only standardized, universally supported hardware models are utilized:

| Device Role | Packet Tracer Model | Hardware Specifications & Modules | Justification & Architectural Function |
| :--- | :--- | :--- | :--- |
| **Main Core Router 1** (`Main-Core-R1`) | Cisco 2911 Integrated Services Router (ISR) | 3x GigabitEthernet (Gig0/0, Gig0/1, Gig0/2), HWIC-2T Serial slot. | Active HSRP default gateway for Admin, Faculty, Labs, and Server Farm. OSPF Area 1 ABR. Inter-VLAN routing subinterfaces. |
| **Main Core Router 2** (`Main-Core-R2`) | Cisco 2911 ISR | 3x GigabitEthernet, HWIC-2T Serial slot. | Active HSRP default gateway for Students, Hostel, Library. Standby failover for Core-R1. OSPF Area 1 ABR. |
| **Main Edge Router / Firewall** (`Main-Edge-Rtr`) | Cisco 2911 ISR (Security K9 image) | 3x GigabitEthernet, 1x HWIC-2T (Serial0/0/0, Serial0/0/1). | OSPF Area 0 Backbone router, IPsec Site-to-Site VPN termination, Security ACL filtering, NAT/PAT gateway to ISP, isolated RIPv2 test interface. |
| **ISP Simulator Router** (`ISP-Router`) | Cisco 2911 ISR | 3x GigabitEthernet, 1x HWIC-2T. | Simulates Public Internet Service Provider. Connects Main Edge and Remote Edge across public IPv4 transit links. Hosts simulated Internet DNS `8.8.8.8`. |
| **Remote Edge Router** (`Remote-Edge-Rtr`) | Cisco 2911 ISR | 3x GigabitEthernet. | Remote Campus Gateway, Inter-VLAN router for remote departments, IPsec VPN peer tunnel endpoint. |
| **Core Distribution Switches** (`Main-Core-SW1`, `SW2`) | Cisco Catalyst 2960-24TT | 24x FastEthernet, 2x GigabitEthernet uplinks. | Aggregates all department access switches via 802.1Q trunks, dual uplinks to Core Routers. |
| **Department Access Switches** (7 Units) | Cisco Catalyst 2960-24TT | 24x FastEthernet (Fa0/1 - Fa0/24), 2x Gigabit uplinks. | End-user desktop access, 802.1Q VLAN membership, Port Security enforcement (`sticky` MAC), Spanning Tree edge ports (`portfast`). |
| **Remote Campus Access Switch** (`Remote-SW1`) | Cisco Catalyst 2960-24TT | 24x FastEthernet, 2x Gigabit uplinks. | Trunk uplink to Remote Edge Router, Access ports for Remote Admin and Remote Labs. |
| **Wireless Access Points** (2 Units) | Generic AccessPoint-PT | 1x FastEthernet (Port 0), 2.4 GHz 802.11n (Port 1). | Broadcasts SSIDs `Campus-WiFi` and `Hostel-WiFi` with WPA2-PSK (AES) encryption. |
| **Enterprise Servers** (4 Units) | Generic Server-PT | 1x FastEthernet (Fa0). | Dedicated servers in Data Center: Web/DNS, Mail (SMTP/POP3), FTP/Syslog, and Network Printer. |
| **User Workstations & Laptops** | Generic PC-PT & Laptop-PT | 1x FastEthernet or WPC300N Wireless NIC. | Client testing workstations across all departments. |

---

## 4. Logical Topology Diagram & Traffic Flow

```
                      +-----------------------------+
                      |         ISP-Router          |
                      |   (Internet Service Sim)    |
                      |   Loopback0: 8.8.8.8/32     |
                      +--------------+--------------+
                        Gig0/0       |        Gig0/1
            [203.0.113.2/30]         |         [203.0.113.6/30]
                                     |
           Public WAN 1              |               Public WAN 2
   (203.0.113.0/30)                  |       (203.0.113.4/30)
                                     |
+--------------------------+         |         +--------------------------+
|      Main-Edge-Rtr       |         |         |     Remote-Edge-Rtr      |
|  (OSPF Area 0 Backbone)  |         |         |  (Remote Branch Gateway) |
|  Public IP: 203.0.113.1  |         |         |  Public IP: 203.0.113.5  |
+-------------+------------+         |         +-------------+------------+
  Gig0/0      |       Gig0/1         |                       | Gig0/1
  .6/30       |       .10/30         |                       | (Trunk: 110, 140, 199)
              |                      |                       |
   Transit 1  |  Transit 2           |        +--------------+--------------+
(10.10.7.4/30)|(10.10.7.8/30)        |        |          Remote-SW1         |
              |                      |        +-------+--------------+------+
  Gig0/2      |       Gig0/2         |                |              |
  .5/30       |       .9/30          |            Fa0/10          Fa0/20
+-------------+------------+         |         (VLAN 110)      (VLAN 140)
|       Main-Core-R1       |         |             |               |
| (Active HSRP: Odd VLANs) |         |        Remote-Admin   Remote-Student
+-------------+------------+         |
  Gig0/1      |                      |
  .1/30       | Interconnect         |
              | (10.10.7.0/30)       |
  Gig0/1      |                      |
  .2/30       |                      |
+-------------+------------+         |
|       Main-Core-R2       |         |
| (Active HSRP: Even VLANs)|         |
+-------------+------------+         |
       |             |               |
  Gig0/0 (Trunk)  Gig0/0 (Trunk)     |
       |             |               |
+------+-------------+------+        |
|  Main Aggregation Switches|        |
|   Main-Core-SW1 & SW2     |        |
+--------------+------------+        |
               |                     |
     +---------+---------+-----------+-----------+
     |                   |                       |
(Trunk Links)       (Trunk Links)           (Trunk Links)
     |                   |                       |
+----+----+         +----+----+             +----+----+
| SW-Admin|         | SW-Labs |             |SW-Server|
| VLAN 10 |         | VLAN 30 |             | VLAN 70 |
+----+----+         +----+----+             +----+----+
     |                   |                       |
 Admin-PC1            Lab-PC1               +----+----+----+
                                            |DNS |Mail|FTP |
                                            |Web |Serv|Serv|
```

---

## 5. Complete Port-to-Port Interconnection Table

Every link must be connected using the specified cable type and interface to match the configuration files:

| Source Device | Source Port | Target Device | Target Port | Cable Type | Subnet / VLAN / Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Main-Edge-Rtr** | `Gig0/2` | **ISP-Router** | `Gig0/0` | Copper Straight-Through | `203.0.113.0/30` (Public WAN Link 1) |
| **Main-Edge-Rtr** | `Gig0/0` | **Main-Core-R1** | `Gig0/2` | Copper Cross-Over / Auto-MDIX | `10.10.7.4/30` (Core-1 Transit Link) |
| **Main-Edge-Rtr** | `Gig0/1` | **Main-Core-R2** | `Gig0/2` | Copper Cross-Over / Auto-MDIX | `10.10.7.8/30` (Core-2 Transit Link) |
| **Main-Edge-Rtr** | `Serial0/0/0` | **ISP-Router** | `Serial0/0/0`| Serial DTE/DCE (ISP DCE side)| `198.51.100.0/30` (Isolated RIPv2 Test Link) |
| **Main-Core-R1** | `Gig0/1` | **Main-Core-R2** | `Gig0/1` | Copper Cross-Over / Auto-MDIX | `10.10.7.0/30` (Core Interconnect / Heartbeat) |
| **Main-Core-R1** | `Gig0/0` | **Main-Core-SW1** | `Gig0/1` | Copper Straight-Through | 802.1Q Trunk (All Campus VLANs) |
| **Main-Core-R2** | `Gig0/0` | **Main-Core-SW2** | `Gig0/1` | Copper Straight-Through | 802.1Q Trunk (All Campus VLANs) |
| **Main-Core-SW1** | `Gig0/2` | **Main-Core-SW2** | `Gig0/2` | Copper Cross-Over / Auto-MDIX | 802.1Q Trunk Inter-Switch Uplink |
| **Main-Core-SW1** | `Fa0/1` | **SW-Admin** | `Gig0/1` | Copper Straight-Through | 802.1Q Trunk to Admin Switch |
| **Main-Core-SW1** | `Fa0/2` | **SW-Faculty** | `Gig0/1` | Copper Straight-Through | 802.1Q Trunk to Faculty Switch |
| **Main-Core-SW1** | `Fa0/3` | **SW-Labs** | `Gig0/1` | Copper Straight-Through | 802.1Q Trunk to Labs Switch |
| **Main-Core-SW1** | `Fa0/4` | **SW-Students** | `Gig0/1` | Copper Straight-Through | 802.1Q Trunk to Students Switch |
| **Main-Core-SW1** | `Fa0/5` | **SW-Hostel** | `Gig0/1` | Copper Straight-Through | 802.1Q Trunk to Hostel Switch |
| **Main-Core-SW1** | `Fa0/6` | **SW-Library** | `Gig0/1` | Copper Straight-Through | 802.1Q Trunk to Library Switch |
| **Main-Core-SW1** | `Fa0/7` | **SW-ServerFarm**| `Gig0/1` | Copper Straight-Through | 802.1Q Trunk to Server Farm Switch |
| **Remote-Edge-Rtr**| `Gig0/0` | **ISP-Router** | `Gig0/1` | Copper Straight-Through | `203.0.113.4/30` (Public WAN Link 2) |
| **Remote-Edge-Rtr**| `Gig0/1` | **Remote-SW1** | `Gig0/1` | Copper Straight-Through | 802.1Q Trunk (VLAN 110, 140, 199) |
| **SW-Admin** | `Fa0/1` | **Admin-PC1** | `FastEthernet0`| Copper Straight-Through | Access Port (VLAN 10) |
| **SW-Faculty** | `Fa0/1` | **Faculty-PC1** | `FastEthernet0`| Copper Straight-Through | Access Port (VLAN 20) |
| **SW-Labs** | `Fa0/1` | **Lab-PC1** | `FastEthernet0`| Copper Straight-Through | Access Port (VLAN 30) |
| **SW-Students** | `Fa0/24` | **AP-Students** | `Port 0` | Copper Straight-Through | Access Port (VLAN 40) - WPA2 AP |
| **SW-Hostel** | `Fa0/24` | **AP-Hostel** | `Port 0` | Copper Straight-Through | Access Port (VLAN 50) - WPA2 AP |
| **SW-Library** | `Fa0/1` | **Library-PC1** | `FastEthernet0`| Copper Straight-Through | Access Port (VLAN 60) |
| **SW-ServerFarm** | `Fa0/1` | **DNS-WebServer**| `FastEthernet0`| Copper Straight-Through | Access Port (VLAN 70) - `10.10.5.130` |
| **SW-ServerFarm** | `Fa0/2` | **Mail-Server** | `FastEthernet0`| Copper Straight-Through | Access Port (VLAN 70) - `10.10.5.131` |
| **SW-ServerFarm** | `Fa0/3` | **FTP-Server** | `FastEthernet0`| Copper Straight-Through | Access Port (VLAN 70) - `10.10.5.132` |
| **SW-ServerFarm** | `Fa0/4` | **NetworkPrinter**| `FastEthernet0`| Copper Straight-Through | Access Port (VLAN 70) - `10.10.5.133` |
| **Remote-SW1** | `Fa0/10` | **Remote-Admin**| `FastEthernet0`| Copper Straight-Through | Access Port (VLAN 110) |
| **Remote-SW1** | `Fa0/20` | **Remote-Student**|`FastEthernet0`| Copper Straight-Through | Access Port (VLAN 140) |
| **AP-Students** | Wireless 802.11| **Student-Laptop1**| Wireless NIC | 802.11n Wi-Fi Association | SSID: `Campus-WiFi`, WPA2-PSK |
| **AP-Hostel** | Wireless 802.11| **Hostel-Laptop1** | Wireless NIC | 802.11n Wi-Fi Association | SSID: `Hostel-WiFi`, WPA2-PSK |
