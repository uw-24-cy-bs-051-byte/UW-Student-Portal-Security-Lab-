// UW Student Portal - deliberately vulnerable training app. All data is fake.
const API_KEY = "sk-live-uwportal-FAKE-4f9a8c71";
const ADMIN_PASSWORD = "Admin@123";

const USERS = [
  { id: 1001, name: "Ayesha Khan",    email: "ayesha@uw.test", password: "ayesha123", role: "student", cnic: "35202-1234567-1" },
  { id: 1002, name: "Bilal Ahmed",    email: "bilal@uw.test",  password: "bilal123",  role: "student", cnic: "35202-7654321-9" },
  { id: 2001, name: "Dr. Sana Malik", email: "sana@uw.test",   password: "teacher123", role: "teacher", cnic: "35202-1111111-2" },
  { id: 9001, name: "Admin",          email: "admin@uw.test",  password: ADMIN_PASSWORD, role: "admin", cnic: "35202-9999999-3" }
];
const RESULTS = {
  1001: { course: "CYS-331L", marks: 88 },
  1002: { course: "CYS-331L", marks: 54 },
  2001: { course: "n/a", marks: 0 }
};
const COURSES = ["CYS-331L Secure Software Design", "CS-101 Programming", "MT-210 Discrete Maths"];

const params = new URLSearchParams(location.search);
const $ = (id) => document.getElementById(id);

function getSession() {
  const s = localStorage.getItem("session");
  return s ? JSON.parse(s) : null;
}

$("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = $("email").value;
  const pw = $("password").value;
  const u = USERS.find((x) => x.email === email && x.password === pw);
  if (!u) {
    $("loginMsg").innerHTML = "Login failed for " + email;
    return;
  }
  localStorage.setItem("session", JSON.stringify({ id: u.id, name: u.name, role: u.role, cnic: u.cnic }));
  const next = params.get("next");
  if (next) { location.href = next; return; }
  render();
});

$("resultForm").addEventListener("submit", (e) => { e.preventDefault(); showResult($("rid").value); });

function showResult(id) {
  const r = RESULTS[id];
  const u = USERS.find((x) => String(x.id) === String(id));
  $("resultOut").textContent = r ? u.name + ": " + r.course + " = " + r.marks : "No result found.";
}

$("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = $("q").value;
  const hits = COURSES.filter((c) => c.toLowerCase().includes(q.toLowerCase()));
  $("searchOut").innerHTML = hits.length ? hits.join("<br>") : "No courses match: " + q;
});

$("logout").addEventListener("click", () => { localStorage.removeItem("session"); render(); });

function render() {
  const s = getSession();
  $("loginBox").classList.toggle("hidden", !!s);
  $("dash").classList.toggle("hidden", !s);
  if (!s) return;
  $("welcome").innerHTML = "Welcome, " + (params.get("name") || s.name);
  if (params.get("id")) showResult(params.get("id"));
  if (s.role === "admin") {
    $("admin").classList.remove("hidden");
    $("userList").innerHTML = USERS.map((u) => "<li>" + u.name + " (" + u.role + ") CNIC " + u.cnic + "</li>").join("");
  }
}
render();
