const toggleFormLink = document.getElementById("toggleForm");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const registerFields = document.getElementById("registerFields");
const submitBtn = document.getElementById("submitBtn");
const messageEl = document.getElementById("message");
let isLogin = true;

toggleFormLink.addEventListener("click", (e) => {
  e.preventDefault();
  isLogin = !isLogin;

  if (isLogin) {
    formTitle.textContent = "Login";
    formSubtitle.textContent = "Welcome back! Please sign in.";
    registerFields.style.display = "none";
    submitBtn.textContent = "Login";
    toggleFormLink.textContent = "Register here";
  } else {
    formTitle.textContent = "Register";
    formSubtitle.textContent = "Create an account to get started.";
    registerFields.style.display = "block";
    submitBtn.textContent = "Register";
    toggleFormLink.textContent = "Login here";
  }

  messageEl.textContent = "";
});

document.getElementById("authForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    ?.value.trim();

  messageEl.style.color = "black";
  messageEl.textContent = isLogin ? "Logging in..." : "Registering...";

  try {
    const endpoint = isLogin ? "/login" : "/register";
    const payload = { identifier, password };

    if (!isLogin) payload.confirmPassword = confirmPassword;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      messageEl.style.color = "green";
      messageEl.textContent = isLogin
        ? "Login successful!"
        : "Registration successful!";
      setTimeout(() => (window.location.href = "/menu"), 1000);
    } else {
      messageEl.style.color = "red";
      messageEl.textContent = data.error || "Something went wrong.";
    }
  } catch (err) {
    messageEl.style.color = "red";
    messageEl.textContent = "Server connection error.";
  }
});
