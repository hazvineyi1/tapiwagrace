const fs = require('fs');
let code = fs.readFileSync('artifacts/thirty-one-rooted/src/App.tsx', 'utf8');

// 1. Imports
code = code.replace(
  /import reframingWorkbook from '@assets\/Cognitive_Reframing\._A_short_workbook_[0-9]+\.pdf';\nimport breakthroughWorkbook from '@assets\/Breakthrough-_Workbook_[0-9]+\.pdf';\nimport callingGuide from '@assets\/Calling_[0-9]+\.pdf';/,
  "import { SocraticCompanion } from '@/components/SocraticCompanion';"
);

// 2. Remove unused arrays
code = code.replace(/const tools = \[[^\]]+\];\n/, '');
code = code.replace(/const reflectionQuestions = \[[^\]]+\];\n/, '');

// 3. Navigation WhatsApp link
code = code.replace(
  /<li><button onClick=\{\(\) => scrollTo\('meal'\)\}>Meal Packaging<\/button><\/li>/,
  `<li><button onClick={() => scrollTo('meal')}>Meal Packaging</button></li>\n              <li><a href="https://wa.me/?text=I'd%20like%20to%20enquire%20about%20a%20retreat,%20guided%20tools,%20or%20meal%20packaging." target="_blank" rel="noreferrer">Contact</a></li>`
);

// 4. Replace Tools & Reflection sections with SocraticCompanion
const toolsRegex = /<section id="tools" className="section bg-paper">[\s\S]*?(?=<section id="meal")/m;
const newToolsSection = `<section id="tools" className="section bg-paper">
        <div className="section-heading">
          <span className="eyebrow">Tools & Frameworks</span>
          <h2>A quiet place to notice and name.</h2>
        </div>
        <SocraticCompanion openBooking={openBooking} />
      </section>
      `;
code = code.replace(toolsRegex, newToolsSection);

// 5. Update BookingModal Pricing
code = code.replace(/<option value="Retreat">Retreat · \$295<\/option>/, `<option value="Retreat">Retreat · Pricing varies</option>`);
code = code.replace(
  /<strong>\{kind === 'Retreat' \? '\$295' : kind === 'Conversation' \? '\$95' : 'Bespoke quote'\}<\/strong>/,
  `<strong>{kind === 'Retreat' ? 'Pricing varies' : kind === 'Conversation' ? '$95' : 'Bespoke quote'}</strong>`
);

code = code.replace(
  /<span>\{kind === 'Meal Packaging' \? 'A considered scope shaped around your message, audience, channels, and pace\.' : 'Includes a confirmation, preparation guide, and a space held with care\.'\}<\/span>/,
  `<span>{kind === 'Meal Packaging' ? 'A considered scope shaped around your message, audience, channels, and pace.' : kind === 'Retreat' ? 'Details shared after enquiry. Includes a confirmation and preparation guide.' : 'Includes a confirmation, preparation guide, and a space held with care.'}</span>`
);

// Footer Contact Link
code = code.replace(
  /<li><a href="https:\/\/www\.tiktok\.com\/@31androoted".*?>TikTok<\/a><\/li>/,
  `<li><a href="https://www.tiktok.com/@31androoted" target="_blank" rel="noreferrer" data-testid="link-footer-tiktok">TikTok</a></li>
                <li><a href="https://wa.me/?text=I'd%20like%20to%20enquire%20about%20a%20retreat,%20guided%20tools,%20or%20meal%20packaging." target="_blank" rel="noreferrer" data-testid="link-footer-contact">Contact on WhatsApp</a></li>`
);

fs.writeFileSync('artifacts/thirty-one-rooted/src/App.tsx', code);
