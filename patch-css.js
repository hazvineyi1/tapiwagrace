const fs = require('fs');
let css = fs.readFileSync('artifacts/thirty-one-rooted/src/index.css', 'utf8');

// Replace monospace references and fonts
css = css.replace(/@import url\('[^']+'\);/, "@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');");
css = css.replace(/--app-font-sans:.*/g, "--app-font-sans: 'DM Sans', sans-serif;");
css = css.replace(/--app-font-serif:.*/g, "--app-font-serif: 'Playfair Display', serif;");
css = css.replace(/--app-font-mono:.*/g, ""); // removed
css = css.replace(/var\(--app-font-mono\)/g, "var(--app-font-sans)");

// Colors
css = css.replace(/--background: [^;]+;/, "--background: 40 30% 98%;");
css = css.replace(/--foreground: [^;]+;/, "--foreground: 24 15% 20%;");
css = css.replace(/--paper: [^;]+;/, "--paper: 40 30% 98%;");
css = css.replace(/--sand: [^;]+;/, "--sand: 40 15% 94%;");
css = css.replace(/--ink: [^;]+;/, "--ink: 24 15% 20%;");
css = css.replace(/--terracotta: [^;]+;/, "--terracotta: 18 35% 45%;");
css = css.replace(/--olive: [^;]+;/, "--olive: 90 10% 45%;");
css = css.replace(/--gold: [^;]+;/, "--gold: 35 25% 65%;");
css = css.replace(/--line-soft: [^;]+;/, "--line-soft: 35 15% 90%;");
css = css.replace(/--line-strong: [^;]+;/, "--line-strong: 35 15% 82%;");

// Typography
css = css.replace(/font-family: var\(--app-font-serif\);/g, "font-family: var(--app-font-serif);");
css = css.replace(/font-weight: 500/g, "font-weight: 400"); // Make headings lighter
css = css.replace(/font-weight: 600/g, "font-weight: 500");

// Buttons and borders
css = css.replace(/border: 1px solid var\(--ink\);/g, "border: 1px solid rgba(0,0,0,0.1);");
css = css.replace(/box-shadow: [^;]+;/, "box-shadow: none;"); // generic remove
css = css.replace(/box-shadow: 4px 4px 0 var\(--gold\);/g, "");
css = css.replace(/box-shadow: 9px 9px 0 rgba\(205,162,74,\.6\);/g, "box-shadow: 0 20px 40px rgba(0,0,0,0.05);");

fs.writeFileSync('artifacts/thirty-one-rooted/src/index.css', css);
