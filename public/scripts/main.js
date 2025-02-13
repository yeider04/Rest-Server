// Manejo de la respuesta de Google Sign-In
function handleCredentialResponse(response) {
  const body = { id_token: response.credential };

  fetch("http://localhost:8080/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
      localStorage.setItem("email", resp.usuario.correo);
    })
    .catch(console.warn);
}

// Cerrar sesión
const button = document.getElementById("google_signout");
button.onclick = () => {
  const email = localStorage.getItem("email");

  if (email) {
    google.accounts.id.revoke(email, (done) => {
      console.log("Permisos revocados para:", email);
      localStorage.clear();
      alert("Has cerrado sesión.");
      location.reload();
    });
  } else {
    console.warn("No se encontró el email en localStorage.");
    alert("No hay sesión activa.");
  }
};
