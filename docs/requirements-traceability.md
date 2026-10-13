# Requirements Traceability Matrix & Implementation Checklist

**Project Title:** Design and Implementation of a Secure Smart University Campus Network Using Cisco Packet Tracer  
**Author:** Computer Networks Laboratory Project  
**Status:** Phase 1 Complete (Design & Configuration Baseline Ready)

---

## 1. Executive Summary & Document Authority

This document defines the comprehensive Requirements Traceability Matrix (RTM) for the Secure Smart University Campus Network project. It covers all mandatory and advanced specifications derived from the laboratory assignment requirements.

Each requirement is mapped to:
- **Design Specifications**
- **Configuration Files & Implementations**
- **Verification Commands & Packet Tracer Procedures**
- **Current Traceability Status** (`DESIGNED & CONFIGURED`, `SIMULATION READY`, `PENDING SCREENSHOT CAPTURE`)

---

## 2. Comprehensive Traceability Matrix

| Req ID | Category | Requirement Description | Technical Specification | Mapped Configuration / Doc | Verification Method | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A.1** | Network Design | Assessment & University Requirements | 7 Main Departments + Remote Campus + Data Center | `docs/topology.md` | Topology Inspection | **DESIGNED** |
| **A.2** | Network Design | Logical & Physical Topology Diagrams | Hierarchical 3-tier Core-Distribution-Access & Physical Layout | `docs/topology.md` | Packet Tracer Topology View | **DESIGNED** |
| **A.3** | Network Design | Topology Analysis (Star, Bus, Mesh, Hybrid) | Comparative analysis of topologies for campus LAN/WAN | `docs/topology.md` | Academic Report Section | **DOCUMENTED** |
| **A.4** | Network Design | Hardware Roles & Selection | Cisco 2911 Routers, Catalyst 2960 Switches, APs, Server Farm | `docs/topology.md` | Device Inventory Audit | **DESIGNED** |
| **A.5** | Network Design | Scalability, Security, Redundancy Architecture | Modular VLANs, HSRP, IPsec, 802.1Q, Port-Security | `docs/topology.md` | Architectural Review | **DESIGNED** |
| **B.1** | IP Addressing | IPv4 Architecture & Binary Conversion | 32-bit dotted-decimal to 32-bit binary math | `docs/ip-addressing.md` | Node Validation Script | **VALIDATED** |
| **B.2** | IP Addressing | Subnet Calculations | Network, Mask, First/Last Usable, Broadcast, Host Capacity | `docs/ip-addressing.md` | `scripts/validate_vlsm.js` | **VALIDATED** |
| **B.3** | IP Addressing | Variable Length Subnet Masking (VLSM) | 17 Subnets customized to department host counts | `docs/ip-addressing.md` | Zero Overlap Validation | **VALIDATED** |
| **B.4** | IP Addressing | CIDR & Route Summarization | Main Campus Supernet `10.10.0.0/21`, Remote `10.10.6.0/24` | `docs/ip-addressing.md` | Routing Table Audit | **VALIDATED** |
| **C.1** | Routing | Static & Default Routing | Default route `0.0.0.0 0.0.0.0` towards ISP / Internet Gateway | `configs/Main-Edge-Rtr.cfg` | `show ip route` | **CONFIGURED** |
| **C.2** | Routing | RIPv2 with Timers & Update Behavior | Isolated test link, custom timers `30 180 180 240` | `configs/Main-Edge-Rtr.cfg` | `debug ip rip`, `show ip rip` | **CONFIGURED** |
| **C.3** | Routing | Multi-Area OSPF (Area 0 & Area 1) | OSPF Process 1, Backbone Area 0, Campus Area 1, ABR summary | `configs/Main-Core-R1.cfg`, `R2` | `show ip ospf neighbor`, `database` | **CONFIGURED** |
| **C.4** | Routing | OSPF LSA Type Explanations | Type 1 (Router), Type 2 (Network), Type 3 (Summary) | `docs/configuration-guide.md`| `show ip ospf database` | **DOCUMENTED** |
| **C.5** | Routing | RIP vs OSPF Convergence Comparison | Observed link failure recovery & convergence timing | `docs/testing-and-verification.md`| Link-down recovery test | **SIMULATION READY**|
| **D.1** | Network Services| DHCP Server & Pool Configuration | IOS DHCP pools with default-router, DNS, excluded addresses | `configs/Main-Core-R1.cfg`, `R2` | `show ip dhcp binding`, `pool` | **CONFIGURED** |
| **D.2** | Network Services| DHCP Troubleshooting Demonstration | Intentional pool exhaustion / scope collision demonstration | `docs/testing-and-verification.md`| Packet Tracer Client DHCP Test | **SIMULATION READY**|
| **D.3** | Network Services| DNS & Web Server (HTTP/HTTPS) | FQDN `www.smartcampus.edu` hosted on Server Farm | `configs/Servers-Setup.md` | Browser navigation from PC | **CONFIGURED** |
| **D.4** | Network Services| Email Services (SMTP & POP3/IMAP) | Mail domain `smartcampus.edu`, user mailboxes | `configs/Servers-Setup.md` | PC Email Client Send/Receive | **CONFIGURED** |
| **D.5** | Network Services| FTP, File Sharing & Network Printer | FTP user auth, shared campus network printer | `configs/Servers-Setup.md` | FTP cmd test, Printer ping | **CONFIGURED** |
| **D.6** | Network Services| Simulation Mode PDU Captures | Capturing DORA (DHCP), SMTP, POP3 packets | `docs/testing-and-verification.md`| Packet Tracer Event List Filter | **SIMULATION READY**|
| **E.1** | Advanced Config | VLANs & 802.1Q Inter-VLAN Routing | VLANs 10,20,30,40,50,60,70,99,110,140,199 on Subinterfaces | `configs/Main-Core-R1.cfg`, `Switches`| `show vlan brief`, `show ip route` | **CONFIGURED** |
| **E.2** | Advanced Config | Dual-Router Redundancy (HSRP) | HSRP Groups on Core-R1 (Active odd) & Core-R2 (Active even) | `configs/Main-Core-R1.cfg`, `R2` | `show standby brief` | **CONFIGURED** |
| **E.3** | Advanced Config | Site-to-Site IPsec VPN | ISAKMP Phase 1, Phase 2 AES-SHA Transform Set, Crypto Map | `configs/Main-Edge-Rtr.cfg`, `Remote`| `show crypto session`, `ipsec sa`| **CONFIGURED** |
| **E.4** | Advanced Config | Security ACLs & Infrastructure Hardening | Standard & Extended ACLs, Server protection, Inter-VLAN block | `configs/Main-Core-R1.cfg`, `Edge`| `show access-lists` | **CONFIGURED** |
| **E.5** | Advanced Config | Switch Port Security & Secure Remote Access | Port security (sticky MAC, violation restrict), SSH v2 | `configs/Access-Switches.cfg` | `show port-security`, SSH test | **CONFIGURED** |
| **E.6** | Advanced Config | WPA2 Wireless Networking | Access Points broadcasting `Campus-WiFi` & `Hostel-WiFi` | `configs/Access-Switches.cfg` | Wireless PC Association | **CONFIGURED** |
| **E.7** | Advanced Config | SNMP Management & Monitoring | SNMP community strings `ro`/`rw`, traps to NMS server | `configs/Main-Core-R1.cfg`, `Edge`| `show snmp`, Trap monitoring | **CONFIGURED** |
| **F.1** | Packet Tracing | End-to-End Packet Trace | PC in Student VLAN to Data Center Web Server & Remote Campus | `docs/testing-and-verification.md`| Packet Tracer Simulation Mode | **SIMULATION READY**|
| **F.2** | Packet Tracing | OSI Layer Header & Routing Breakdown | Layer 2 MAC, Layer 3 IP, Layer 4 TCP/UDP, Next-Hop logic | `docs/testing-and-verification.md`| Inbound/Outbound PDU analysis | **DOCUMENTED** |
| **G.1** | Deliverables | Working Packet Tracer File (.pkt) | Blueprint and Step-by-Step Construction Guide | `packet-tracer/README.md` | Manual PT Build Verification | **READY FOR BUILD** |
| **G.2** | Deliverables | Comprehensive Engineering Project Report | Full academic report matching all required headings | `docs/report.md` | Academic Report Review | **DOCUMENTED** |

---

## 3. Requirement Verification & Acceptance Criteria

1. **Calculations**: Validated via automated script `scripts/validate_vlsm.js` with zero overlapping subnets and compliant CIDR supernetting.
2. **Configurations**: Provided in production Cisco IOS format with explicit interface bindings, clear comment blocks, and no unsupported pseudo-syntax.
3. **Reproducibility**: Explicit step-by-step instructions ensure any student or network engineer can construct the identical network in Cisco Packet Tracer 8.x without guesswork.
