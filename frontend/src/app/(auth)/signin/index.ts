// googleAuth.js
// Make sure to install dotenv if you want to use environment variables in Node or React app
// npm install dotenv

const clientId = "251677181428-vrbun1s24o4ag8tbnumn7qk7h187s1es.apps.googleusercontent.com"; // or CLIENT_ID in Node env

export function oauthSignIn() {
  const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  const form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", oauth2Endpoint);

  // OAuth parameters
  const params = {
    client_id: clientId,
    redirect_uri: "http://localhost:5173/google-redirect", // your redirect URI
    response_type: "token",
    scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    include_granted_scopes: "true",
    state: "pass-through-value",
  };

  for (const [key, value] of Object.entries(params)) {
    const input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", key);
    input.setAttribute("value", value);
    form.appendChild(input);
  }

  // Submit the form
  document.body.appendChild(form);
  form.submit();
}