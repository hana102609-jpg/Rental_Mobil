document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  // contoh validasi sederhana
  const userValid = "admin";
  const passValid = "12345";

  if (username === userValid && password === passValid) {
    // login berhasil, pindah halaman
    window.location.href = "index.html";
  } else {
    errorMsg.textContent = "Username atau password salah!";
  }
});