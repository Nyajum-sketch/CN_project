# University Campus IP Addressing & VLSM Architecture

**Project:** Secure Smart University Campus Network  
**Base Enterprise Allocation:** `10.10.0.0/16` (Private IPv4 - RFC 1918)  
**Public Transit Blocks:** `203.0.113.0/30`, `203.0.113.4/30` (RFC 5737 TEST-NET-3)  
**Isolated Test Transit:** `198.51.100.0/30` (RFC 5737 TEST-NET-2)

---

## 1. Fundamentals of IPv4 & Binary Representation

An IPv4 address consists of **32 binary bits** partitioned into four 8-bit fields known as **octets**, written in dotted-decimal notation (`X.X.X.X`):

$$\text{IP Address} = \text{Octet}_1 \,.\, \text{Octet}_2 \,.\, \text{Octet}_3 \,.\, \text{Octet}_4$$

Each octet has a decimal value between $0$ and $255$ ($2^8 - 1$). The place values of an 8-bit octet are:

| Bit Position | $2^7$ | $2^6$ | $2^5$ | $2^4$ | $2^3$ | $2^2$ | $2^1$ | $2^0$ |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Decimal Value | **128** | **64** | **32** | **16** | **8** | **4** | **2** | **1** |

### 1.1 Binary Conversion Proofs

#### Example 1: Enterprise Gateway Address `10.10.5.1`
- First Octet ($10$): $00001010_2$ ($8 + 2$)
- Second Octet ($10$): $00001010_2$ ($8 + 2$)
- Third Octet ($5$): $00000101_2$ ($4 + 1$)
- Fourth Octet ($1$): $00000001_2$ ($1$)
- **Full 32-bit Binary:** `00001010.00001010.00000101.00000001`

#### Example 2: Subnet Mask `255.255.254.0` (/23)
- First Octet ($255$): $11111111_2$
- Second Octet ($255$): $11111111_2$
- Third Octet ($254$): $11111110_2$
- Fourth Octet ($0$): $00000000_2$
- **Prefix Length:** $8 + 8 + 7 + 0 = \mathbf{/23}$

---

## 2. Variable Length Subnet Masking (VLSM) Design

VLSM allows allocating subnets of varying prefix lengths to match exact host requirements, preventing the massive address waste typical of legacy Classful (Class A, B, C) addressing.

### Mathematical Sizing Formula
For $N$ required host interfaces:
$$2^h - 2 \ge N$$
Where:
- $h$ is the number of host bits remaining ($32 - \text{Prefix Length}$).
- $2$ addresses are reserved per subnet: the **Network Address** (all host bits 0) and the **Broadcast Address** (all host bits 1).

### Sorted VLSM Allocation Table (Largest to Smallest)

| Subnet Function | VLAN ID | Required Hosts | Subnet Size ($2^h$) | CIDR Prefix | Subnet Mask | Wildcard Mask | Usable Host Capacity |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- | :---: |
| **Main Hostel LAN & Wi-Fi** | 50 | 500 | 512 | `/23` | `255.255.254.0` | `0.0.1.255` | 510 |
| **Main Students LAN & Wi-Fi** | 40 | 500 | 512 | `/23` | `255.255.254.0` | `0.0.1.255` | 510 |
| **Main Computer Labs** | 30 | 120 | 128 | `/25` | `255.255.255.128` | `0.0.0.127` | 126 |
| **Main Faculty LAN** | 20 | 100 | 128 | `/25` | `255.255.255.128` | `0.0.0.127` | 126 |
| **Main Administration LAN** | 10 | 55 | 64 | `/26` | `255.255.255.192` | `0.0.0.63` | 62 |
| **Main Library LAN** | 60 | 50 | 64 | `/26` | `255.255.255.192` | `0.0.0.63` | 62 |
| **Main Data Center / Servers**| 70 | 25 | 32 | `/27` | `255.255.255.224` | `0.0.0.31` | 30 |
| **Main IT & NOC Management** | 99 | 10 | 16 | `/28` | `255.255.255.240` | `0.0.0.15` | 14 |
| **Remote Students & Labs** | 140 | 100 | 128 | `/25` | `255.255.255.128` | `0.0.0.127` | 126 |
| **Remote Staff & Admin** | 110 | 25 | 32 | `/27` | `255.255.255.224` | `0.0.0.31` | 30 |
| **Remote NOC Management** | 199 | 5 | 16 | `/28` | `255.255.255.240` | `0.0.0.15` | 14 |
| **Core Interconnect (R1-R2)** | N/A | 2 | 4 | `/30` | `255.255.255.252` | `0.0.0.3` | 2 |
| **Transit Link (R1 to Edge)** | N/A | 2 | 4 | `/30` | `255.255.255.252` | `0.0.0.3` | 2 |
| **Transit Link (R2 to Edge)** | N/A | 2 | 4 | `/30` | `255.255.255.252` | `0.0.0.3` | 2 |
| **Public WAN (Main to ISP)** | N/A | 2 | 4 | `/30` | `255.255.255.252` | `0.0.0.3` | 2 |
| **Public WAN (Remote to ISP)**| N/A | 2 | 4 | `/30` | `255.255.255.252` | `0.0.0.3` | 2 |
| **Isolated RIPv2 Test WAN** | N/A | 2 | 4 | `/30` | `255.255.255.252` | `0.0.0.3` | 2 |

