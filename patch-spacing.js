const fs = require('fs');
let css = fs.readFileSync('artifacts/thirty-one-rooted/src/index.css', 'utf8');

// Increase section padding
css = css.replace(/\.section \{ padding: clamp\(84px, 12vw, 150px\) clamp\(24px, 7vw, 110px\); \}/, ".section { padding: clamp(100px, 15vw, 180px) clamp(30px, 8vw, 140px); }");

// Remove heavy borders and boxes
css = css.replace(/border-color: var\(--line-soft\)/g, "border-color: rgba(0,0,0,0.06)");

fs.writeFileSync('artifacts/thirty-one-rooted/src/index.css', css);
