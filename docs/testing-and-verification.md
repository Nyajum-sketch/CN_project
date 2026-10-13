# Testing, Verification & Simulation Mode Analysis Guide

**Project:** Secure Smart University Campus Network  
**Simulator Target:** Cisco Packet Tracer 8.0+  
**Purpose:** Comprehensive Test Protocols, Simulation PDU Tracing, and Evidence Verification

---

## 1. Test Suite Overview

| Test ID | Test Category | Objective | Verification Command / Procedure | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **TEST-01** | Layer 2 Switching | Verify 802.1Q Trunks & VLAN Memberships | `show interfaces trunk`, `show vlan brief` | All VLANs present; correct native & allowed VLAN lists. |
| **TEST-02** | Layer 2 Security | Verify Switch Port Security | `show port-security interface Fa0/1` | Status Secure-up; Sticky MAC learned; Violation: Restrict. |
| **TEST-03** | High Availability | Verify HSRP Dual-Router Gateway Failover | `show standby brief`, Link shutdown test | R1 Active for odd VLANs, R2 for even; Failover < 3s. |
| **TEST-04** | Dynamic Routing | Verify Multi-Area OSPF Adjacency & LSAs | `show ip ospf neighbor`, `show ip ospf database` | Neighbors in `FULL` state; Type 1, 2, 3 LSAs present. |
| **TEST-05** | Routing Comparison | RIPv2 vs. OSPF Link-Failure Convergence | Disconnect link; measure recovery time | OSPF recovers in < 3s; RIP takes 180s+ (Holddown). |
| **TEST-06** | Network Services | Verify DHCP Auto-Addressing & DORA Capture | Client DHCP toggle; Simulation Mode capture | Host receives valid IP, Mask, Gateway, DNS. |
| **TEST-07** | Troubleshooting | Intentional DHCP Exhaustion / Collision | Exhaust pool range; verify client fallback | APIPA `169.254.x.x` received; resolved via pool fix. |
| **TEST-08** | Application Services| DNS Resolution & HTTP/HTTPS Web Access | Browse `http://www.smartcampus.edu` | Resolves to `10.10.5.130`; University portal renders. |
| **TEST-09** | Application Services| Enterprise Email (SMTP & POP3) | Send email from Admin PC to Student PC | SMTP delivery on port 25; POP3 retrieval on port 110. |
| **TEST-10** | Security ACLs | Inter-VLAN Isolation Policy Enforcement | Ping Admin PC from Student Laptop | Dropped by ACL; Student web access to Data Center permits. |
| **TEST-11** | WAN & IPsec VPN | Site-to-Site Encrypted Inter-Campus Transit | `ping 10.10.6.130` from Main Campus PC | First packet creates SA; subsequent packets encrypted. |
| **TEST-12** | Packet Tracing | End-to-End PDU Header Breakdown | Simulation Mode step-by-step trace | Full Layer 2, 3, 4 header transitions verified. |

---

## 2. Test Execution Protocols

### 2.1 TEST-03: HSRP Dual-Router Redundancy & Active/Active Load Balancing

#### Verification Commands (Enter on `Main-Core-R1` and `Main-Core-R2`)
```cisco
Main-Core-R1# show standby brief
```
*Expected Output Pattern:*
```
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Gi0/0.10    10   110 P Active  local           10.10.5.3       10.10.5.1
Gi0/0.20    20   110 P Active  local           10.10.4.131     10.10.4.129
Gi0/0.30    30   110 P Active  local           10.10.4.3       10.10.4.1
Gi0/0.40    40   90  P Standby 10.10.2.3       local           10.10.2.1
Gi0/0.50    50   90  P Standby 10.10.0.3       local           10.10.0.1
Gi0/0.60    60   90  P Standby 10.10.5.67      local           10.10.5.65
Gi0/0.70    70   110 P Active  local           10.10.5.135     10.10.5.129
Gi0/0.99    99   110 P Active  local           10.10.5.163     10.10.5.161
```

#### Failover Simulation Test Procedure:
1. Open Command Prompt on `Admin-PC1` and start a continuous ping to the gateway:
   ```cmd
   ping 10.10.5.1 -t
   ```
2. In Packet Tracer, click on `Main-Core-R1` and shut down interface `Gig0/0`:
   ```cisco
   Main-Core-R1(config)# interface GigabitEthernet0/0
   Main-Core-R1(config-if)# shutdown
   ```
