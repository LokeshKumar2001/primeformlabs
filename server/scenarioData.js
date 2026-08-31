/**
 * Preloaded Mock Scenario Data for VMC Operator HMI Startup Guidance
 * Primeform Software Engineer Technical Assignment
 */

const SCENARIO_DATA = {
  scenarioId: "SCENARIO-PF-VMC-7042",
  title: "AERO-FLANGE-7042 Machining (Operation 10)",
  machine: {
    model: "PRIMEFORM VMC-850 Pro CNC",
    serialNumber: "PF-VMC-2026-9841",
    controller: "FANUC 0i-MF Plus (Simulated)",
    spindleMaxRpm: 12000,
    rapidFeedrate: 36000, // mm/min
    axes: ["X: 850mm", "Y: 520mm", "Z: 500mm"],
    coolantSystem: "High-Pressure Dual Nozzle (Flood + Air Blast)",
    lubricationType: "Automatic ISO VG 68 Slideway Oil"
  },
  workOrder: {
    orderNumber: "WO-2026-08842",
    partNumber: "AERO-FLG-7042",
    partName: "Aerospace Structural Flange Housing",
    quantity: 50,
    batchNumber: "LOT-PF-2026-088",
    priority: "HIGH / PRODUCTION RUN",
    estimatedCycleTime: "03m 45s",
    operatorId: "OP-904 (J. Sharma)"
  },
  operation: {
    opNumber: "OP-10",
    opName: "Face Top Datum, Rough & Finish Pocket, Drill & M8 Chamfer",
    cncProgram: {
      programNumber: "O8842",
      fileName: "O8842_AERO_FLG_OP10.nc",
      revision: "Rev 2.4.1",
      checksum: "CRC32-A94E-88C1",
      approvedBy: "Lead CAM Engineer (M. Keller)",
      totalLines: 1240,
      estimatedRunTimeSeconds: 225
    },
    material: {
      specification: "Aluminum Alloy AL6061-T6",
      form: "Extruded Rectangular Billet",
      dimensions: "150.0 mm × 100.0 mm × 35.0 mm",
      hardness: "95 HB (Brinell)",
      drawingRevision: "DWG-REV-D (Approved for Production)"
    },
    fixture: {
      type: "Kurt DX6 Precision Double-Lock Machine Vise",
      jawType: "5.0mm Stepped Aluminum Soft Jaws",
      parallels: "25.0 mm Ground Steel Parallel Set (Matched Pair ±0.005mm)",
      clampingTorqueNm: 45,
      clampingInstructions: "Seat stock against positive left stop. Apply 45 N·m torque on vise handle. Tap stock with copper dead-blow mallet and verify 0.02mm feeler gauge does not pass underneath."
    },
    workOffset: {
      coordinateSystem: "G54",
      datumDescription: "X0 = Workpiece Left Face | Y0 = Back Fixed Jaw Face | Z0 = Top Raw Face Datum",
      probingMethod: "Renishaw 3D Optical Touch Probe (OMP40-2)",
      values: {
        x: -245.850,
        y: -180.420,
        z: -312.150,
        b: 0.000
      }
    }
  },
  machineChecks: [
    {
      id: "chk-power",
      title: "Power & Control Available",
      category: "ELECTRICAL",
      description: "400V 3-Phase Main Breaker closed; 24VDC CNC Bus energized; Spindle chiller active (21.2°C).",
      statusText: "Normal (24.1 VDC / 402 VAC)",
      icon: "zap"
    },
    {
      id: "chk-estop",
      title: "Emergency Stop Released",
      category: "SAFETY",
      description: "Front operator panel E-stop and handheld pendant E-stop buttons rotated and released to normal closed circuit.",
      statusText: "Safety Circuit Closed (Dual Channel OK)",
      icon: "shield-alert"
    },
    {
      id: "chk-door",
      title: "Guard / Door Closed & Interlocked",
      category: "INTERLOCK",
      description: "Enclosure safety sliding doors fully closed and pneumatic solenoid safety lock engaged.",
      statusText: "Interlock Engaged (Lock Solenoid Active)",
      icon: "door-closed"
    },
    {
      id: "chk-alarms",
      title: "No Active CNC Alarms",
      category: "DIAGNOSTICS",
      description: "Fanuc diagnostics clear: No servo overload, no overtravel limit, no hydraulic pressure faults.",
      statusText: "Diagnostic 00: ZERO FAULTS ACTIVE",
      icon: "check-circle"
    },
    {
      id: "chk-lube-coolant",
      title: "Lubrication & Coolant Ready",
      category: "FLUIDS",
      description: "Slideway oil reservoir level at 92%; Flood coolant tank at 88% (Concentration 8.5% Refractometer); Pressure at 2.6 bar.",
      statusText: "Slideway Lube 92% | Coolant 2.6 bar OK",
      icon: "droplets"
    },
    {
      id: "chk-homing",
      title: "Reference Return Complete (G28)",
      category: "KINEMATICS",
      description: "Machine coordinate zero reference return executed for X, Y, and Z axes. Soft limits active.",
      statusText: "Home Position Verified (X0.000 Y0.000 Z0.000)",
      icon: "crosshair"
    }
  ],
  requiredTools: [
    {
      id: "tool-t01",
      toolNumber: "T01",
      pocket: "Pocket #01",
      toolType: "50mm Face Mill (4 Inserts APKT1604)",
      programRevision: "Rev 2.4.1",
      diameter: "50.0 mm",
      lengthOffset: "H01 (+184.22 mm)",
      diameterOffset: "D01 (25.00 mm)",
      maxRpm: 5500,
      feedRate: 1400,
      flutes: 4,
      coating: "TiN Coated Carbide Inserts",
      intendedOperation: "Face mill top datum surface to Z0.000 (Rough & Finish facing passes)",
      coolant: "Flood Coolant (M08)"
    },
    {
      id: "tool-t02",
      toolNumber: "T02",
      pocket: "Pocket #02",
      toolType: "12mm Flat End Mill (3-Flute Solid Carbide)",
      programRevision: "Rev 2.4.1",
      diameter: "12.0 mm",
      lengthOffset: "H02 (+142.65 mm)",
      diameterOffset: "D02 (6.00 mm)",
      maxRpm: 7200,
      feedRate: 1800,
      flutes: 3,
      coating: "AlTiN Micro-Grain Carbide",
      intendedOperation: "Adaptive rough pocketing & side finishing of aerospace pocket contour",
      coolant: "Flood Coolant (M08)"
    },
    {
      id: "tool-t03",
      toolNumber: "T03",
      pocket: "Pocket #03",
      toolType: "6.8mm Jobber Carbide Drill (140° Point)",
      programRevision: "Rev 2.4.1",
      diameter: "6.8 mm",
      lengthOffset: "H03 (+165.10 mm)",
      diameterOffset: "D03 (3.40 mm)",
      maxRpm: 3800,
      feedRate: 450,
      flutes: 2,
      coating: "TiAlN Coated Solid Carbide",
      intendedOperation: "Peck drilling 4× M8 pre-tap clearance holes (Depth: 22.0 mm)",
      coolant: "Flood Coolant + Air Blast (M08 M07)"
    },
    {
      id: "tool-t04",
      toolNumber: "T04",
      pocket: "Pocket #04",
      toolType: "M8 × 1.25 Spiral Flute Tap (HSS-E)",
      programRevision: "Rev 2.4.1",
      diameter: "M8 × 1.25",
      lengthOffset: "H04 (+155.80 mm)",
      diameterOffset: "D04 (0.00 mm)",
      maxRpm: 800,
      feedRate: 1000, // 800 * 1.25 pitch
      flutes: 3,
      coating: "Steam-Tempered Oxide Finish",
      intendedOperation: "Rigid synchronized tapping of 4× M8×1.25 threaded bolt holes (Depth 16mm)",
      coolant: "Tapping Fluid / Flood Coolant (M08)"
    },
    {
      id: "tool-t05",
      toolNumber: "T05",
      pocket: "Pocket #05",
      toolType: "45° Chamfer Mill (4-Flute Solid Carbide)",
      programRevision: "Rev 2.4.1",
      diameter: "10.0 mm (45°)",
      lengthOffset: "H05 (+138.40 mm)",
      diameterOffset: "D05 (5.00 mm)",
      maxRpm: 6000,
      feedRate: 1200,
      flutes: 4,
      coating: "AlTiN Coated",
      intendedOperation: "Deburr top edge and chamfer 4× M8 hole entries (0.5mm × 45°)",
      coolant: "Flood Coolant (M08)"
    }
  ],
  setupInstructions: [
    {
      id: "setup-vise-parallels",
      stepNumber: 1,
      title: "Clean Fixture & Seat Ground Parallels",
      description: "Clean Kurt DX6 vise jaws with chip scraper & brass brush. Place matched 25mm ground parallel bars cleanly against jaw bottoms.",
      verificationCriterion: "Zero chips beneath parallels; free movement until stock placement.",
      badge: "FIXTURE PREP"
    },
    {
      id: "setup-stock-orientation",
      stepNumber: 2,
      title: "Position Raw Billet Orientation",
      description: "Insert 150×100×35mm AL6061-T6 billet with raw extruded grain running parallel to X-axis and pre-stamped datum mark at Top-Left.",
      verificationCriterion: "Stock seated against left positive stop; correct extrusion grain direction.",
      badge: "MATERIAL & ORIENTATION"
    },
    {
      id: "setup-clamping-torque",
      stepNumber: 3,
      title: "Apply Specified Clamping Torque (45 N·m)",
      description: "Tighten vise handle using calibrated digital torque wrench to exactly 45 N·m. Tap top surface lightly with copper dead-blow mallet.",
      verificationCriterion: "Torque wrench click confirmed at 45 N·m; billet seated firmly onto parallels.",
      badge: "CLAMPING SPEC"
    },
    {
      id: "setup-feeler-gauge",
      stepNumber: 4,
      title: "Verify Parallel Seating with Feeler Gauge",
      description: "Attempt to insert a 0.02 mm feeler gauge blade between the workpiece bottom and parallel bars at both front and rear positions.",
      verificationCriterion: "0.02mm blade cannot pass on either side, proving true parallel contact.",
      badge: "QUALITY INSPECTION"
    },
    {
      id: "setup-datum-touchoff",
      stepNumber: 5,
      title: "Confirm Work Coordinate Offset (G54)",
      description: "Verify G54 datum coordinates in CNC controller memory (X: -245.850, Y: -180.420, Z: -312.150). Optical edge touch confirmed.",
      verificationCriterion: "G54 values in Fanuc registry match Job Sheet Rev 2.4.1 exactly.",
      badge: "G54 WORK OFFSET"
    }
  ],
  sampleGCodeBlocks: [
    "% (PROGRAM O8842 - AERO FLANGE OP10 REV 2.4.1)",
    "G21 G90 G40 G80 G49 G17",
    "G28 G91 Z0.0",
    "G90 G54",
    "(TOOL 01: 50MM FACE MILL - ROUGH & FINISH FACING)",
    "M06 T01",
    "G00 X-95.000 Y-60.000 S5200 M03",
    "G43 H01 Z25.000 M08",
    "G01 Z1.000 F2000",
    "G01 Z0.000 F1400",
    "G01 X95.000 F1600",
    "G00 Z15.000",
    "G00 X-95.000 Y20.000",
    "G01 Z0.000 F1400",
    "G01 X95.000 F1600",
    "(TOOL 02: 12MM FLAT END MILL - POCKET MILLING)",
    "G28 G91 Z0.0 M09",
    "M06 T02",
    "G90 G54",
    "G00 X0.000 Y0.000 S7200 M03",
    "G43 H02 Z20.000 M08",
    "G01 Z-5.000 F800",
    "G02 X0.000 Y0.000 I18.000 J0.000 F1800",
    "G01 Z-10.000 F600",
    "G02 X0.000 Y0.000 I32.000 J0.000 F1800",
    "(TOOL 03: 6.8MM DRILL - 4X BOLT HOLES)",
    "G28 G91 Z0.0 M09",
    "M06 T03",
    "G90 G54",
    "G00 X-45.000 Y-25.000 S3800 M03",
    "G43 H03 Z15.000 M08",
    "G83 X-45.000 Y-25.000 Z-22.000 R3.000 Q4.000 F450",
    "X45.000 Y-25.000",
    "X45.000 Y25.000",
    "X-45.000 Y25.000",
    "G80",
    "(TOOL 04: M8 RIGID TAP)",
    "G28 G91 Z0.0 M09",
    "M06 T04",
    "G90 G54",
    "G00 X-45.000 Y-25.000 S800 M03",
    "G43 H04 Z15.000 M08",
    "G84 X-45.000 Y-25.000 Z-16.000 R3.000 F1000",
    "X45.000 Y-25.000",
    "X45.000 Y25.000",
    "X-45.000 Y25.000",
    "G80",
    "(TOOL 05: 45 DEG CHAMFER MILL)",
    "G28 G91 Z0.0 M09",
    "M06 T05",
    "G90 G54",
    "G00 X-55.000 Y-35.000 S6000 M03",
    "G43 H05 Z5.000 M08",
    "G01 Z-1.200 F1200",
    "G01 X55.000 Y-35.000 F1200",
    "G01 X55.000 Y35.000",
    "G01 X-55.000 Y35.000",
    "G01 X-55.000 Y-35.000",
    "G00 Z50.000 M09",
    "G28 G91 Y0.0 Z0.0",
    "M30 (PROGRAM END & RESET)"
  ]
};

module.exports = SCENARIO_DATA;
