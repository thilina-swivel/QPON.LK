// Script to check WCAG contrast ratios for the Home page

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

function checkWCAG(ratio, fontSize, fontWeight) {
  const isLargeText = (fontSize >= 18 && fontWeight >= 700) || fontSize >= 24;
  const aaThreshold = isLargeText ? 3.0 : 4.5;
  const aaaThreshold = isLargeText ? 4.5 : 7.0;

  if (ratio >= aaaThreshold) return "AAA ✓";
  if (ratio >= aaThreshold) return "AA ✓";
  return "FAIL ✗";
}

// Color definitions from theme.ts
const colors = {
  orange: "#FF5A00",
  deepNavy: "#021030",
  white: "#FFFFFF",
  gray100: "#F5F5F7",
  gray200: "#E5E5EA",
  gray300: "#D1D1D6",
  gray400: "#AEAEB2",
  gray500: "#8E8E93",
  gray600: "#636366",
  gray700: "#48484A",
  green: "#A6FE5A",
  background: "#F5F5F8",
  alertBg: "#FFB800",
  black: "#000000",
};

// Text/Background combinations from Home page
const combinations = [
  {
    element: 'Welcome text ("Good morning")',
    text: colors.gray600,
    bg: colors.background,
    size: 15,
    weight: 400,
  },
  {
    element: "User name",
    text: colors.deepNavy,
    bg: colors.background,
    size: 24,
    weight: 700,
  },
  {
    element: "Guest banner text",
    text: colors.orange,
    bg: colors.background,
    size: 14,
    weight: 500,
  },
  {
    element: "Section title (h2)",
    text: colors.deepNavy,
    bg: colors.background,
    size: 20,
    weight: 700,
  },
  {
    element: '"View all" link',
    text: colors.orange,
    bg: colors.background,
    size: 14,
    weight: 600,
  },
  {
    element: "Category chip text (inactive)",
    text: colors.gray700,
    bg: colors.white,
    size: 14,
    weight: 500,
  },
  {
    element: "Category chip text (active)",
    text: colors.white,
    bg: colors.deepNavy,
    size: 14,
    weight: 500,
  },
  {
    element: "Savings label",
    text: colors.gray400,
    bg: colors.deepNavy,
    size: 11,
    weight: 500,
  },
  {
    element: "Savings amount",
    text: colors.white,
    bg: colors.deepNavy,
    size: 28,
    weight: 700,
  },
  {
    element: "Savings total",
    text: colors.orange,
    bg: colors.deepNavy,
    size: 28,
    weight: 700,
  },
  {
    element: "Alert title",
    text: colors.deepNavy,
    bg: colors.alertBg,
    size: 15,
    weight: 700,
  },
  {
    element: "Alert subtitle",
    text: colors.deepNavy,
    bg: colors.alertBg,
    size: 13,
    weight: 400,
  },
  {
    element: "Sponsored badge text",
    text: colors.white,
    bg: colors.orange,
    size: 11,
    weight: 700,
  },
  {
    element: "Spotlight title",
    text: colors.white,
    bg: colors.black,
    size: 22,
    weight: 700,
  },
  {
    element: "Spotlight subtitle",
    text: colors.gray300,
    bg: colors.black,
    size: 14,
    weight: 400,
  },
  {
    element: "Deal name",
    text: colors.deepNavy,
    bg: colors.white,
    size: 18,
    weight: 700,
  },
  {
    element: "Deal location",
    text: colors.gray500,
    bg: colors.white,
    size: 13,
    weight: 400,
  },
  {
    element: "Deal price",
    text: colors.orange,
    bg: colors.white,
    size: 20,
    weight: 700,
  },
  {
    element: "Deal original price",
    text: colors.gray400,
    bg: colors.white,
    size: 14,
    weight: 400,
  },
  {
    element: "Coupons text",
    text: colors.orange,
    bg: colors.white,
    size: 12,
    weight: 500,
  },
  {
    element: "Discount badge text",
    text: colors.white,
    bg: colors.orange,
    size: 12,
    weight: 700,
  },
  {
    element: "Expiring deal time",
    text: colors.orange,
    bg: colors.white,
    size: 12,
    weight: 500,
  },
  {
    element: "Expiring discount badge",
    text: colors.deepNavy,
    bg: colors.green,
    size: 11,
    weight: 700,
  },
  {
    element: "Recommended name",
    text: colors.deepNavy,
    bg: colors.white,
    size: 15,
    weight: 700,
  },
  {
    element: "Recommended price",
    text: colors.orange,
    bg: colors.white,
    size: 15,
    weight: 700,
  },
];

// Generate results
console.log(
  "\n╔═══════════════════════════════════════════════════════════════════════════════════════════════════════╗",
);
console.log(
  "║                           QPON HOME PAGE - TEXT CONTRAST ACCESSIBILITY REPORT                        ║",
);
console.log(
  "╚═══════════════════════════════════════════════════════════════════════════════════════════════════════╝\n",
);

console.log(
  "┌─────────────────────────────────────┬──────────┬──────────┬──────────────┬──────────┬──────────────┐",
);
console.log(
  "│ Element                             │ Size     │ Weight   │ Text Color   │ Contrast │ WCAG Status  │",
);
console.log(
  "├─────────────────────────────────────┼──────────┼──────────┼──────────────┼──────────┼──────────────┤",
);

combinations.forEach((item) => {
  const ratio = getContrastRatio(item.text, item.bg);
  const status = checkWCAG(ratio, item.size, item.weight);

  const element = item.element.padEnd(35);
  const size = `${item.size}px`.padEnd(8);
  const weight = item.weight.toString().padEnd(8);
  const textColor = item.text.padEnd(12);
  const contrast = `${ratio}:1`.padEnd(8);
  const wcagStatus = status.padEnd(12);

  console.log(
    `│ ${element} │ ${size} │ ${weight} │ ${textColor} │ ${contrast} │ ${wcagStatus} │`,
  );
});

console.log(
  "└─────────────────────────────────────┴──────────┴──────────┴──────────────┴──────────┴──────────────┘",
);

console.log("\n📊 SUMMARY:");
const results = combinations.map((item) => {
  const ratio = getContrastRatio(item.text, item.bg);
  return checkWCAG(ratio, item.size, item.weight);
});

const aaaPass = results.filter((r) => r.includes("AAA")).length;
const aaPass = results.filter(
  (r) => r.includes("AA") && !r.includes("AAA"),
).length;
const fail = results.filter((r) => r.includes("FAIL")).length;

console.log(`   AAA Compliance: ${aaaPass}/${combinations.length} elements`);
console.log(`   AA Compliance:  ${aaPass}/${combinations.length} elements`);
console.log(`   Failed:         ${fail}/${combinations.length} elements\n`);

if (fail > 0) {
  console.log("⚠️  ISSUES FOUND:");
  combinations.forEach((item) => {
    const ratio = getContrastRatio(item.text, item.bg);
    const status = checkWCAG(ratio, item.size, item.weight);
    if (status.includes("FAIL")) {
      console.log(
        `   • ${item.element}: ${ratio}:1 (requires ${item.size >= 18 ? "3.0" : "4.5"}:1 minimum)`,
      );
    }
  });
  console.log("");
}

console.log("📋 WCAG Standards:");
console.log("   • Normal text (< 18px): 4.5:1 (AA), 7.0:1 (AAA)");
console.log(
  "   • Large text (≥ 18px bold or ≥ 24px): 3.0:1 (AA), 4.5:1 (AAA)\n",
);