3. Observe `Main-Core-R2` CLI console output:
   `%HSRP-5-STATECHANGE: GigabitEthernet0/0.10 Grp 10 state Standby -> Active`
4. Confirm on `Admin-PC1` that only 1 or 2 pings are dropped before communication resumes immediately via `Main-Core-R2`.
5. Re-enable `Gig0/0` on `Main-Core-R1` (`no shutdown`). Because `preempt` is configured with priority 110, `Main-Core-R1` automatically regains the Active role.

---

### 2.2 TEST-05: RIPv2 vs. OSPF Convergence & Link-Failure Recovery Experiment

This experiment demonstrates the dramatic architectural superiority of Link-State routing (OSPF) over Distance-Vector routing (RIP) when handling network link outages.

#### Phase A: OSPF Recovery Timing
1. In `Main-Edge-Rtr`, observe OSPF neighbor state:
   ```cisco
   Main-Edge-Rtr# show ip ospf neighbor
   ```
   Both Core Routers are displayed with state `FULL/BDR` and `FULL/DR`.
2. Delete or disconnect the primary cable between `Main-Core-R1` (`Gig0/2`) and `Main-Edge-Rtr` (`Gig0/0`).
3. **Observed Behavior:**
   - Link-Down event triggers an immediate OSPF Link State Update (LSU).
   - OSPF recomputes the Shortest Path Tree using Dijkstra’s algorithm within milliseconds.
   - Traffic from `Admin-PC1` reroutes via `Main-Core-R2` through the Core Interconnect link (`10.10.7.0/30`).
   - **Convergence Time:** $< \mathbf{1\text{ to }3\text{ seconds}}$.

#### Phase B: RIPv2 Recovery Timing (Isolated Serial Link)
1. In `Main-Edge-Rtr`, enable RIP debugging:
   ```cisco
   Main-Edge-Rtr# debug ip rip
   ```
2. Note that RIP sends updates only periodically every **30 seconds** (`timers basic 30 180 180 240`) to multicast address `224.0.0.9`.
3. Disconnect the Serial cable between `Main-Edge-Rtr` and `ISP-Router`.
4. **Observed Behavior:**
   - Distance-vector protocols suffer from the "count-to-infinity" problem and rely on holddown timers.
   - The route remains in the routing table marked as possibly down for the duration of the Invalid timer (**180 seconds**).
   - The Holddown timer (**180 seconds**) suppresses any routing updates until expiration.
   - Route is only purged after the Flush timer (**240 seconds**).
   - **Convergence Time:** $\approx \mathbf{180\text{ to }240\text{ seconds}}$.

#### Convergence Comparison Summary Table

| Metric / Parameter | OSPFv2 (Enterprise Core) | RIPv2 (Isolated Test Link) |
| :--- | :--- | :--- |
| **Routing Algorithm** | Link-State (Dijkstra SPF) | Distance-Vector (Bellman-Ford) |
| **Routing Metric** | Cost (Cumulative Inverse Bandwidth: $10^8/\text{BW}$) | Hop Count (Maximum 15 hops; 16 = Unreachable) |
| **Update Mechanism** | Event-triggered LSUs upon topology change | Periodic full-table broadcast/multicast every 30s |
| **Loop Prevention** | Complete topological LSDB visibility | Split Horizon, Poison Reverse, Holddown Timers |
| **Convergence Speed** | **Sub-second to 3 seconds** (Instantaneous) | **180 - 240 seconds** (Extremely slow) |
| **Network Scalability** | Hierarchical Multi-Area (Thousands of subnets) | Small networks only (Limited to 15 hops) |

---

### 2.3 TEST-06 & TEST-07: DHCP Verification & Intentional Troubleshooting Demonstration

#### Normal Operation (TEST-06):
1. On `Admin-PC1`, open **Desktop** $\rightarrow$ **IP Configuration**.
2. Select **DHCP**.
3. Verify the IP assigned:
   - IP Address: `10.10.5.11` (first unexcluded address)
   - Subnet Mask: `255.255.255.192`
   - Default Gateway: `10.10.5.1` (HSRP Virtual IP)
   - DNS Server: `10.10.5.130`

#### Intentional Troubleshooting Demonstration (TEST-07):
*Purpose: Demonstrate practical network diagnostics by simulating pool exhaustion and diagnosing the resulting failure.*