---

## 3. Master IPv4 Subnet Allocation & Range Table

*Verified by `scripts/validate_vlsm.js` with 0 overlaps.*

| Subnet Name | VLAN | Network Address | Subnet Mask | Usable Host Range | Broadcast IP | Default Gateway (HSRP VIP) |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **Main Hostel** | 50 | `10.10.0.0/23` | `255.255.254.0` | `10.10.0.1 - 10.10.1.254` | `10.10.1.255` | `10.10.0.1` |
| **Main Students** | 40 | `10.10.2.0/23` | `255.255.254.0` | `10.10.2.1 - 10.10.3.254` | `10.10.3.255` | `10.10.2.1` |
| **Main Labs** | 30 | `10.10.4.0/25` | `255.255.255.128` | `10.10.4.1 - 10.10.4.126` | `10.10.4.127` | `10.10.4.1` |
| **Main Faculty** | 20 | `10.10.4.128/25` | `255.255.255.128` | `10.10.4.129 - 10.10.4.254` | `10.10.4.255` | `10.10.4.129` |
| **Main Admin** | 10 | `10.10.5.0/26` | `255.255.255.192` | `10.10.5.1 - 10.10.5.62` | `10.10.5.63` | `10.10.5.1` |
| **Main Library** | 60 | `10.10.5.64/26` | `255.255.255.192` | `10.10.5.65 - 10.10.5.126` | `10.10.5.127` | `10.10.5.65` |
| **Data Center** | 70 | `10.10.5.128/27` | `255.255.255.224` | `10.10.5.129 - 10.10.5.158` | `10.10.5.159` | `10.10.5.129` |
| **Main NOC/Mgmt**| 99 | `10.10.5.160/28` | `255.255.255.240` | `10.10.5.161 - 10.10.5.174` | `10.10.5.175` | `10.10.5.161` |
| **Remote Students**| 140 | `10.10.6.0/25` | `255.255.255.128` | `10.10.6.1 - 10.10.6.126` | `10.10.6.127` | `10.10.6.1` |
| **Remote Admin** | 110 | `10.10.6.128/27` | `255.255.255.224` | `10.10.6.129 - 10.10.6.158` | `10.10.6.159` | `10.10.6.129` |
| **Remote Mgmt** | 199 | `10.10.6.160/28` | `255.255.255.240` | `10.10.6.161 - 10.10.6.174` | `10.10.6.175` | `10.10.6.161` |
| **R1-R2 Interconnect**| N/A | `10.10.7.0/30` | `255.255.255.252` | `10.10.7.1 - 10.10.7.2` | `10.10.7.3` | N/A (P2P) |
| **R1 to Edge Transit**| N/A | `10.10.7.4/30` | `255.255.255.252` | `10.10.7.5 - 10.10.7.6` | `10.10.7.7` | N/A (P2P) |
| **R2 to Edge Transit**| N/A | `10.10.7.8/30` | `255.255.255.252` | `10.10.7.9 - 10.10.7.10`| `10.10.7.11` | N/A (P2P) |
| **Main Public WAN**| N/A | `203.0.113.0/30`| `255.255.255.252` | `203.0.113.1 - 203.0.113.2` | `203.0.113.3` | `203.0.113.2` (ISP) |
| **Remote Public WAN**| N/A | `203.0.113.4/30`| `255.255.255.252` | `203.0.113.5 - 203.0.113.6` | `203.0.113.7` | `203.0.113.6` (ISP) |
| **RIPv2 Test WAN**| N/A | `198.51.100.0/30`| `255.255.255.252` | `198.51.100.1 - 198.51.100.2` | `198.51.100.3` | N/A (Isolated) |

---

## 4. CIDR & Hierarchical Route Summarization Proof

