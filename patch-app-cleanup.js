const fs = require('fs');
let code = fs.readFileSync('artifacts/thirty-one-rooted/src/App.tsx', 'utf8');

// The reflection array might span multiple lines
code = code.replace(/const reflectionQuestions = \[[\s\S]*?\];\n\n/g, '');

// Clean up state
code = code.replace(/  const \[reflectionStep, setReflectionStep\] = useState\(0\);\n/, '');
code = code.replace(/  const \[reflectionChoice, setReflectionChoice\] = useState\(''\);\n/, '');

// Clean up unused functions
const chooseReflectionRegex = /  const chooseReflection = \([\s\S]*?};\n\n/g;
code = code.replace(chooseReflectionRegex, '');
const nextReflectionRegex = /  const nextReflection = \([\s\S]*?};\n\n/g;
code = code.replace(nextReflectionRegex, '');

// The reflection section is still in the code because my regex missed it or didn't replace it correctly, 
// let's just find the section manually.
code = code.replace(/<section className="section section-dark" id="reflection">[\s\S]*?<\/section>/g, '');

// Fix nav links
code = code.replace(/<button className="nav-link" onClick=\{\(\) => scrollTo\('reflection'\)\}.*?>Reflection<\/button>/, '');
code = code.replace(/<li><button onClick=\{\(\) => scrollTo\('reflection'\)\}>Reflection<\/button><\/li>/, '');

// Replace hero button 
code = code.replace(
  /<button className="button-quiet" onClick=\{\(\) => scrollTo\('reflection'\)\} data-testid="button-hero-reflection">Begin a reflection<\/button>/, 
  `<button className="button-quiet" onClick={() => scrollTo('tools')} data-testid="button-hero-reflection">Begin a reflection</button>`
);

fs.writeFileSync('artifacts/thirty-one-rooted/src/App.tsx', code);
