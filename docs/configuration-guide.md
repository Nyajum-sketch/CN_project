# University Campus Network Implementation & Configuration Guide

**Project:** Secure Smart University Campus Network  
**Simulator Target:** Cisco Packet Tracer 8.0+  
**Target Audience:** Network Engineers, System Administrators, Laboratory Evaluators

---

## 1. Cisco IOS Command Hierarchy & Mode Navigation

Before applying commands, verify the active command prompt mode in the Cisco IOS Command Line Interface (CLI):

| Prompt Representation | Mode Name | Access Method | Permitted Functions |
| :--- | :--- | :--- | :--- |
| `Router>` | **User EXEC Mode** | Initial connection. | Basic diagnostic viewing (`ping`, `traceroute`, `show version`). |
| `Router#` | **Privileged EXEC Mode** | Type `enable` and enter secret password. | Full diagnostic inspection (`show running-config`, `debug`), testing, saving configuration (`write memory`). |
| `Router(config)#` | **Global Configuration Mode**| Type `configure terminal` from Privileged EXEC. | System-wide parameters (hostname, domain, users, routing processes, crypto policies). |
| `Router(config-if)#` | **Interface Mode** | Type `interface <name>` (e.g., `interface Gig0/1`). | Physical interface parameters (IP address, speed, duplex, nat inside/outside, switchport mode). |
| `Router(config-subif)#`| **Subinterface Mode** | Type `interface <name>.<vlan>` (e.g., `Gig0/0.10`). | 802.1Q VLAN encapsulation, subinterface IP addressing, HSRP standby commands. |
| `Router(config-router)#`| **Router Process Mode** | Type `router ospf 1` or `router rip`. | Routing protocol parameters, network statements, passive interfaces, route summarization. |
| `Router(config-line)#` | **Line Configuration Mode** | Type `line con 0` or `line vty 0 4`. | Console and remote management terminal security (passwords, transport input ssh). |

---

## 2. Implementation Workflow & Execution Dependency Order

To prevent link flapping, routing blackholes, and ARP broadcast storms, configure devices strictly according to the following 7-phase sequence:

```
[Phase 1: Physical Placement & Module Insertion]
                       │
                       ▼
[Phase 2: Distribution & Core Switches (VLANs, Trunks, STP)]
                       │
                       ▼
[Phase 3: Department Access Switches (VLANs, Port Security)]
                       │
                       ▼
[Phase 4: Core Routers (Subinterfaces, HSRP, DHCP, OSPF Area 1)]
                       │
                       ▼
[Phase 5: Edge & WAN Routers (OSPF Area 0, Default Route, NAT, VPN)]
                       │
                       ▼
[Phase 6: Data Center Servers & Wireless Access Points]
                       │
                       ▼
[Phase 7: End-User Devices, DHCP Verification & Testing]
```

