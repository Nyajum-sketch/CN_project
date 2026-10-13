# Cisco Packet Tracer Project Implementation (.pkt)

This directory is designated for your completed Cisco Packet Tracer file:
`Secure_Smart_University_Campus_Network.pkt`.

---

## Step-by-Step Construction Guide

To construct and save your `.pkt` file with 100% fidelity:

### Step 1: Launch Simulator & Place Hardware
1. Open **Cisco Packet Tracer** (v8.0+ recommended).
2. From the bottom device palette, place the following hardware onto the canvas:
   - **5x Routers:** Select **2911**
     - Label as: `Main-Core-R1`, `Main-Core-R2`, `Main-Edge-Rtr`, `ISP-Router`, `Remote-Edge-Rtr`
   - **9x Switches:** Select **2960**
     - Label as: `Main-Core-SW1`, `Main-Core-SW2`, `SW-Admin`, `SW-Faculty`, `SW-Labs`, `SW-Students`, `SW-Hostel`, `SW-Library`, `SW-ServerFarm`, `Remote-SW1`
   - **2x Wireless Access Points:** Select **AccessPoint-PT**
     - Label as: `AP-Students`, `AP-Hostel`
   - **4x Servers & 1x Printer:** Select **Server-PT** and **Printer-PT**
     - Label as: `DNS-WebServer`, `Mail-Server`, `FTP-Syslog-Server`, `NetworkPrinter`
   - **Client PCs & Laptops:** Place generic **PC-PT** and **Laptop-PT** in the respective departments.

### Step 2: Insert Hardware Expansion Modules
1. Click `Main-Edge-Rtr` $\rightarrow$ **Physical** tab.
2. Toggle the power switch **OFF**.
3. In the module list on the left, locate **HWIC-2T**. Drag it into slot **WIC 0** (right bay).
4. Toggle power switch back **ON**.
5. Repeat the exact same module installation for `ISP-Router`.

### Step 3: Cable the Topology
Refer to the **Port-to-Port Interconnection Table** in [docs/topology.md](file:///c:/Users/Nyajum/cn_project/docs/topology.md).
- Use **Copper Straight-Through** cables for PC-to-Switch, Switch-to-Router, and Server-to-Switch links.
- Use **Copper Cross-Over** (or auto-MDIX) for Router-to-Router and Switch-to-Switch links.
- Use **Serial DTE/DCE** for `Serial0/0/0` between `Main-Edge-Rtr` and `ISP-Router` (Click `ISP-Router` first to establish clocking DCE side).

### Step 4: Apply Device Configurations
For each device, click on it, select the **CLI** tab, press Enter, and paste the corresponding configuration script from the `configs/` directory:
1. `Main-Core-SW1` $\leftarrow$ `configs/Main-Core-SW1.cfg`
2. `Main-Core-SW2` $\leftarrow$ `configs/Main-Core-SW2.cfg`
3. Access switches (`SW-Admin` through `SW-ServerFarm`, `Remote-SW1`) $\leftarrow$ `configs/Access-Switches.cfg`
4. `Main-Core-R1` $\leftarrow$ `configs/Main-Core-R1.cfg`
5. `Main-Core-R2` $\leftarrow$ `configs/Main-Core-R2.cfg`
6. `ISP-Router` $\leftarrow$ `configs/ISP-Router.cfg`
7. `Main-Edge-Rtr` $\leftarrow$ `configs/Main-Edge-Rtr.cfg`
8. `Remote-Edge-Rtr` $\leftarrow$ `configs/Remote-Edge-Rtr.cfg`

### Step 5: Configure Data Center Servers & Wi-Fi Access Points
Follow the graphical step-by-step instructions in [configs/Servers-Setup.md](file:///c:/Users/Nyajum/cn_project/configs/Servers-Setup.md):
- Assign static IPs to all 4 servers and printer.
- Turn on DNS, HTTP/HTTPS, Email (SMTP/POP3), FTP, and Syslog services.
- Configure WPA2-PSK on the two Access Points.
- Swap Laptop NICs to `WPC300N` and associate them to `Campus-WiFi` and `Hostel-WiFi`.

### Step 6: Test & Save Project
1. Run the test protocols detailed in [docs/testing-and-verification.md](file:///c:/Users/Nyajum/cn_project/docs/testing-and-verification.md).
2. Save the file directly as:
   `c:\Users\Nyajum\cn_project\packet-tracer\Secure_Smart_University_Campus_Network.pkt`.
