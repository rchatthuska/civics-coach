/* ================= local profiles (username + passcode) =================
   These profiles live only in this browser's localStorage — there is no
   server. Passcodes are hashed (SHA-256 when available) so they aren't
   stored as plain text, but this is not real account security: anyone with
   access to this browser's storage can still see/edit the data. */
export async function hashPass(text) {
  try {
    if (window.crypto && window.crypto.subtle) {
      const enc = new TextEncoder().encode(text);
      const buf = await window.crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
  } catch (e) {}
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return "fb" + (h >>> 0).toString(16);
}

export function loadUsers() {
  try {
    const raw = localStorage.getItem("civics-users");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem("civics-users", JSON.stringify(users));
  } catch (e) {}
}