1. **Induce Fault:** Log in to `Main-Core-R1` and artificially exclude the entire usable host range:
   ```cisco
   Main-Core-R1(config)# ip dhcp excluded-address 10.10.5.1 10.10.5.62
   ```
2. **Observe Failure:** 
   - Open Command Prompt on `Admin-PC1` and force DHCP renewal:
     ```cmd
     ipconfig /release
     ipconfig /renew
     ```
   - *Result:* Windows client fails to receive a DHCP Offer and falls back to Automatic Private IP Addressing (**APIPA**), assigning `169.254.X.X` with subnet mask `255.255.0.0`.
   - Client is unable to communicate outside its local broadcast segment.
3. **Diagnostic Commands:**
   ```cisco
   Main-Core-R1# show ip dhcp pool POOL-ADMIN
   Main-Core-R1# show ip dhcp conflict
   ```
4. **Remediate Fault:**
   - Remove the accidental blanket exclusion:
     ```cisco
     Main-Core-R1(config)# no ip dhcp excluded-address 10.10.5.1 10.10.5.62
     Main-Core-R1(config)# ip dhcp excluded-address 10.10.5.1 10.10.5.10
     ```
   - On `Admin-PC1`:
     ```cmd
     ipconfig /renew
     ```
   - Client successfully acquires `10.10.5.11` immediately.

---

### 2.4 TEST-08: DNS Resolution & Web Portal Access
1. Open **Web Browser** on `Student-Laptop1`.
2. In the URL bar, enter: `http://www.smartcampus.edu` and press Enter.
3. Verify that the DNS request resolves `www.smartcampus.edu` to `10.10.5.130` and displays the **Smart University Enterprise Portal** page.
4. Test HTTPS secure connectivity: `https://www.smartcampus.edu`.

---

### 2.5 TEST-09: Enterprise Email Verification (SMTP & POP3)
1. On `Admin-PC1`:
   - Open **Desktop** $\rightarrow$ **Email**.
   - Configure account: Name: `Administrator`, Email: `admin@smartcampus.edu`, Incoming/Outgoing Mail Server: `10.10.5.131` (or `mail.smartcampus.edu`), Username: `admin`, Password: `password123`.
2. On `Faculty-PC1`:
   - Configure email client with `faculty@smartcampus.edu`.
3. From `Admin-PC1`, compose a new email:
   - To: `faculty@smartcampus.edu`
   - Subject: `Staff Meeting Notice`
   - Body: `The university board meeting will commence tomorrow at 10:00 AM in Conference Room A.`
   - Click **Send**.
4. On `Faculty-PC1`, click **Receive**. Confirm the message appears in the inbox.

---

### 2.6 TEST-10: Security ACL Enforcement
1. Open Command Prompt on `Student-Laptop1` (`10.10.2.x`).
2. Attempt to ping Admin PC:
   ```cmd
   ping 10.10.5.2
   ```
   *Result:* Request timed out / Destination host unreachable (Blocked by `ACL-STUDENT-POLICY`).
3. Attempt to ping University Data Center Web Server:
   ```cmd
   ping 10.10.5.130
   ```
   *Result:* Ping replies successful (Permitted by policy).
4. Inspect ACL hit counters on `Main-Core-R1`:
   ```cisco
   Main-Core-R1# show access-lists ACL-STUDENT-POLICY
   ```
   *Result:* Permit and Deny match counters incremented.

---

### 2.7 TEST-11: Site-to-Site IPsec VPN Tunnel Verification
1. From `Admin-PC1` (`10.10.5.11`), ping `Remote-Admin` PC (`10.10.6.130`):
   ```cmd
   ping 10.10.6.130
   ```
   *Note:* The first 1 or 2 ICMP packets may time out while the IKE Phase 1 ISAKMP security association and Phase 2 IPsec Quick Mode negotiate. Subsequent pings will succeed with 100% replies.
2. Verify active VPN tunnel on `Main-Edge-Rtr`:
   ```cisco
   Main-Edge-Rtr# show crypto isakmp sa
   ```
   *Expected Output:*
   ```
   IPv4 Crypto ISAKMP SA
   dst             src             state          conn-id slot status
   203.0.113.5     203.0.113.1     QM_IDLE              1    0 ACTIVE
   ```
   *(State `QM_IDLE` indicates successful Phase 1 negotiation).*
