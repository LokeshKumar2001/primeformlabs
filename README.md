# Primeform VMC Operator HMI — Startup Guidance

[![Full-Stack Architecture](https://img.shields.io/badge/Stack-React%2018%20%2B%20Zustand%20%2B%20TailwindCSS%20%2B%20Axios%20%2B%20Node.js-00f0ff.svg)](https://github.com/)
[![Tests](https://img.shields.io/badge/Tests-16%20Passed%20%2F%200%20Failed-10b981.svg)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-f59e0b.svg)](https://opensource.org/licenses/MIT)

> **Primeform Software Engineer Assignment Solution**  
> A rugged, responsive, industrial-grade Human-Machine Interface (HMI) built for a Vertical Machining Center (VMC) operator. The system provides foolproof step-by-step guidance starting from power-on machine checks through tool loading, workpiece clamping & datum offsets, ready-state review, and simulated real-time G-code machining execution.

---

## 🌟 Key Highlights & Features

1. **Strict Stage Flow Enforcement (Interlocks)**:
   - `POWER ON` ➔ `MACHINE CHECKS` ➔ `REQUIRED TOOLS` ➔ `WORKPIECE SETUP` ➔ `READY REVIEW` ➔ `RUNNING OPERATION`.
   - Operators cannot bypass incomplete stages. Each check/tool/step is validated before unlocking subsequent actions.
2. **Authentic Siemens SINUMERIK Industrial Aesthetics**:
   - Clean Siemens petrol header (`#00646e`), crisp steel panel framing (`#dce1e8`), modular white widget tiles (`#ffffff`), and authentic tactile softkey buttons.
   - Clean, highly legible European industrial sans-serif typography (`Arial`, `Helvetica Neue`, `Helvetica`, `sans-serif`).
3. **Interactive 2D CNC Machining Simulation**:
   - Real-time HTML5 Canvas visualizer rendering toolpath execution, face milling surface sweep, circular/rectangular pocket milling, hole drilling, tapping, and chamfering.
   - Dynamic chips emission particle system and dual-nozzle flood coolant spray animation.
4. **Realistic CNC Telemetry & Audio Synthesis**:
   - Spindle RPM tachometer (up to 7,200 RPM), Feed Rate gauge (1,400 mm/min), and dynamic Spindle Load torque meter.
   - Built-in **Web Audio API synthesizer** generating tactile button clicks, stage confirmation fanfares, E-stop alarm tones, and low-frequency spindle motor humming.
5. **Full-Stack Persistence & Operator Audit Trail**:
   - Node.js/Express REST backend with persistent JSON session storage ensuring browser reloads retain exact operator progress.
   - Real-time ISO-timestamped audit log tracking operator confirmations, cycle starts, and feed hold stops.

---

## 🔑 Demo Login Credentials for Reviewers

When opening the live application, the **Operator Login Screen** is presented:

| Operator Badge ID | Operator Name | Role & Shift | PIN / Password |
| :--- | :--- | :--- | :--- |
| **`OP-904`** | **J. Sharma** | Lead CNC Precision Machinist *(Shift A)* | **`1234`** *(or 1-Click Demo Login)* |
| **`OP-712`** | **R. Patel** | Senior Setup Machinist *(Shift B)* | **`1234`** *(or 1-Click Demo Login)* |
| **`OP-602`** | **A. Kumar** | Tooling & Fixture Specialist *(Shift C)* | **`1234`** *(or 1-Click Demo Login)* |

---

## 📋 Preloaded Machine Scenario (AERO-FLG-7042 / OP-10)

| Parameter | Specification | Details |
| :--- | :--- | :--- |
| **Part Number** | `AERO-FLG-7042` | Aerospace Structural Flange Housing |
| **Operation** | `OP-10` | Face Top Datum, Rough & Finish Pocket, Drill & M8 Chamfer |
| **Quantity / Batch** | `50 pcs` | Batch `#LOT-PF-2026-088` |
| **Material** | `AL6061-T6 Aluminum` | Billet `150 × 100 × 35 mm`, 95 HB Hardness |
| **Drawing Revision** | `DWG-REV-D` | Approved for Production |
| **CNC Program** | `O8842` (`Rev 2.4.1`) | `O8842_AERO_FLG_OP10.nc` (1,240 Lines, CRC32 Checksum) |
| **Fixture** | `Kurt DX6 Precision Vise` | 5.0mm Stepped Aluminum Soft Jaws + 25mm Ground Parallels |
| **Clamping Torque** | `45 N·m` | Validated via digital torque wrench & 0.02mm feeler gauge |
| **Work Offset (G54)** | `X0 Y0 Z0` Datum | `X: -245.850`, `Y: -180.420`, `Z: -312.150` (Probed) |
| **Operator ID** | `OP-904 (J. Sharma)` | Lead Precision Machinist |

### Required Tools (Preloaded)
1. **T01** — `50mm Face Mill (4 Inserts APKT1604)` — Offset H01 / D01 — 5,200 RPM / 1,400 mm/min
2. **T02** — `12mm Flat End Mill (3-Flute Carbide AlTiN)` — Offset H02 / D02 — 7,200 RPM / 1,800 mm/min
3. **T03** — `6.8mm Jobber Drill (140° Point TiAlN)` — Offset H03 / D03 — 3,800 RPM / 450 mm/min
4. **T04** — `M8 × 1.25 Spiral Flute Tap (HSS-E)` — Offset H04 / D04 — 800 RPM / 1,000 mm/min
5. **T05** — `45° Chamfer Mill (4-Flute Solid Carbide)` — Offset H05 / D05 — 6,000 RPM / 1,200 mm/min

---

## 🛠️ Required Operator Screen Sequence

### Stage 1: Machine Checks
- **Checks**:
  1. Power & Control Available (24VDC Bus & 400V 3-Phase Main)
  2. E-Stop Released (Console E-Stop & Remote Pendant Closed Circuit)
  3. Guard / Door Closed (Pneumatic Interlock Solenoid Engaged)
  4. No Active Alarms (Fanuc Diagnostics 00: Clear)
  5. Lubrication & Coolant Ready (Slideway Oil 92%, Coolant 2.6 bar, Chiller 21.2°C)
  6. Reference Return Complete (G28 X0 Y0 Z0 Verified)
- **Operator Action**: Confirm each check individually or click *Verify All Checks*.
- **Control**: "Next: Required Tools" unlocks only when all 6 checks are green.

### Stage 2: Required Tools
- **Display**: 5 required tools with pocket allocation, gauge length (H), diameter (D), coating, and program revision `Rev 2.4.1`.
- **Operator Action**: Insert and verify each tool in the ATC magazine.
- **Control**: "Next: Workpiece Setup" unlocks only when all 5 tools are loaded.

### Stage 3: Workpiece Setup
- **Steps**:
  1. Clean Kurt DX6 Vise & Seat 25mm Ground Parallels
  2. Position Raw AL6061-T6 Billet Orientation (Extrusion Grain Along X-Axis)
  3. Apply Specified Clamping Torque (45 N·m with Torque Wrench)
  4. Verify Parallel Seating with 0.02mm Feeler Gauge
  5. Confirm Work Coordinate Offset (G54 Touch-Off)
- **Operator Action**: Arrange, clamp, and confirm each setup instruction.
- **Control**: "Next: Ready Review" unlocks when all 5 steps are verified.

### Stage 4: Ready Review
- **Display**: Comprehensive readiness summary matrix across Machine Checks (6/6), Tooling (5/5), and Workpiece Clamping (5/5).
- **Status**: Prominent **SYSTEM STATUS: READY FOR MACHINING** beacon.
- **Operator Action**: Click **PROCEED TO OPERATION** to engage Stage 5.

### Stage 5: Operation Simulation
- **Status Controls**:
  - `READY` ➔ `RUNNING` via **CYCLE START (START OP)**.
  - `RUNNING` ➔ `STOPPED` via **FEED HOLD / STOP** (preserves state and cycle progress).
  - `COMPLETED` ➔ **Next Workpiece / Restart** part cycle.
- **Live CNC Readouts**:
  - 2D Canvas milling visualization with cutter head kinematics, chips, and coolant flood.
  - Tachometer gauges for Spindle RPM, Feed Rate, and Spindle Load %.
  - Live scrolling G-code execution stream synchronized with active tool.
  - Part counter (`Part 1 of 50`) and Cycle Timer (`MM:SS`).

---

## 🏗️ Project Architecture

```
d:\40R\prismalabs/
├── package.json               # Unified root scripts (server, client, build, test)
├── test-e2e.js                # 16-point automated full-stack test suite
├── server/
│   ├── server.js              # Express REST API & static bundle server (Port 5050)
│   ├── stateManager.js        # State machine, validations, persistence & audit log
│   ├── scenarioData.js        # Preloaded mock scenario definitions
│   └── data/
│       └── sessionState.json  # Persistent disk state store
└── client/
    ├── index.html             # Industrial HMI HTML5 shell with Google Fonts
    ├── vite.config.js         # Vite configuration with API proxy
    ├── package.json           # React & UI dependencies
    └── src/
        ├── main.jsx           # React entry point
        ├── App.jsx            # Top-level HMI container & stage router
        ├── audio/
        │   └── soundEffects.js# Web Audio API sound synthesizer
        ├── services/
        │   └── api.js         # REST API client
        ├── styles/
        │   ├── hmi-tokens.css # Industrial CSS variables & theme tokens
        │   ├── hmi-layout.css # Responsive grid and layout styling
        │   └── hmi-components.css # Tactile buttons, LEDs, cards & gauges
        └── components/
            ├── HeaderBar.jsx       # VMC title, job capsule, clock, audio & E-stop
            ├── StageStepper.jsx    # 5-stage tactile progress stepper
            ├── MachineChecks.jsx   # Stage 1: Machine safety checks
            ├── RequiredTools.jsx   # Stage 2: Tool magazine loading
            ├── WorkpieceSetup.jsx  # Stage 3: Workpiece clamping & G54
            ├── ReadyReview.jsx     # Stage 4: Master readiness review
            ├── OperationView.jsx   # Stage 5: Live CNC simulation & telemetry
            ├── MillingCanvas.jsx   # Interactive 2D canvas milling visualizer
            ├── ScenarioInfoModal.jsx # Detailed job specification overlay
            └── AuditLogModal.jsx   # Real-time operator audit trail modal
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+ or v22+)
- npm (v9+)

### Step 1: Install Dependencies
```bash
# Install root dependencies (Express, CORS)
npm install

# Install frontend client dependencies (React, Vite, Lucide)
cd client && npm install && cd ..
```

### Step 2: Build the Frontend Bundle
```bash
npm run build
```

### Step 3: Start the Full-Stack Application
```bash
npm start
```
Open your browser and navigate to:
👉 **`http://localhost:5050`**

### Step 4: Run Automated End-to-End Tests
```bash
node test-e2e.js
```

---

## 🌐 Live URL Deployment Guide

This repository is pre-configured for instant 1-click deployment on platforms such as **Render**, **Railway**, or **Glitch**:

### Deploying to Render (Recommended)
1. Push repository to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com/) and click **New Web Service**.
3. Select your repository.
4. Set the following build and start commands:
   - **Build Command**: `npm install && npm --prefix client install && npm --prefix client run build`
   - **Start Command**: `node server/server.js`
   - **Environment Variable**: `PORT=10000` (or leave default)
5. Deploy! Render will provide your public live HTTPS URL.

---

## 📬 Email Submission Template

```text
To: hr@primeform.in
Subject: Primeform Software Engineer Assignment - VMC Operator HMI - [Your Name]

Dear Hiring Team,

Thank you for the opportunity to complete the technical assignment for the Software Engineer role at Primeform.

I have completed the VMC Operator HMI - Startup Guidance application. Below are the submission details:

- Live Working URL: <PASTE_YOUR_HOSTED_URL_HERE>
- Source Code Repository: <PASTE_GITHUB_REPO_URL_HERE>
- Demo Login / Access: Open access (No login credentials required; preloaded with Scenario SCENARIO-PF-VMC-7042 for Operator OP-904).

Key Implementation Highlights:
1. Strict 5-Stage Operator Flow: Power On -> Machine Checks (6) -> Tools (5) -> Workpiece (5) -> Ready Review -> Live Operation.
2. Safety Interlocks & Lockouts: Stage progression strictly gated until all preceding checklist items are confirmed.
3. Live 2D CNC Canvas Simulation: Interactive toolpath rendering, facing, pocketing, hole drilling, thread tapping, and chamfering with animated chips and dual-nozzle coolant stream.
4. CNC Telemetry & Audio Synthesis: Real-time Spindle RPM, Feed Rate, Spindle Load gauges, scrolling G-code stream, and Web Audio API operator tones.
5. Full-Stack Persistence & Audit Trail: Express REST backend with atomic session storage and ISO-timestamped operator audit logs.

Thank you, and I look forward to your feedback.

Best regards,
[Your Name]
[Your Phone Number]
[Your LinkedIn Profile]
```

---

## 📄 License
MIT License © 2026 Primeform Labs Assignment Candidate.