Classless Inter-Domain Routing (CIDR) aggregates contiguous routing table entries into a single supernet route, significantly decreasing router memory overhead and CPU SPF calculation cycles.

### 4.1 Main Campus Summary Route: `10.10.0.0/21`
All subnets within the Main Campus span from `10.10.0.0` through `10.10.7.255`:
- Lowest Address: `10.10.0.0` $\rightarrow$ `00001010.00001010.00000000.00000000`
- Highest Address: `10.10.7.255` $\rightarrow$ `00001010.00001010.00000111.11111111`
- **Matching Bits:**
  - Octet 1: `00001010` (8 bits match)
  - Octet 2: `00001010` (8 bits match)
  - Octet 3: `00000` (First 5 bits match: `00000000` through `00000111`)
- **Total Matching Prefix:** $8 + 8 + 5 = \mathbf{21\text{ bits}}$
- **Summary Subnet Mask:** $11111111.11111111.11111000.00000000 = \mathbf{255.255.248.0}$
- **Calculated Summary CIDR Route:** $\mathbf{10.10.0.0/21}$

Applied on OSPF Area Border Routers (`Main-Core-R1` & `Main-Core-R2`) to advertise into Area 0:
```cisco
router ospf 1
 area 1 range 10.10.0.0 255.255.248.0
```

### 4.2 Remote Campus Summary Route: `10.10.6.0/24`
Remote Campus subnets occupy `10.10.6.0/25`, `10.10.6.128/27`, and `10.10.6.160/28`.
- Common Network: `10.10.6.0/24` (`255.255.255.0`)
- Supernet Range: `10.10.6.0` - `10.10.6.255`
- Applied in IPsec crypto access list on Main Edge Router:
```cisco
access-list 105 permit ip 10.10.0.0 0.0.7.255 10.10.6.0 0.0.0.255
```

---

## 5. HSRP Redundancy & IP Address Distribution Plan

The university implements active/active load sharing across the two core routers using Hot Standby Router Protocol (HSRP).

| VLAN | Function | Virtual Gateway (VIP) | Main-Core-R1 IP & Role | Main-Core-R2 IP & Role |
| :---: | :--- | :--- | :--- | :--- |
| **10** | Admin | `10.10.5.1` | `10.10.5.2` (Pri: 110, **Active**) | `10.10.5.3` (Pri: 90, Standby) |
| **20** | Faculty | `10.10.4.129` | `10.10.4.130` (Pri: 110, **Active**) | `10.10.4.131` (Pri: 90, Standby) |
| **30** | Labs | `10.10.4.1` | `10.10.4.2` (Pri: 110, **Active**) | `10.10.4.3` (Pri: 90, Standby) |
| **40** | Students | `10.10.2.1` | `10.10.2.2` (Pri: 90, Standby) | `10.10.2.3` (Pri: 110, **Active**) |
| **50** | Hostel | `10.10.0.1` | `10.10.0.2` (Pri: 90, Standby) | `10.10.0.3` (Pri: 110, **Active**) |
| **60** | Library | `10.10.5.65` | `10.10.5.66` (Pri: 90, Standby) | `10.10.5.67` (Pri: 110, **Active**) |
| **70** | Servers | `10.10.5.129` | `10.10.5.134` (Pri: 110, **Active**) | `10.10.5.135` (Pri: 90, Standby) |
| **99** | Mgmt | `10.10.5.161` | `10.10.5.162` (Pri: 110, **Active**) | `10.10.5.163` (Pri: 90, Standby) |

---

## 6. Static Server & Infrastructure IP Allocations

| Device Name | Static IPv4 Address | Subnet Mask | Default Gateway | Services Provided |
| :--- | :--- | :--- | :--- | :--- |
| **DNS-WebServer** | `10.10.5.130` | `255.255.255.224` | `10.10.5.129` | DNS Domain Names, HTTP/HTTPS Portal (`www.smartcampus.edu`) |
| **Mail-Server** | `10.10.5.131` | `255.255.255.224` | `10.10.5.129` | SMTP (Port 25), POP3 (Port 110) for `@smartcampus.edu` |
| **FTP-Syslog-Server** | `10.10.5.132` | `255.255.255.224` | `10.10.5.129` | FTP Repository, Syslog Collector, SNMP Trap Target |
| **Network-Printer** | `10.10.5.133` | `255.255.255.224` | `10.10.5.129` | Central Department Shared Network Printing |
| **Public Internet DNS** | `8.8.8.8` | `255.255.255.255` | N/A | Simulated External Internet DNS (Hosted on ISP Router Loopback0) |
