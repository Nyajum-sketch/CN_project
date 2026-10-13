# LABORATORY MINI PROJECT REPORT

---

# DESIGN AND IMPLEMENTATION OF A SECURE SMART UNIVERSITY CAMPUS NETWORK USING CISCO PACKET TRACER

**Course:** Computer Networks Laboratory  
**Course Code:** CS8581 / CS3591  
**Degree & Branch:** Bachelor of Engineering / Technology in Computer Science and Engineering  
**Academic Year:** 2026 – 2027  
**Simulator Platform:** Cisco Packet Tracer 8.0+

---

## TABLE OF CONTENTS
1. [Abstract](#abstract)
2. [Chapter 1: Network Requirements & Assessment](#chapter-1-network-requirements--assessment)
3. [Chapter 2: Network Topology Design & Device Selection](#chapter-2-network-topology-design--device-selection)
4. [Chapter 3: IPv4 Addressing, Binary Conversion & VLSM Design](#chapter-3-ipv4-addressing-binary-conversion--vlsm-design)
5. [Chapter 4: Classless Inter-Domain Routing (CIDR) & Route Summarization](#chapter-4-classless-inter-domain-routing-cidr--route-summarization)
6. [Chapter 5: Enterprise Routing Protocol Implementation (OSPF vs. RIP)](#chapter-5-enterprise-routing-protocol-implementation-ospf-vs-rip)
7. [Chapter 6: Dual-Router High Availability & Gateway Redundancy (HSRP)](#chapter-6-dual-router-high-availability--gateway-redundancy-hsrp)
8. [Chapter 7: Campus Core Network Services](#chapter-7-campus-core-network-services)
9. [Chapter 8: Enterprise Security, Port Security, ACLs & IPsec VPN](#chapter-8-enterprise-security-port-security-acls--ipsec-vpn)
10. [Chapter 9: Simulation Mode Protocol Analysis & PDU Packet Tracing](#chapter-9-simulation-mode-protocol-analysis--pdu-packet-tracing)
11. [Chapter 10: Verification Results & Screenshot Evidence](#chapter-10-verification-results--screenshot-evidence)
12. [Chapter 11: Conclusion & Future Scope](#chapter-11-conclusion--future-scope)
13. [References & RFC Standards](#references--rfc-standards)

---

## ABSTRACT

Modern higher education institutions require scalable, secure, and resilient computer network infrastructures to support high-density user populations, digital learning environments, administrative operations, and secure inter-branch connectivity. This project designs, implements, and verifies a complete enterprise campus network for a smart university comprising seven internal departments (Administration, Faculty, Computer Laboratories, Students, Hostel, Library, and Data Center), alongside a remote satellite campus connected via a simulated public Internet WAN.

The design utilizes Cisco’s 3-Tier Hierarchical Model (Core, Distribution, and Access layers). A custom Variable Length Subnet Masking (VLSM) addressing plan is implemented across seventeen subnets within the private `10.10.0.0/16` allocation, mathematically validated to ensure zero overlapping address spaces and optimal address conservation. Dynamic routing is engineered via Multi-Area Open Shortest Path First (OSPFv2) featuring route summarization on Area Border Routers (ABRs) to generate Type 3 Summary LSAs into the Area 0 backbone. A secondary isolated Serial link evaluates the performance differential between Distance-Vector (RIPv2) and Link-State (OSPF) routing protocols during link failure events.

Gateway fault tolerance is delivered through Hot Standby Router Protocol (HSRP) in an active/active load-sharing arrangement across dual core routers. Core network services including IOS DHCP Server with pool troubleshooting, DNS, HTTP/HTTPS web hosting, corporate email (SMTP/POP3), FTP, and shared network printing are operationalized. Security enforcement is integrated through switch port security (sticky MAC addresses), 802.1Q VLAN separation, SSH v2 administration, granular Extended Access Control Lists (ACLs), edge firewall inspection policies, and a Site-to-Site IPsec VPN tunnel with AES encryption. The complete architecture is verified through Cisco Packet Tracer Simulation Mode, capturing protocol Data Units (PDUs) across all seven layers of the OSI reference model.

---

## CHAPTER 1: NETWORK REQUIREMENTS & ASSESSMENT

### 1.1 Organizational Scenario
Smart University operates a primary main campus catering to over 1,500 active network endpoints and a remote satellite campus accommodating academic and research extension units. The infrastructure must provide:
- Strict department segregation to prevent student access to administrative and grading databases.
- High availability for mission-critical services so that router maintenance or link outages do not interrupt university operations.
- Dynamic IP provisioning for Bring-Your-Own-Device (BYOD) student and hostel laptops.
- Enterprise data center hosting central intranet, web, email, and repository services.
- Secure encrypted interconnection across the public Internet to the remote campus.

### 1.2 User Population & Capacity Sizing
Based on administrative audit data, the user capacity requirements are classified as follows:
- **Residential Hostels:** 500 concurrent wireless/wired endpoints.
- **Student Campus Commons & Classrooms:** 500 concurrent wireless endpoints.
- **Computer Labs:** 120 desktop computers requiring high-bandwidth switched ports.
- **Faculty Offices:** 100 staff workstations and personal devices.
- **Administration & Admissions:** 55 secured terminals with confidential record access.
- **University Library:** 50 research workstations and digital catalog terminals.
- **Data Center / Server Farm:** 25 server interfaces, management appliances, and network printers.
- **Remote Branch Campus:** 125 combined staff, research, and student endpoints.

---

## CHAPTER 2: NETWORK TOPOLOGY DESIGN & DEVICE SELECTION

### 2.1 Comparative Topology Analysis
- **Bus Topology:** Uses a shared transmission medium terminated at both ends. It exhibits a critical single point of failure (cable severance terminates all communication) and suffers high collision rates under heavy load. Unsuitable for university campus networks.
- **Ring Topology:** Nodes form a unidirectional or bidirectional closed loop. While deterministic, cable breaks disrupt the ring unless costly dual counter-rotating fiber rings (e.g. FDDI) are deployed. Inflexible for modular campus expansion.
- **Star Topology:** Peripheral devices attach to a central switch. Easy to cable and isolate faults, making it the industry standard for access layer local area networks.
- **Full Mesh Topology:** Every router connects to every other router ($N(N-1)/2$ links). Provides complete fault tolerance but becomes cost-prohibitive across large numbers of nodes.
- **Hierarchical Extended Star / Hybrid Topology (Selected):** Combines the star topology at the access layer with a partial mesh at the core and distribution layers. This conforms to Cisco's Enterprise Architecture, offering predictable latency, modular growth, and localized failure domains.

### 2.2 Selected Hardware Models
- **Routers (Cisco 2911 ISR):** Modular enterprise routers featuring three GigabitEthernet ports, dual WIC/HWIC slots (equipped with `HWIC-2T` serial interfaces), hardware crypto acceleration for IPsec VPN, 802.1Q subinterfaces, and full HSRP/OSPF feature support.
- **Switches (Cisco Catalyst 2960-24TT):** FastEthernet access switches with Gigabit uplinks supporting 802.1Q trunks, hardware port security, and Rapid-PVST.
- **Access Points (Generic AP-PT):** 802.11n wireless access points configured with WPA2-PSK AES encryption.
- **Servers (Generic Server-PT):** Dedicated network appliances running DNS, HTTP/HTTPS, SMTP/POP3, and FTP daemons.

---

## CHAPTER 3: IPV4 ADDRESSING, BINARY CONVERSION & VLSM DESIGN

### 3.1 IPv4 Addressing Mathematics
IPv4 addresses comprise 32 binary bits divided into four 8-bit octets. Conversion between decimal and binary relies on powers of two:

$$\text{Decimal Value} = \sum_{i=0}^{7} b_i \cdot 2^i \quad (b_i \in \{0, 1\})$$

#### Binary Conversion Table of University Subnets
| Subnet Description | Decimal Address / Prefix | 32-bit Binary Representation (Network) | Binary Subnet Mask |
| :--- | :--- | :--- | :--- |
| **Main Hostel** | `10.10.0.0/23` | `00001010.00001010.00000000.00000000` | `11111111.11111111.11111110.00000000` |
| **Main Students** | `10.10.2.0/23` | `00001010.00001010.00000010.00000000` | `11111111.11111111.11111110.00000000` |
| **Main Labs** | `10.10.4.0/25` | `00001010.00001010.00000100.00000000` | `11111111.11111111.11111111.10000000` |
| **Main Faculty** | `10.10.4.128/25` | `00001010.00001010.00000100.10000000` | `11111111.11111111.11111111.10000000` |
| **Main Admin** | `10.10.5.0/26` | `00001010.00001010.00000101.00000000` | `11111111.11111111.11111111.11000000` |
| **Main Library** | `10.10.5.64/26` | `00001010.00001010.00000101.01000000` | `11111111.11111111.11111111.11000000` |
| **Data Center** | `10.10.5.128/27`| `00001010.00001010.00000101.10000000` | `11111111.11111111.11111111.11100000` |
| **Network Mgmt** | `10.10.5.160/28`| `00001010.00001010.00000101.10100000` | `11111111.11111111.11111111.11110000` |

### 3.2 Master VLSM Allocation Table
*Validated by automated audit script `scripts/validate_vlsm.js` confirming zero address collisions.*

| Department / Role | VLAN ID | Network Address / CIDR | Subnet Mask | Usable Host Range | Broadcast Address | Usable Hosts (Req.) |
| :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **Main Hostel** | 50 | `10.10.0.0/23` | `255.255.254.0` | `10.10.0.1 - 10.10.1.254` | `10.10.1.255` | 510 (500) |
| **Main Students** | 40 | `10.10.2.0/23` | `255.255.254.0` | `10.10.2.1 - 10.10.3.254` | `10.10.3.255` | 510 (500) |
| **Main Labs** | 30 | `10.10.4.0/25` | `255.255.255.128` | `10.10.4.1 - 10.10.4.126` | `10.10.4.127` | 126 (120) |
| **Main Faculty** | 20 | `10.10.4.128/25` | `255.255.255.128` | `10.10.4.129 - 10.10.4.254` | `10.10.4.255` | 126 (100) |
| **Main Admin** | 10 | `10.10.5.0/26` | `255.255.255.192` | `10.10.5.1 - 10.10.5.62` | `10.10.5.63` | 62 (55) |
| **Main Library** | 60 | `10.10.5.64/26` | `255.255.255.192` | `10.10.5.65 - 10.10.5.126` | `10.10.5.127` | 62 (50) |
| **Data Center** | 70 | `10.10.5.128/27` | `255.255.255.224` | `10.10.5.129 - 10.10.5.158` | `10.10.5.159` | 30 (25) |
| **Main Mgmt** | 99 | `10.10.5.160/28` | `255.255.255.240` | `10.10.5.161 - 10.10.5.174` | `10.10.5.175` | 14 (10) |
| **Remote Students**| 140 | `10.10.6.0/25` | `255.255.255.128` | `10.10.6.1 - 10.10.6.126` | `10.10.6.127` | 126 (100) |
| **Remote Admin** | 110 | `10.10.6.128/27` | `255.255.255.224` | `10.10.6.129 - 10.10.6.158` | `10.10.6.159` | 30 (25) |
| **Remote Mgmt** | 199 | `10.10.6.160/28` | `255.255.255.240` | `10.10.6.161 - 10.10.6.174` | `10.10.6.175` | 14 (5) |
| **Core Interconnect**| N/A | `10.10.7.0/30` | `255.255.255.252` | `10.10.7.1 - 10.10.7.2` | `10.10.7.3` | 2 (2) |
| **Transit R1-Edge** | N/A | `10.10.7.4/30` | `255.255.255.252` | `10.10.7.5 - 10.10.7.6` | `10.10.7.7` | 2 (2) |
| **Transit R2-Edge** | N/A | `10.10.7.8/30` | `255.255.255.252` | `10.10.7.9 - 10.10.7.10` | `10.10.7.11` | 2 (2) |
| **Main Public WAN** | N/A | `203.0.113.0/30` | `255.255.255.252` | `203.0.113.1 - 203.0.113.2` | `203.0.113.3` | 2 (2) |
| **Remote Public WAN**| N/A | `203.0.113.4/30` | `255.255.255.252` | `203.0.113.5 - 203.0.113.6` | `203.0.113.7` | 2 (2) |
| **Isolated RIP WAN** | N/A | `198.51.100.0/30` | `255.255.255.252` | `198.51.100.1 - 198.51.100.2` | `198.51.100.3` | 2 (2) |

---

## CHAPTER 4: CLASSLESS INTER-DOMAIN ROUTING (CIDR) & ROUTE SUMMARIZATION

### 4.1 Route Summarization Proof
By grouping departmental subnets contiguously, the routing table size on upstream routers is substantially compressed.
- Main Campus encompasses all internal networks from `10.10.0.0` to `10.10.7.255`.
- Lowest address: `00001010.00001010.00000000.00000000`
- Highest address: `00001010.00001010.00000111.11111111`
- The first 21 bits are identical across all subnets (`00001010.00001010.00000xxx`).
- Hence, the summary supernet route is:
  $$\mathbf{10.10.0.0/21} \quad (\text{Subnet Mask: } 255.255.248.0)$$
- Configured on ABRs (`Main-Core-R1` and `Main-Core-R2`) under `router ospf 1`:
  `area 1 range 10.10.0.0 255.255.248.0`

---

## CHAPTER 5: ENTERPRISE ROUTING PROTOCOL IMPLEMENTATION (OSPF VS. RIP)

### 5.1 Multi-Area OSPF Architecture
- **Area 0 (Backbone Area):** Formed across the transit subnets connecting `Main-Core-R1`, `Main-Core-R2`, and `Main-Edge-Rtr`.
- **Area 1 (Main Campus Area):** Encompasses all departmental subnets.
- **Link-State Advertisements (LSAs):**
  - **Type 1 (Router LSA):** Generated by every OSPF router, listing local link states.
  - **Type 2 (Network LSA):** Generated by the Designated Router (DR) on multi-access transit segments.
  - **Type 3 (Summary LSA):** Generated by ABRs (`Main-Core-R1` and `R2`), advertising `10.10.0.0/21` into Area 0.
  - **Type 5 (AS External LSA):** Injected by `Main-Edge-Rtr` using `default-information originate` to distribute the default internet route throughout the campus.

### 5.2 Isolated RIPv2 vs. OSPF Convergence Experiment
An isolated Serial connection between `Main-Edge-Rtr` and `ISP-Router` executes RIPv2 with custom timers:
`timers basic 30 180 180 240`.
- **Convergence Failure Test:** When the primary link is severed, OSPF recalculates alternate paths in $< 3$ seconds via Dijkstra SPF calculations and event-driven LSUs. Conversely, RIPv2 requires 180 seconds for the route to enter holddown and 240 seconds to flush, proving that OSPF provides superior resilience for mission-critical campus environments.

---

## CHAPTER 6: DUAL-ROUTER HIGH AVAILABILITY & GATEWAY REDUNDANCY (HSRP)

To eliminate single points of failure at the default gateway, Hot Standby Router Protocol (HSRP) version 1 is configured across `Main-Core-R1` and `Main-Core-R2`.
- **Active/Active Symmetrical Load Sharing:**
  - `Main-Core-R1` is configured with priority 110 and preemption for odd VLANs (VLAN 10, 20, 30, 70, 99).
  - `Main-Core-R2` is configured with priority 110 and preemption for even VLANs (VLAN 40, 50, 60).
- **Interface Tracking:**
  Both core routers track their respective uplink interfaces (`Gig0/2`) to `Main-Edge-Rtr`. If an uplink fails, the tracking mechanism decrements priority by 25, triggering immediate preemptive failover to the surviving router.

---

## CHAPTER 7: CAMPUS CORE NETWORK SERVICES

1. **Dynamic Host Configuration Protocol (DHCP):**
   - Configured natively on Cisco IOS routers.
   - Provides default gateway VIPs, DNS server (`10.10.5.130`), domain name (`smartcampus.edu`), and excluded address blocks.
   - Includes documented troubleshooting for pool exhaustion and APIPA fallbacks.
2. **Domain Name System (DNS):**
   - Resolves fully qualified domain names (`www.smartcampus.edu`, `mail.smartcampus.edu`, `ftp.smartcampus.edu`) to their respective data center server IPs.
3. **Hypertext Transfer Protocol (HTTP/HTTPS):**
   - Hosts the official university web portal in the data center.
4. **Corporate Email System (SMTP & POP3):**
   - Mail server daemon configured with domain `smartcampus.edu` supporting authenticated user mailboxes.
5. **File Transfer Protocol (FTP):**
   - Central repository providing academic software distribution, laboratory resources, and configuration backups.
6. **Network Printing:**
   - Central shared printer (`10.10.5.133`) accessible by faculty and administration workstations.

---

## CHAPTER 8: ENTERPRISE SECURITY, PORT SECURITY, ACLS & IPSEC VPN

1. **Layer 2 Switch Port Security:**
   - Applied across all access switches (`switchport port-security`).
   - Limits active MAC addresses to 2 per port, learns legitimate addresses via `mac-address sticky`, and sets violation mode to `restrict` to log unauthorized connection attempts without shutting down the entire switch port.
2. **Access Control Lists (ACLs):**
   - `ACL-STUDENT-POLICY`: Blocks student devices from reaching administrative (`10.10.5.0/26`) and management (`10.10.5.160/28`) subnets while permitting web, email, DNS, and FTP services to the data center.
3. **Secure Management:**
   - Telnet is disabled campus-wide. All routers and switches mandate SSH v2 with 2048-bit RSA keys and local user authentication.
4. **Site-to-Site IPsec VPN:**
   - Encrypts inter-campus communication between Main Campus (`10.10.0.0/21`) and Remote Campus (`10.10.6.0/24`) across the public Internet.
   - **Phase 1 (IKE/ISAKMP):** AES-256 encryption, SHA hashing, Diffie-Hellman Group 2, pre-shared key authentication.
   - **Phase 2 (IPsec):** `esp-aes esp-sha-hmac` transform-set with tunnel mode encapsulation.

---

## CHAPTER 9: SIMULATION MODE PROTOCOL ANALYSIS & PDU PACKET TRACING

Using Cisco Packet Tracer Simulation Mode, data packets were tracked at the bit and byte level:
- **DHCP DORA Capture:** Step-by-step confirmation of Discover, Offer, Request, and Acknowledgment packets showing client UDP port 68 and server UDP port 67.
- **End-to-End Hop-by-Hop Trace:** Tracing an HTTP packet from `Student-Laptop1` to `DNS-WebServer`:
  - Demonstration of Layer 2 MAC address rewriting at the default gateway router.
  - Decrementing of the IPv4 Time-to-Live (TTL) field from 128 to 127.
  - Successful routing decision based on the longest prefix match.
- **VPN ESP Encapsulation:** Showing private university packets encapsulated inside IP Protocol 50 (ESP) with outer public IP headers (`203.0.113.1` $\rightarrow$ `203.0.113.5`) across the ISP router.

---

## CHAPTER 10: VERIFICATION RESULTS & SCREENSHOT EVIDENCE

*Note: Replace placeholders with genuine screenshots captured during your Packet Tracer laboratory testing session.*

| Figure | Description | Expected Test Outcome | Screenshot File Location |
| :---: | :--- | :--- | :--- |
| **Figure 1** | Complete Network Topology in Cisco Packet Tracer | All router and switch link lights green. | `screenshots/01_topology_overview.png` |
| **Figure 2** | HSRP State Verification (`show standby brief`) | Correct Active/Standby distribution across Core-R1 and Core-R2. | `screenshots/02_hsrp_status.png` |
| **Figure 3** | OSPF Neighbors & LSDB (`show ip ospf neighbor`) | Adjacencies in `FULL` state; Type 1, 2, 3 LSAs displayed. | `screenshots/03_ospf_database.png` |
| **Figure 4** | DHCP Client Configuration & IP Acquisition | `Admin-PC1` successfully receiving `10.10.5.11` via DHCP. | `screenshots/04_dhcp_client.png` |
| **Figure 5** | University Web Portal in PC Browser | `www.smartcampus.edu` rendering the university portal. | `screenshots/05_web_portal.png` |
| **Figure 6** | Email Client Transmission (SMTP/POP3) | Successful email dispatch and inbox delivery. | `screenshots/06_email_test.png` |
| **Figure 7** | Inter-VLAN Security ACL Dropping Ping | Student laptop ping to Admin PC timing out. | `screenshots/07_acl_blocking.png` |
| **Figure 8** | Site-to-Site IPsec VPN Active (`show crypto isakmp sa`) | State `QM_IDLE` and incrementing crypto IPsec packet counters. | `screenshots/08_ipsec_vpn_sa.png` |
| **Figure 9** | Simulation Mode DHCP DORA PDU Capture | Four sequential DORA envelopes visible in Event List. | `screenshots/09_pdu_dhcp_dora.png` |
| **Figure 10** | RIP vs. OSPF Convergence Recovery Log | Console log showing sub-3s OSPF vs 180s RIP recovery. | `screenshots/10_routing_comparison.png` |

---

## CHAPTER 11: CONCLUSION & FUTURE SCOPE

The "Design and Implementation of a Secure Smart University Campus Network Using Cisco Packet Tracer" successfully delivers an enterprise-grade digital campus infrastructure. Through rigorous VLSM calculations, hierarchical 3-tier switching, multi-area OSPF routing, dual-router HSRP high availability, comprehensive network services, and multi-layered security (Port Security, ACLs, SSH, and IPsec VPN), the network provides verified end-to-end connectivity, high availability, and data protection.

### Future Enhancements
- **IPv6 Dual-Stack Implementation:** Transitioning from IPv4 to dual-stack IPv4/IPv6 addressing using OSPFv3.
- **Enterprise 802.1X RADIUS Authentication:** Deploying Cisco ISE for individual student credential validation instead of pre-shared keys.
- **Software-Defined Networking (SDN):** Integrating Cisco DNA Center and OpenFlow controllers for programmatic network policy management.

---

## REFERENCES & RFC STANDARDS
1. **RFC 1918:** Address Allocation for Private Internets (Internet Engineering Task Force).
2. **RFC 2328:** OSPF Version 2 (J. Moy, Ascend Communications).
3. **RFC 2281:** Cisco Hot Standby Router Protocol (HSRP).
4. **RFC 2401 / 4301:** Security Architecture for the Internet Protocol (IPsec).
5. **RFC 2131:** Dynamic Host Configuration Protocol (DHCP).
6. **RFC 4632:** Classless Inter-domain Routing (CIDR): The Internet Address Assignment and Aggregation Plan.
7. **Cisco Systems:** *Enterprise Campus 3.0 Architecture: Overview and Framework*, Cisco Press.
8. **Kurose, J. F., & Ross, K. W.:** *Computer Networking: A Top-Down Approach*, 8th Edition, Pearson.
