# Campus Data Center Servers & Wireless AP Setup Guide

**Project:** Secure Smart University Campus Network  
**Environment:** Cisco Packet Tracer 8.0+  
**Target Location:** Data Center (Server Farm) - VLAN 70

---

## 1. Server 1: DNS & Web Portal Server (`DNS-WebServer`)

### 1.1 IP Configuration
1. Click on the server `DNS-WebServer` in Packet Tracer.
2. Navigate to **Desktop** $\rightarrow$ **IP Configuration**:
   - **IP Configuration:** Static
   - **IPv4 Address:** `10.10.5.130`
   - **Subnet Mask:** `255.255.255.224`
   - **Default Gateway:** `10.10.5.129` (HSRP Virtual IP for VLAN 70)
   - **DNS Server:** `10.10.5.130` (Points to itself)

### 1.2 DNS Service Setup
1. Navigate to **Config** $\rightarrow$ **Services** $\rightarrow$ **DNS**.
2. Turn DNS Service: **ON**.
3. Add the following resource records:
   - **Name:** `www.smartcampus.edu` | **Type:** `A Record` | **Address:** `10.10.5.130` $\rightarrow$ Click **Add**.
   - **Name:** `smartcampus.edu` | **Type:** `A Record` | **Address:** `10.10.5.130` $\rightarrow$ Click **Add**.
   - **Name:** `mail.smartcampus.edu` | **Type:** `A Record` | **Address:** `10.10.5.131` $\rightarrow$ Click **Add**.
   - **Name:** `ftp.smartcampus.edu` | **Type:** `A Record` | **Address:** `10.10.5.132` $\rightarrow$ Click **Add**.

### 1.3 HTTP / HTTPS Web Portal Setup
1. Navigate to **Services** $\rightarrow$ **HTTP**.
2. Turn **HTTP** and **HTTPS** to **ON**.
3. Locate `index.html` and click **Edit**. Paste the following university portal markup:
```html
<!DOCTYPE html>
<html>
<head>
<title>Smart University Campus Portal</title>
<style>
body { font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; }
.card { background: #1e293b; border-radius: 12px; padding: 25px; max-width: 700px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
h1 { color: #38bdf8; border-bottom: 2px solid #38bdf8; padding-bottom: 10px; }
ul { line-height: 1.8; }
.badge { background: #22c55e; color: #000; padding: 3px 8px; border-radius: 4px; font-weight: bold; }
</style>
</head>
<body>
<div class="card">
  <h1>Smart University Enterprise Portal</h1>
  <p><span class="badge">SECURE CAMPUS NETWORK</span> Operating in VLAN 70 (Data Center)</p>
  <h3>Available Campus Services:</h3>
  <ul>
    <li>Web Portal: <code>http://www.smartcampus.edu</code> (Status: Online)</li>
    <li>Corporate Email: <code>mail.smartcampus.edu</code> (SMTP Port 25 / POP3 Port 110)</li>
    <li>Central FTP Repository: <code>ftp.smartcampus.edu</code> (Port 21)</li>
    <li>Department Network Printer: <code>10.10.5.133</code> (Status: Ready)</li>
  </ul>
</div>
</body>
</html>
```
4. Click **Save** and confirm overwrite.

---

## 2. Server 2: Enterprise Email Server (`Mail-Server`)

### 2.1 IP Configuration
- **IPv4 Address:** `10.10.5.131`
- **Subnet Mask:** `255.255.255.224`
- **Default Gateway:** `10.10.5.129`
- **DNS Server:** `10.10.5.130`

### 2.2 EMAIL Service Setup
1. Navigate to **Services** $\rightarrow$ **EMAIL**.
2. Turn **SMTP Service** and **POP3 Service** to **ON**.
3. Under **Domain Name**, enter: `smartcampus.edu` and click **Set**.
4. Add User Accounts under **User Setup**:
   - **User:** `admin` | **Password:** `password123` $\rightarrow$ Click `+`
   - **User:** `faculty` | **Password:** `password123` $\rightarrow$ Click `+`
   - **User:** `student` | **Password:** `password123` $\rightarrow$ Click `+`
   - **User:** `remoteuser` | **Password:** `password123` $\rightarrow$ Click `+`

