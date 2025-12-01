// Ensure only admins can access this page
const user = JSON.parse(localStorage.getItem("user"));

// if (!user || user.role !== "admin") {
//   window.location.href = "/menu"; // not admin → kick out
// }

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
});
