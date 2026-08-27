const fs = require('fs');
let code = fs.readFileSync('artifacts/thirty-one-rooted/src/App.tsx', 'utf8');

const regex = /<section className="section tool-zone" id="tools">[\s\S]*?<\/section>/;
const newSection = `<section id="tools" className="section tool-zone bg-paper">
          <div className="section-heading">
            <span className="eyebrow">Practical tools for the becoming</span>
            <h2>Not just inspiration.<br /><em>Something to do</em> with what you know.</h2>
            <p>Use the framework. Write the sentence. Ask the better question. These resources are built to meet you on an ordinary day and help you practice a truer one.</p>
          </div>
          <SocraticCompanion openBooking={openBooking} />
        </section>`;
code = code.replace(regex, newSection);

fs.writeFileSync('artifacts/thirty-one-rooted/src/App.tsx', code);