### Phase 1: Physical Hardware Preparation
1. Place all devices on the Packet Tracer workspace according to [topology.md](file:///c:/Users/Nyajum/cn_project/docs/topology.md).
2. **Crucial Hardware Module Addition:**
   - Power OFF `Main-Edge-Rtr` and `ISP-Router`.
   - Drag the `HWIC-2T` module into slot `WIC 0` to provide Serial ports (`Serial0/0/0` and `Serial0/0/1`).
   - Power ON both routers.
3. Cable all connections as detailed in the **Port-to-Port Interconnection Table** in [topology.md](file:///c:/Users/Nyajum/cn_project/docs/topology.md).

### Phase 2: Core & Distribution Switching
1. Apply `configs/Main-Core-SW1.cfg` to `Main-Core-SW1`.
2. Apply `configs/Main-Core-SW2.cfg` to `Main-Core-SW2`.
3. Verify that 802.1Q trunks are operational:
   ```cisco
   show interfaces trunk
   show vlan brief
   show spanning-tree summary
   ```

### Phase 3: Access Switching & Layer 2 Security
1. Apply the corresponding section of `configs/Access-Switches.cfg` to each access switch (`SW-Admin`, `SW-Faculty`, `SW-Labs`, `SW-Students`, `SW-Hostel`, `SW-Library`, `SW-ServerFarm`, and `Remote-SW1`).
2. Verify port security and access VLAN memberships:
   ```cisco
   show port-security
   show port-security address
   ```

### Phase 4: Core Routing & High Availability
1. Apply `configs/Main-Core-R1.cfg` to `Main-Core-R1`.
2. Apply `configs/Main-Core-R2.cfg` to `Main-Core-R2`.
3. Verify HSRP convergence and state distribution:
   ```cisco
   show standby brief
   ```
   *Expected State:*
   - `Main-Core-R1`: Active for groups 10, 20, 30, 70, 99; Standby for 40, 50, 60.
   - `Main-Core-R2`: Active for groups 40, 50, 60; Standby for 10, 20, 30, 70, 99.

### Phase 5: Edge, WAN, and Security Gateways
1. Apply `configs/ISP-Router.cfg` to `ISP-Router`.
2. Apply `configs/Main-Edge-Rtr.cfg` to `Main-Edge-Rtr`.
3. Apply `configs/Remote-Edge-Rtr.cfg` to `Remote-Edge-Rtr`.
4. Verify OSPF neighbor adjacencies in Area 0:
   ```cisco
   show ip ospf neighbor
   ```
   *Expected State:* `Main-Edge-Rtr` forms `FULL` neighbor state with both `Main-Core-R1` (`1.1.1.1`) and `Main-Core-R2` (`2.2.2.2`).

### Phase 6: Enterprise Servers & Wi-Fi Configuration
1. Follow [Servers-Setup.md](file:///c:/Users/Nyajum/cn_project/configs/Servers-Setup.md) to statically assign IPs and enable DNS, HTTP, Mail, and FTP services on the Data Center servers.
2. Configure SSIDs and WPA2-PSK passphrases on `AP-Students` and `AP-Hostel`.

### Phase 7: Client Host Verification
1. Toggle client workstations (`Admin-PC1`, `Faculty-PC1`, `Lab-PC1`) to **DHCP** and verify IP assignment.
2. Swap Laptop network modules to wireless `WPC300N` and associate with `Campus-WiFi` and `Hostel-WiFi`.

---

## 3. Deep Dive: Multi-Area OSPF & Link-State Advertisements (LSAs)

Open Shortest Path First (OSPFv2) is a link-state routing protocol based on Dijkstra’s Shortest Path First (SPF) algorithm. In this university enterprise network, a two-area design is implemented:
- **Area 0 (Backbone Area):** Interconnects `Main-Edge-Rtr`, `Main-Core-R1`, and `Main-Core-R2`.
- **Area 1 (Main Campus Area):** Encompasses all departmental subnets.

### 3.1 Explanation of OSPF LSA Types
Inside the OSPF Link-State Database (LSDB), topology information is transported via specialized Link-State Advertisements:

| LSA Type | Name | Originating Router | Scope of Flooding | Function & University Context |
| :---: | :--- | :--- | :--- | :--- |
| **Type 1** | **Router LSA** | Every OSPF router (`Main-Core-R1`, `Core-R2`, `Edge-Rtr`). | Flooded only within the local area. | Describes the router’s local links, interface states, and direct neighbor IDs. |
| **Type 2** | **Network LSA** | Designated Router (DR) on multi-access links. | Flooded only within the local area. | Lists all routers attached to a broadcast segment (e.g. Ethernet switch link). |
| **Type 3** | **Summary LSA** | Area Border Routers (ABRs: `Main-Core-R1`, `Core-R2`). | Flooded between Area 1 and Area 0. | Originates from the command `area 1 range 10.10.0.0 255.255.248.0`. Injects the summarized route for the entire campus into the backbone without leaking individual departmental subnet details. |
| **Type 4** | **ASBR Summary LSA**| Area Border Router (ABR). | Flooded across non-originating areas. | Informs internal routers how to reach an Autonomous System Boundary Router (ASBR). |
| **Type 5** | **AS External LSA** | ASBR (`Main-Edge-Rtr`). | Flooded throughout all standard areas. | Advertises external non-OSPF routes, such as the default route `0.0.0.0/0` generated by `default-information originate`. |

### 3.2 Verification Commands
To inspect LSAs in Packet Tracer:
```cisco
show ip ospf database
show ip ospf database router
show ip ospf database summary
```

---

## 4. Deep Dive: Simple Network Management Protocol (SNMP)

SNMP enables centralized health, performance, and fault monitoring across all university switches and routers.

### 4.1 Core Architectural Components
1. **SNMP Manager (Network Management Station - NMS):** The central monitoring system (simulated on `FTP-Syslog-Server` at `10.10.5.132`). Periodically polls devices and listens for traps on UDP port 162.
2. **SNMP Agent:** Software daemon running inside Cisco IOS on routers and switches. Collects operational statistics (CPU load, interface errors, link-state changes).
3. **Management Information Base (MIB):** A hierarchical, tree-structured database of managed objects. Each variable is identified by an Object Identifier (OID) (e.g., `1.3.6.1.2.1.2.2.1.8` for interface operational status).
4. **SNMP Traps:** Unsolicited asynchronous alert messages sent instantly by the Agent to the Manager when critical threshold events occur (e.g., link going down, power supply failure, unauthorized access attempt).
5. **Community Strings:** Plain-text passwords used in SNMPv1/v2c:
   - `campus-ro`: Read-Only (allows polling statistics without permission to modify device parameters).
   - `campus-rw`: Read-Write (allows administrative parameter configuration via SNMP SET requests).

---

## 5. Separation of Required Configurations vs. Optional Enhancements

| Feature | Mandatory / Baseline | Optional Enhancement | Evaluation Impact |
| :--- | :---: | :---: | :--- |
| **VLANs & 802.1Q Inter-VLAN** | **Mandatory** | N/A | Core requirement for department isolation. |
| **Multi-Area OSPF (Area 0 & 1)** | **Mandatory** | N/A | Demonstrates enterprise hierarchical routing. |
| **HSRP Dual-Router Redundancy** | **Mandatory** | GLBP / VRRP | Evaluates high availability and gateway failover. |
| **Site-to-Site IPsec VPN** | **Mandatory** | GRE over IPsec | Evaluates secure inter-campus WAN tunneling. |
| **Standard & Extended ACLs** | **Mandatory** | Time-based ACLs | Enforces student isolation from admin data. |
| **DHCP Server on IOS** | **Mandatory** | External DHCP Server | Dynamic address provisioning for BYOD laptops. |
| **WPA2 Wireless Networking** | **Mandatory** | 802.1X Enterprise RADIUS | Secure Wi-Fi access for students and hostels. |
| **Port Security (Sticky MAC)** | **Mandatory** | Dynamic ARP Inspection | Prevents MAC flooding and rogue device attachments. |
| **SSH v2 Management** | **Mandatory** | TACACS+ / RADIUS AAA | Eliminates insecure Telnet cleartext passwords. |
| **Isolated RIPv2 Test Link** | **Mandatory** | EIGRP comparison | Fulfills requirement to compare RIP vs OSPF recovery. |
