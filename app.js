// UW Student Portal - deliberately vulnerable training app. All data is fake.


const USERS = [
 { id: 1001, name: "Ayesha Khan", email: "ayesha@uw.test", role: "student",
    cnic: "35202-1234567-1",
    passwordHash: "9ea63eb7fdcb281ffed4da81a25c1a641f821f7e015022701e395341910a8912" },
  { id: 1002, name: "Bilal Ahmed", email: "bilal@uw.test", role: "student",
    cnic: "35202-7654321-9",
    passwordHash: "7c673993ca018e2a046740cdd016efcead0c7a876789d83b9928d5edc25f2524" },
  { id: 2001, name: "Dr. Sana Malik", email: "sana@uw.test", role: "teacher",
    cnic: "35202-1111111-2",
    passwordHash: "56a77e2a154357e5d61321b09dbc81d6fc849ed517c62d5937a0ecf979b7751e" },
  { id: 9001, name: "Admin", email: "admin@uw.test", role: "admin",
    cnic: "35202-9999999-3",
    passwordHash: "a43bf44793780c7c6486b66987eb92c8392fb2ae33f01f3378ed3938e893345e" }
];
const RESULTS = {
  1001: { course: "CYS-331L", marks: 88 },
  1002: { course: "CYS-331L", marks: 54 },
  2001: { course: "n/a", marks: 0 }
};
const COURSES = ["CYS-331L Secure Software Design", "CS-101 Programming", "MT-210 Discrete Maths"];

const params = new URLSearchParams(location.search);
const $ = (id) => document.getElementById(id);
async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function getSession() {
  const id = sessionStorage.getItem("uid");
  return USERS.find((x) => String(x.id) === id) || null;
}

$("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("email").value;
  const pw = $("password").value;
  const u = USERS.find((x) => x.email === email);
  
  if (!u || (await sha256("uw" + u.id + pw)) !== u.passwordHash) {
    $("loginMsg").textContent = "Login failed for " + email;
    return;
  }
  
  sessionStorage.setItem("uid", String(u.id));
  
  // --- ASSIGNMENT A2 FIX ---
  const next = params.get("next");
  const allowedPaths = ["/", "/index.html", "/UW-Student-Portal-Security-Lab-/"]; 
  
  if (next && allowedPaths.some(path => next.startsWith(path))) { 
    location.assign(next); 
    return; 
  }
  // -------------------------

  render();
});

$("resultForm").addEventListener("submit", (e) => { e.preventDefault(); showResult($("rid").value); });

function showResult(id) {
  const s = getSession();
  if (!s) return;
  
  // THE FIX: If the requested ID does not match the logged-in user's ID, deny access.
  // (Admins and teachers are allowed to view any result).
  if (String(id) !== String(s.id) && s.role === "student") {
    $("resultOut").textContent = "Access denied: you can only view your own result.";
    return;
  }
  
  const r = RESULTS[id];
  const u = USERS.find((x) => String(x.id) === String(id));
  $("resultOut").textContent = r ? u.name + " " + r.course + " " + r.marks : "No result found.";
}

$("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = $("q").value;
  const hits = COURSES.filter((c) => c.toLowerCase().includes(q.toLowerCase()));
  const out = $("searchOut");
  out.textContent = ""; // Clear previous results safely
  
  if (!hits.length) { 
    out.textContent = "No courses match: " + q; 
    return; 
  }
  
  hits.forEach((c) => {
    const div = document.createElement("div");
    div.textContent = c; // Use textContent to prevent XSS
    out.appendChild(div);
  });
});

$("logout").addEventListener("click", () => { sessionStorage.removeItem("uid"); render(); });

function render() {
  const s = getSession();
  $("loginBox").classList.toggle("hidden", !!s);
  $("dash").classList.toggle("hidden", !s);
  if (!s) return;
  
  $("welcome").textContent = "Welcome, " + s.name; 
  
  if (params.get("id")) showResult(params.get("id"));
  
  $("admin").classList.toggle("hidden", s.role === "admin");
  if (s.role === "admin") {
    const list = $("userList");
    list.textContent = "";
    USERS.forEach((u) => {
      const li = document.createElement("li");
      li.textContent = u.name + " " + u.role + " CNIC " + u.cnic.slice(0, 5) + "-******-*";
      list.appendChild(li);
    });
  }
}

render();