---

## 3. Server 3: Central FTP & Syslog Collector (`FTP-Syslog-Server`)

### 3.1 IP Configuration
- **IPv4 Address:** `10.10.5.132`
- **Subnet Mask:** `255.255.255.224`
- **Default Gateway:** `10.10.5.129`
- **DNS Server:** `10.10.5.130`

### 3.2 FTP Service Setup
1. Navigate to **Services** $\rightarrow$ **FTP**.
2. Turn FTP Service: **ON**.
3. Create administrative and student user accounts:
   - **Username:** `admin` | **Password:** `admin123`  
     *Permissions:* Check **Read**, **Write**, **Delete**, **Rename**, **List** $\rightarrow$ Click **Add**.
   - **Username:** `student` | **Password:** `student123`  
     *Permissions:* Check **Read**, **List** $\rightarrow$ Click **Add**.

### 3.3 Syslog Service Setup
1. Navigate to **Services** $\rightarrow$ **SYSLOG**.
2. Turn Syslog Service: **ON**.
3. The syslog service will passively receive and display SNMP traps and router logging events transmitted from `Main-Core-R1`, `Main-Core-R2`, and `Main-Edge-Rtr`.

---

## 4. Hardware Unit 4: Central Shared Network Printer (`NetworkPrinter`)

### 4.1 IP Configuration
1. Click `NetworkPrinter` $\rightarrow$ **Config** $\rightarrow$ **FastEthernet0**:
   - **IP Configuration:** Static
   - **IPv4 Address:** `10.10.5.133`
   - **Subnet Mask:** `255.255.255.224`
   - **Gateway:** `10.10.5.129`

---

## 5. Wireless Access Points Configuration (WPA2-PSK)

### 5.1 Students Access Point (`AP-Students`)
- Connected to switch: `SW-Students` on port `FastEthernet0/24` (Access VLAN 40).
1. Click `AP-Students` $\rightarrow$ **Config** $\rightarrow$ **Port 1 (Wireless)**:
   - **SSID:** `Campus-WiFi`
   - **Authentication:** `WPA2-PSK`
   - **PSK Passphrase:** `CampusWireless2026!`
   - **Encryption:** `AES`
   - **Channel:** Channel 1 (2.412 GHz)

### 5.2 Hostel Access Point (`AP-Hostel`)
- Connected to switch: `SW-Hostel` on port `FastEthernet0/24` (Access VLAN 50).
1. Click `AP-Hostel` $\rightarrow$ **Config** $\rightarrow$ **Port 1 (Wireless)**:
   - **SSID:** `Hostel-WiFi`
   - **Authentication:** `WPA2-PSK`
   - **PSK Passphrase:** `HostelSecure2026!`
   - **Encryption:** `AES`
   - **Channel:** Channel 6 (2.437 GHz)

---

## 6. Client Laptop Wireless Association Instructions
To connect `Student-Laptop1` to `Campus-WiFi`:
1. Click `Student-Laptop1` $\rightarrow$ **Physical** tab.
2. Turn laptop power OFF (toggle the power switch).
3. Drag the FastEthernet module (`PT-LAPTOP-NM-1CFE`) out and drop the wireless module (`WPC300N`) in.
4. Turn laptop power back ON.
5. Navigate to **Desktop** $\rightarrow$ **PC Wireless** $\rightarrow$ **Connect** tab.
6. Click **Refresh**, select `Campus-WiFi`, and click **Connect**.
7. Enter Passphrase: `CampusWireless2026!` $\rightarrow$ Click **Connect**.
8. Verify green wireless link waves appear between the laptop and `AP-Students`.
