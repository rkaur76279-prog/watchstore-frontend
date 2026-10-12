export const INITIAL_ORDERS = [
  {
    id: "RLX-849201-GE",
    date: "2026-10-07",
    formattedDate: "Oct 07, 2026",
    status: "Shipped",
    paymentStatus: "Paid",
    paymentMethod: "Geneva Escrow Wire",
    transactionRef: "TXN-CH-849102",
    items: [
      {
        id: 1,
        name: "Submariner Date 41mm Oystersteel",
        brand: "ROLLEX",
        collection: "Submariner",
        serialNumber: "SN-SUB-940214-CH",
        image: "/watch6.jpg",
        price: 10250.00,
        quantity: 1,
        dialColor: "Cerachrom Black",
        caseSize: "41mm",
        strap: "Oystersteel Bracelet",
        calibre: "Calibre 3235 Superlative Chronometer"
      }
    ],
    totalQuantity: 1,
    subtotal: 10250.00,
    shippingCharge: 0.00,
    tax: 0.00,
    total: 10250.00,
    shippingAddress: {
      fullName: "Lord Harrison Sterling",
      address: "450 Park Avenue, Suite 1800",
      city: "New York",
      country: "United States",
      postalCode: "10022",
      phone: "+1 (212) 555-0199"
    },
    courier: {
      name: "Malca-Amit Armored Transit",
      trackingNumber: "MA-CH-9482104-NX",
      serviceLevel: "White-Glove Armed Security Escort",
      estimatedDelivery: "Oct 11, 2026",
      statusMessage: "Departed Zurich Air Logistics Hub. Customs clearance pre-approved.",
      currentLocation: "Zurich Air Logistics Hub, Switzerland",
      checkpoints: [
        { time: "Oct 07, 2026 - 11:00 AM", status: "Consignment sealed at Geneva Atelier", location: "Geneva, Switzerland" },
        { time: "Oct 08, 2026 - 03:30 PM", status: "Armored escort transit to Zurich vault", location: "Zurich Hub, Switzerland" },
        { time: "Oct 09, 2026 - 08:15 AM", status: "Departed international air cargo", location: "Zurich International Airport" }
      ]
    },
    timeline: [
      { stage: "Order Placed", title: "Order Placed", description: "Allocation reserved and client funds confirmed via Geneva Escrow", timestamp: "Oct 07, 2026 • 09:30 AM CET", completed: true },
      { stage: "Processing", title: "Processing & Certification", description: "Superlative Chronometer -2/+2 sec/day precision certified at Geneva Atelier", timestamp: "Oct 08, 2026 • 02:15 PM CET", completed: true },
      { stage: "Shipped", title: "Dispatched in Armored Transit", description: "Consignment handed to Malca-Amit courier under diplomatic security seal", timestamp: "Oct 09, 2026 • 10:45 AM CET", completed: true, current: true },
      { stage: "Delivered", title: "Client Handover", description: "In-person biometric verification & signed physical handover", timestamp: "Estimated Oct 11, 2026", completed: false }
    ],
    chronometerCertificate: "CH-COSC-904812",
    warrantyPeriod: "6-Year International Superlative Guarantee",
    notes: "Consignment packaged in lacquered green walnut presentation box with serialized registry booklet."
  },
  {
    id: "RLX-723910-GE",
    date: "2026-09-28",
    formattedDate: "Sep 28, 2026",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Centurion Platinum Reserve",
    transactionRef: "TXN-AMX-773910",
    items: [
      {
        id: 2,
        name: "Cosmograph Daytona 40mm Oystersteel",
        brand: "ROLLEX",
        collection: "Daytona",
        serialNumber: "SN-DAY-881203-CH",
        image: "/watch7.jpg",
        price: 15100.00,
        quantity: 1,
        dialColor: "White Lacquer Panda",
        caseSize: "40mm",
        strap: "Oystersteel Bracelet",
        calibre: "Calibre 4131 Chronograph"
      }
    ],
    totalQuantity: 1,
    subtotal: 15100.00,
    shippingCharge: 0.00,
    tax: 0.00,
    total: 15100.00,
    shippingAddress: {
      fullName: "Lord Harrison Sterling",
      address: "450 Park Avenue, Suite 1800",
      city: "New York",
      country: "United States",
      postalCode: "10022",
      phone: "+1 (212) 555-0199"
    },
    courier: {
      name: "Ferrari Group International",
      trackingNumber: "FG-EXP-110294-US",
      serviceLevel: "Direct White-Glove Handover",
      estimatedDelivery: "Delivered Oct 03, 2026",
      statusMessage: "Successfully delivered and signed by Lord Harrison Sterling.",
      currentLocation: "New York, NY (Delivered)",
      checkpoints: [
        { time: "Sep 28, 2026 - 10:00 AM", status: "Order placed & verified", location: "Geneva, Switzerland" },
        { time: "Sep 30, 2026 - 04:00 PM", status: "Arrived at JFK Diplomatic Vault", location: "New York, USA" },
        { time: "Oct 03, 2026 - 02:40 PM", status: "Delivered and signed by client", location: "Park Avenue, New York" }
      ]
    },
    timeline: [
      { stage: "Order Placed", title: "Order Placed", description: "VIP allocation verified and client dossier authorized", timestamp: "Sep 28, 2026 • 10:12 AM CET", completed: true },
      { stage: "Processing", title: "Inspection & Overhaul", description: "Chronometer tolerance verification and calibration completed", timestamp: "Sep 29, 2026 • 04:00 PM CET", completed: true },
      { stage: "Shipped", title: "Armored Transit", description: "Dispatched via Ferrari Group White-Glove Air Cargo", timestamp: "Oct 01, 2026 • 09:30 AM CET", completed: true },
      { stage: "Delivered", title: "Delivered & Certified", description: "Handed to client Lord Harrison Sterling. Registry active.", timestamp: "Oct 03, 2026 • 02:40 PM EST", completed: true, current: true }
    ],
    chronometerCertificate: "CH-COSC-773190",
    warrantyPeriod: "6-Year International Superlative Guarantee",
    notes: "Client warranty officially registered in Swiss Chronometer Registry database."
  },
  {
    id: "RLX-610482-GE",
    date: "2026-10-08",
    formattedDate: "Oct 08, 2026",
    status: "Processing",
    paymentStatus: "Paid",
    paymentMethod: "Geneva Escrow Wire",
    transactionRef: "TXN-CH-610482",
    items: [
      {
        id: 3,
        name: "GMT-Master II 'Pepsi' 40mm Jubilee",
        brand: "ROLLEX",
        collection: "GMT-Master II",
        serialNumber: "SN-GMT-739102-CH",
        image: "/watch10.jpg",
        price: 11150.00,
        quantity: 1,
        dialColor: "Cerachrom Blue/Red",
        caseSize: "40mm",
        strap: "Jubilee 5-Piece Link",
        calibre: "Calibre 3285 Dual Time Zone"
      }
    ],
    totalQuantity: 1,
    subtotal: 11150.00,
    shippingCharge: 0.00,
    tax: 0.00,
    total: 11150.00,
    shippingAddress: {
      fullName: "Lord Harrison Sterling",
      address: "450 Park Avenue, Suite 1800",
      city: "New York",
      country: "United States",
      postalCode: "10022",
      phone: "+1 (212) 555-0199"
    },
    courier: {
      name: "Malca-Amit Armored Transit",
      trackingNumber: "MA-PENDING-ALLOCATION",
      serviceLevel: "White-Glove Armed Security Escort",
      estimatedDelivery: "Oct 14, 2026",
      statusMessage: "Timepiece undergoing final casing and COSC rate stability tests at Geneva Atelier.",
      currentLocation: "Geneva Atelier, Switzerland",
      checkpoints: [
        { time: "Oct 08, 2026 - 02:00 PM", status: "Order registered and private allocation confirmed", location: "Geneva, Switzerland" },
        { time: "Oct 09, 2026 - 10:00 AM", status: "Master horologist assembly and pressure testing", location: "Geneva Atelier" }
      ]
    },
    timeline: [
      { stage: "Order Placed", title: "Order Placed", description: "Bespoke order logged with Swiss Chronometer Registry", timestamp: "Oct 08, 2026 • 02:15 PM CET", completed: true },
      { stage: "Processing", title: "Chronometer Calibration", description: "Final testing of 70-hour power reserve and water resistance", timestamp: "Oct 09, 2026 • 10:00 AM CET", completed: true, current: true },
      { stage: "Shipped", title: "Armored Courier Dispatch", description: "Awaiting security packaging and seal assignment", timestamp: "Estimated Oct 10, 2026", completed: false },
      { stage: "Delivered", title: "Final Handover", description: "In-person client delivery", timestamp: "Estimated Oct 14, 2026", completed: false }
    ],
    chronometerCertificate: "CH-COSC-610482",
    warrantyPeriod: "6-Year International Superlative Guarantee",
    notes: "Eligible for complimentary cancellation until consignment departure."
  },
  {
    id: "RLX-519284-GE",
    date: "2026-10-09",
    formattedDate: "Oct 09, 2026",
    status: "Pending",
    paymentStatus: "Pending",
    paymentMethod: "Swiss Private Bank Wire",
    transactionRef: "TXN-PB-519284",
    items: [
      {
        id: 4,
        name: "Day-Date 40 18ct Everose Gold",
        brand: "ROLLEX",
        collection: "Day-Date",
        serialNumber: "SN-DD-401928-CH",
        image: "/watch11.jpg",
        price: 41500.00,
        quantity: 1,
        dialColor: "Olive Green Sunray",
        caseSize: "40mm",
        strap: "President Semi-Circular Links",
        calibre: "Calibre 3255 Day-Date Manufacture"
      }
    ],
    totalQuantity: 1,
    subtotal: 41500.00,
    shippingCharge: 0.00,
    tax: 0.00,
    total: 41500.00,
    shippingAddress: {
      fullName: "Lord Harrison Sterling",
      address: "450 Park Avenue, Suite 1800",
      city: "New York",
      country: "United States",
      postalCode: "10022",
      phone: "+1 (212) 555-0199"
    },
    courier: {
      name: "Brink's Global Luxury Logistics",
      trackingNumber: "BG-AWAITING-DISPATCH",
      serviceLevel: "Armed Diplomatic Courier",
      estimatedDelivery: "Oct 16, 2026",
      statusMessage: "Awaiting final settlement verification from Swiss Private Banking partner.",
      currentLocation: "Bank Lombard Odier / Rollex Treasury, Geneva",
      checkpoints: [
        { time: "Oct 09, 2026 - 08:30 AM", status: "Wire transfer initiated by client banker", location: "Geneva, Switzerland" }
      ]
    },
    timeline: [
      { stage: "Order Placed", title: "Order Placed", description: "Order logged; awaiting banking clearance", timestamp: "Oct 09, 2026 • 08:30 AM CET", completed: true, current: true },
      { stage: "Processing", title: "Atelier Assembly", description: "Allocation release and certification", timestamp: "Pending banking verification", completed: false },
      { stage: "Shipped", title: "Armored Transit", description: "Brink's Global Courier pickup", timestamp: "Pending", completed: false },
      { stage: "Delivered", title: "Client Delivery", description: "Private handover", timestamp: "Estimated Oct 16, 2026", completed: false }
    ],
    chronometerCertificate: "CH-COSC-519284",
    warrantyPeriod: "6-Year International Superlative Guarantee",
    notes: "Eligible for cancellation or banking revision prior to atelier release."
  },
  {
    id: "RLX-402918-GE",
    date: "2026-08-14",
    formattedDate: "Aug 14, 2026",
    status: "Cancelled",
    paymentStatus: "Refunded",
    paymentMethod: "Centurion Platinum Reserve",
    transactionRef: "TXN-REF-402918",
    items: [
      {
        id: 5,
        name: "Datejust 36 Oystersteel & White Gold",
        brand: "ROLLEX",
        collection: "Datejust",
        serialNumber: "SN-DJ-362019-CH",
        image: "/watch14.jpg",
        price: 9450.00,
        quantity: 2,
        dialColor: "Mint Green Fluted Motif",
        caseSize: "36mm",
        strap: "Jubilee Bracelet",
        calibre: "Calibre 3235"
      }
    ],
    totalQuantity: 2,
    subtotal: 18900.00,
    shippingCharge: 0.00,
    tax: 0.00,
    total: 18900.00,
    shippingAddress: {
      fullName: "Lord Harrison Sterling",
      address: "450 Park Avenue, Suite 1800",
      city: "New York",
      country: "United States",
      postalCode: "10022",
      phone: "+1 (212) 555-0199"
    },
    courier: {
      name: "Malca-Amit Armored Transit",
      trackingNumber: "MA-CANCELLED",
      serviceLevel: "N/A",
      estimatedDelivery: "Order Cancelled",
      statusMessage: "Consignment cancelled upon client request prior to courier dispatch.",
      currentLocation: "Geneva Vault (Returned to Reserve)",
      checkpoints: [
        { time: "Aug 14, 2026 - 11:00 AM", status: "Order placed by client", location: "Geneva, Switzerland" },
        { time: "Aug 15, 2026 - 09:15 AM", status: "Cancellation processed & full refund issued", location: "Geneva Treasury" }
      ]
    },
    timeline: [
      { stage: "Order Placed", title: "Order Placed", description: "Order logged", timestamp: "Aug 14, 2026 • 11:00 AM CET", completed: true },
      { stage: "Cancelled", title: "Order Cancelled & Refunded", description: "Client requested revision to 41mm diamond-set bezel configuration", timestamp: "Aug 15, 2026 • 09:15 AM CET", completed: true, current: true, isCancelled: true }
    ],
    cancellationReason: "Client requested change to 41mm Diamond-Set bezel variant.",
    cancelledAt: "Aug 15, 2026 • 09:15 AM CET",
    refundRef: "REF-CH-992014-AMX",
    chronometerCertificate: "CH-COSC-VOID-402918",
    notes: "100% refund of $18,900.00 credited to Centurion account. Allocation returned to Geneva vault."
  },
  {
    id: "RLX-391820-GE",
    date: "2026-07-22",
    formattedDate: "Jul 22, 2026",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Geneva Escrow Wire",
    transactionRef: "TXN-CH-391820",
    items: [
      {
        id: 6,
        name: "Yacht-Master 42 18ct White Gold",
        brand: "ROLLEX",
        collection: "Yacht-Master",
        serialNumber: "SN-YM-421903-CH",
        image: "/watch15.jpg",
        price: 30500.00,
        quantity: 1,
        dialColor: "Falcon's Eye Natural Stone",
        caseSize: "42mm",
        strap: "Oysterflex Elastomer",
        calibre: "Calibre 3235 High Precision"
      }
    ],
    totalQuantity: 1,
    subtotal: 30500.00,
    shippingCharge: 0.00,
    tax: 0.00,
    total: 30500.00,
    shippingAddress: {
      fullName: "Lord Harrison Sterling",
      address: "450 Park Avenue, Suite 1800",
      city: "New York",
      country: "United States",
      postalCode: "10022",
      phone: "+1 (212) 555-0199"
    },
    courier: {
      name: "Ferrari Group International",
      trackingNumber: "FG-EXP-992104-US",
      serviceLevel: "Armed Diplomatic Courier",
      estimatedDelivery: "Delivered Jul 27, 2026",
      statusMessage: "Delivered to Residence vault with signed receipt.",
      currentLocation: "New York, NY (Delivered)",
      checkpoints: [
        { time: "Jul 22, 2026 - 02:00 PM", status: "Order placed & certified", location: "Geneva" },
        { time: "Jul 27, 2026 - 11:30 AM", status: "Handed over to client", location: "New York, USA" }
      ]
    },
    timeline: [
      { stage: "Order Placed", title: "Order Placed", description: "Allocation reserved", timestamp: "Jul 22, 2026 • 02:00 PM CET", completed: true },
      { stage: "Processing", title: "Precision Certification", description: "COSC certified", timestamp: "Jul 23, 2026 • 10:00 AM CET", completed: true },
      { stage: "Shipped", title: "Armored Flight Dispatch", description: "Transited via Ferrari Group", timestamp: "Jul 25, 2026 • 06:00 PM CET", completed: true },
      { stage: "Delivered", title: "Delivered to Residence", description: "Client authenticated receipt", timestamp: "Jul 27, 2026 • 11:30 AM EST", completed: true, current: true }
    ],
    chronometerCertificate: "CH-COSC-391820",
    warrantyPeriod: "6-Year International Superlative Guarantee",
    notes: "Active registry warranty card issued."
  },
  {
    id: "RLX-284910-GE",
    date: "2026-06-15",
    formattedDate: "Jun 15, 2026",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Geneva Escrow Wire",
    transactionRef: "TXN-CH-284910",
    items: [
      {
        id: 7,
        name: "Explorer II 42mm Oystersteel",
        brand: "ROLLEX",
        collection: "Explorer",
        serialNumber: "SN-EXP-281920-CH",
        image: "/watch17.jpg",
        price: 9650.00,
        quantity: 1,
        dialColor: "Polar White",
        caseSize: "42mm",
        strap: "Oystersteel Bracelet",
        calibre: "Calibre 3285 Dual Time Zone"
      }
    ],
    totalQuantity: 1,
    subtotal: 9650.00,
    shippingCharge: 0.00,
    tax: 0.00,
    total: 9650.00,
    shippingAddress: {
      fullName: "Lord Harrison Sterling",
      address: "450 Park Avenue, Suite 1800",
      city: "New York",
      country: "United States",
      postalCode: "10022",
      phone: "+1 (212) 555-0199"
    },
    courier: {
      name: "Malca-Amit Armored Transit",
      trackingNumber: "MA-CH-284910-US",
      serviceLevel: "White-Glove Armed Security Escort",
      estimatedDelivery: "Delivered Jun 20, 2026",
      statusMessage: "Successfully delivered and registered.",
      currentLocation: "New York, NY (Delivered)",
      checkpoints: [
        { time: "Jun 15, 2026 - 10:00 AM", status: "Order placed", location: "Geneva" },
        { time: "Jun 20, 2026 - 03:15 PM", status: "Delivered to Lord Harrison Sterling", location: "New York, USA" }
      ]
    },
    timeline: [
      { stage: "Order Placed", title: "Order Placed", description: "Order confirmed", timestamp: "Jun 15, 2026 • 10:00 AM CET", completed: true },
      { stage: "Processing", title: "Atelier Calibration", description: "Passed superlative chronometer test", timestamp: "Jun 16, 2026 • 02:00 PM CET", completed: true },
      { stage: "Shipped", title: "Dispatched", description: "Air transit to USA", timestamp: "Jun 18, 2026 • 08:00 AM CET", completed: true },
      { stage: "Delivered", title: "Handover Complete", description: "Signed delivery", timestamp: "Jun 20, 2026 • 03:15 PM EST", completed: true, current: true }
    ],
    chronometerCertificate: "CH-COSC-284910",
    warrantyPeriod: "6-Year International Superlative Guarantee",
    notes: "Superlative Chronometer testing documented in certificate."
  },
  {
    id: "RLX-194820-GE",
    date: "2026-05-11",
    formattedDate: "May 11, 2026",
    status: "Cancelled",
    paymentStatus: "Refunded",
    paymentMethod: "Geneva Escrow Wire",
    transactionRef: "TXN-REF-194820",
    items: [
      {
        id: 8,
        name: "Sky-Dweller 42mm Oystersteel & White Gold",
        brand: "ROLLEX",
        collection: "Sky-Dweller",
        serialNumber: "SN-SD-194820-CH",
        image: "/watch19.jpg",
        price: 15900.00,
        quantity: 1,
        dialColor: "Bright Blue Sunray",
        caseSize: "42mm",
        strap: "Jubilee Bracelet",
        calibre: "Calibre 9002 Annual Calendar"
      }
    ],
    totalQuantity: 1,
    subtotal: 15900.00,
    shippingCharge: 0.00,
    tax: 0.00,
    total: 15900.00,
    shippingAddress: {
      fullName: "Lord Harrison Sterling",
      address: "450 Park Avenue, Suite 1800",
      city: "New York",
      country: "United States",
      postalCode: "10022",
      phone: "+1 (212) 555-0199"
    },
    courier: {
      name: "Ferrari Group International",
      trackingNumber: "FG-CANCELLED-1948",
      serviceLevel: "N/A",
      estimatedDelivery: "Order Cancelled",
      statusMessage: "Cancelled prior to dispatch. Refund returned to client account.",
      currentLocation: "Geneva Vault",
      checkpoints: [
        { time: "May 11, 2026 - 09:00 AM", status: "Order received", location: "Geneva" },
        { time: "May 12, 2026 - 11:30 AM", status: "Order cancelled per client instructions", location: "Geneva Treasury" }
      ]
    },
    timeline: [
      { stage: "Order Placed", title: "Order Placed", description: "Order logged", timestamp: "May 11, 2026 • 09:00 AM CET", completed: true },
      { stage: "Cancelled", title: "Order Cancelled", description: "Client requested address change to London residence; new allocation booked", timestamp: "May 12, 2026 • 11:30 AM CET", completed: true, current: true, isCancelled: true }
    ],
    cancellationReason: "Delivery coordinates updated to London Knightsbridge estate; replacement order scheduled.",
    cancelledAt: "May 12, 2026 • 11:30 AM CET",
    refundRef: "REF-CH-194820-WIRE",
    chronometerCertificate: "CH-COSC-VOID-194820",
    notes: "Funds returned in full via wire confirmation #REF-CH-194820-WIRE."
  }
];
