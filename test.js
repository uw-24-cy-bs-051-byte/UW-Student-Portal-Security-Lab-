// BAD: This should be flagged by Semgrep
document.write("<h1>Hello World</h1>");

// SAFE: This should NOT be flagged
const div = document.createElement("div");
div.textContent = "Hello World";