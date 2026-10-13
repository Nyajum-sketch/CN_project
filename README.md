# Design and Implementation of a Secure Smart University Campus Network Using Cisco Packet Tracer

**Course:** Computer Networks Laboratory Mini Project  
**Author:** Computer Networks Engineering Team  
**Status:** Architecture Designed, Configured & Validated (Ready for Simulator Deployment)

---

## 1. Project Overview

This repository contains the complete engineering design, mathematical calculations, Cisco IOS configurations, verification test protocols, and comprehensive academic report for the **Secure Smart University Campus Network**.

The project models an enterprise university environment comprising:
- **7 Main Campus Departments:** Administration, Faculty, Computer Labs, Students, Hostel, Library, and Data Center Server Farm.
- **Remote Satellite Campus:** Administrative staff and computer labs connected across a simulated Public Internet WAN.
- **Layer 2 / Layer 3 High Availability:** 802.1Q trunking, Port Security, Rapid-PVST, and Active/Active HSRP Dual-Router Redundancy.
- **Enterprise Dynamic Routing:** Multi-Area OSPFv2 (Backbone Area 0 & Campus Area 1) with ABR Route Summarization (`10.10.0.0/21`), alongside an isolated Serial link for comparative RIPv2 vs. OSPF convergence analysis.
- **Campus Core Network Services:** Cisco IOS DHCP server with troubleshooting analysis, DNS (`smartcampus.edu`), HTTP/HTTPS Web Portal, Corporate Email (SMTP/POP3), Central FTP, and Shared Network Printing.
- **Defense-in-Depth Security:** Switch Port Security (sticky MAC, violation restrict), Inter-VLAN Extended Access Control Lists (ACLs), SSH v2 remote administration, edge firewall policy, WPA2-PSK AES wireless networking, and a Site-to-Site IPsec VPN tunnel with AES encryption.

---

## 2. Directory Structure

```
cn_project/
├── README.md                           # Master Project Overview & Quick Start Guide
├── docs/
│   ├── requirements-traceability.md    # Complete RTM mapping every mandatory requirement
│   ├── topology.md                     # Topology analysis, hardware roles & Port Connection Table
│   ├── ip-addressing.md                # IPv4 binary math, VLSM plan, HSRP VIPs & CIDR summarization
│   ├── configuration-guide.md          # Step-by-step CLI execution sequence, OSPF LSAs, SNMP theory
│   ├── testing-and-verification.md     # 12 test protocols, DHCP troubleshooting, Simulation PDU captures
│   └── report.md                       # Complete academic laboratory project report
├── configs/
│   ├── Main-Core-R1.cfg                # Cisco 2911 Core Router 1 (Active HSRP Odd VLANs, OSPF, DHCP)
│   ├── Main-Core-R2.cfg                # Cisco 2911 Core Router 2 (Active HSRP Even VLANs, OSPF)
│   ├── Main-Edge-Rtr.cfg               # Cisco 2911 Edge Gateway (OSPF Area 0, NAT/PAT, IPsec VPN, RIP)
│   ├── ISP-Router.cfg                  # Cisco 2911 ISP Simulator (Public WAN Backbone, Internet DNS 8.8.8.8)
│   ├── Remote-Edge-Rtr.cfg             # Cisco 2911 Remote Gateway (Inter-VLAN, IPsec VPN Peer, DHCP)
│   ├── Main-Core-SW1.cfg               # Catalyst 2960 Core Switch 1 (802.1Q Trunks, STP Root Primary)
│   ├── Main-Core-SW2.cfg               # Catalyst 2960 Core Switch 2 (802.1Q Trunks, STP Redundant)
│   ├── Access-Switches.cfg             # Catalyst 2960 Department Access Switches (Port Security)
│   └── Servers-Setup.md                # GUI setup for DNS, Web, Mail (SMTP/POP3), FTP & Wireless APs
├── scripts/
│   ├── validate_vlsm.js                # Mathematical VLSM validator (Zero overlap & CIDR supernet audit)
│   └── verify_configs.js               # Cross-config consistency auditor (HSRP, IPsec, Transit IPs)
├── screenshots/
│   └── README.md                       # Screenshot placement & naming guide
└── packet-tracer/
    └── README.md                       # Step-by-step construction guide for final .pkt file
```

---

## 3. Validation Scripts & Verification Results

The project includes automated validation scripts to guarantee mathematical precision and configuration consistency:

### 3.1 VLSM & Subnetting Validation
Execute the VLSM audit script:
```bash
node scripts/validate_vlsm.js
```
*Output Result:* **SUCCESS: Zero overlapping subnets detected across all 17 subnets!**

### 3.2 Configuration Consistency Audit
Execute the multi-device configuration auditor:
```bash
node scripts/verify_configs.js
```
*Output Result:* **AUDIT RESULT: 100% CONSISTENCY VERIFIED ACROSS ALL CONFIGURATIONS!**
- HSRP Virtual IPs synchronized across all 8 VLANs.
- Reciprocal IPsec VPN peer IPs (`203.0.113.1` $\leftrightarrow$ `203.0.113.5`) and symmetrical Pre-Shared Keys verified.
- Point-to-Point transit subnets aligned.

---

## 4. Quick Start Implementation in Cisco Packet Tracer

1. Open **Cisco Packet Tracer** (v8.0+).
2. Place the required routers (Cisco 2911), switches (Catalyst 2960), APs, servers, and PCs according to [docs/topology.md](file:///c:/Users/Nyajum/cn_project/docs/topology.md).
3. Connect cables according to the **Port-to-Port Interconnection Table** in [docs/topology.md](file:///c:/Users/Nyajum/cn_project/docs/topology.md).
4. Apply the configuration scripts from `configs/` in the dependency order specified in [docs/configuration-guide.md](file:///c:/Users/Nyajum/cn_project/docs/configuration-guide.md).
5. Set up server services and wireless APs following [configs/Servers-Setup.md](file:///c:/Users/Nyajum/cn_project/configs/Servers-Setup.md).
6. Run the verification tests in [docs/testing-and-verification.md](file:///c:/Users/Nyajum/cn_project/docs/testing-and-verification.md) and capture your genuine screenshots into `screenshots/`.
7. Save your completed project file as `packet-tracer/Secure_Smart_University_Campus_Network.pkt`.
