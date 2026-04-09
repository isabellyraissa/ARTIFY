const REMEMBER_LOGIN_KEY = "artify.remember_login";
const EPHEMERAL_SESSION_KEY = "artify.ephemeral_session";

const canUseWebStorage = () => typeof window !== "undefined";

export const getRememberLoginPreference = () => {
  if (!canUseWebStorage()) return false;
  return window.localStorage.getItem(REMEMBER_LOGIN_KEY) === "true";
};

export const setRememberLoginPreference = (remember: boolean) => {
  if (!canUseWebStorage()) return;

  window.localStorage.setItem(REMEMBER_LOGIN_KEY, remember ? "true" : "false");

  if (remember) {
    window.sessionStorage.removeItem(EPHEMERAL_SESSION_KEY);
  } else {
    // Keep session only for the current tab lifecycle.
    window.sessionStorage.setItem(EPHEMERAL_SESSION_KEY, "active");
  }
};

export const clearEphemeralSessionMarker = () => {
  if (!canUseWebStorage()) return;
  window.sessionStorage.removeItem(EPHEMERAL_SESSION_KEY);
};

export const shouldInvalidateStoredSessionOnEntry = () => {
  if (!canUseWebStorage()) return false;
  const remember = getRememberLoginPreference();
  const hasEphemeralMarker = window.sessionStorage.getItem(EPHEMERAL_SESSION_KEY) === "active";
  return !remember && !hasEphemeralMarker;
};