3. Inspect IPsec Security Associations and packet encryption counters:
   ```cisco
   Main-Edge-Rtr# show crypto ipsec sa
   ```
   *Expected Output:*
   - `#pkts encaps: 4, #pkts encrypt: 4, #pkts digest: 4`
   - `#pkts decaps: 4, #pkts decrypt: 4, #pkts verify: 4`
   - Demonstrates that campus traffic was encrypted inside ESP packets across the public ISP network!

---

## 3. Simulation Mode PDU Capture & Packet Tracing

Cisco Packet Tracer's **Simulation Mode** allows step-by-step frame inspection down to individual bit fields.

### 3.1 Capturing the DHCP 4-Step DORA Process
1. Switch to **Simulation Mode** (click the stopwatch icon in the bottom-right or press `Shift + S`).
2. Click **Show All/None** to clear filters, then click **Edit Filters**.
3. Under the **IPv4** tab, check only **DHCP** and **UDP**.
4. On `Admin-PC1`, toggle IP configuration from Static to **DHCP**.
5. Click the **Play/Capture Forward** button ($\blacktriangleright|$) step-by-step.
6. Observe the four sequential packets generated:
   - **Discover (DHCPDISCOVER):** Client broadcasts over UDP (Source IP `0.0.0.0`, Dest IP `255.255.255.255`, Source Port `68`, Dest Port `67`).
   - **Offer (DHCPOFFER):** `Main-Core-R1` responds with available IP `10.10.5.11` and lease parameters.
   - **Request (DHCPREQUEST):** Client formally requests the offered address.
   - **Acknowledge (DHCPACK):** Router confirms lease binding.
7. Click the colored PDU envelope in the simulation event list and select **Inbound PDU Details** to view the Ethernet II, IPv4, UDP, and DHCP header structures.

### 3.2 End-to-End Packet Trace & OSI Layer Breakdown
*Scenario: Tracing an HTTP GET request from `Student-Laptop1` (`10.10.2.11`) to `DNS-WebServer` (`10.10.5.130`).*

#### Hop 1: Source Workstation (`Student-Laptop1`)
- **OSI Layer 7 (Application):** HTTP client formats `GET / HTTP/1.1`.
- **OSI Layer 4 (Transport):** Encapsulated into TCP segment with Source Port (ephemeral `1025`) and Dest Port `80` (HTTP).
- **OSI Layer 3 (Network):** Encapsulated into IPv4 packet with Source IP `10.10.2.11`, Dest IP `10.10.5.130`, TTL `128`. Router lookup checks destination against subnet mask: destination is on a remote subnet $\rightarrow$ packet is addressed to default gateway (`10.10.2.1`).
- **OSI Layer 2 (Data Link):** Encapsulated into 802.3 Ethernet frame. Destination MAC is resolved via ARP table to HSRP Virtual MAC (`0000.0c07.ac28` for group 40).
- **OSI Layer 1 (Physical):** Frame modulated into 802.11 RF signal transmitted to `AP-Students`.

#### Hop 2: Access & Distribution Switches (`SW-Students` & `Main-Core-SW1`)
- Switch inspects Layer 2 destination MAC address.
- Ingresses access port `Fa0/24`, tagged with 802.1Q header `VLAN 40`, forwarded across trunk `Gig0/1` without altering Layer 3 IP payload.

#### Hop 3: Core Gateway Router (`Main-Core-R2` - Active for VLAN 40)
- **Layer 2 Decapsulation:** Frame received on `Gig0/0.40`. Destination MAC matches router's interface. Ethernet header stripped.
- **Layer 3 Routing Table Lookup:** Destination IP `10.10.5.130` looked up in CEF / Routing Table. Matches connected route `10.10.5.128/27` via subinterface `Gig0/0.70` (or transit to Core-R1).
- **Header Modification:** Router decrements TTL by 1 (`128 -> 127`), recalculates IPv4 header checksum.
- **Layer 2 Re-encapsulation:** Creates new Ethernet header with Source MAC = `Main-Core-R2 Gig0/0.70`, Destination MAC = Web Server NIC MAC. Packet tagged with 802.1Q `VLAN 70`.

#### Hop 4: Data Center Switch (`SW-ServerFarm`) & Destination Server (`DNS-WebServer`)
- Switch forwards frame out access port `Fa0/1`.
- Server NIC receives frame, strips Layer 2 header, verifies Layer 3 IP `10.10.5.130`, passes TCP payload on port 80 to HTTP daemon, and initiates TCP SYN-ACK return handshake.
