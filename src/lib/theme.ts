export const THEME_KEY = "booknook-theme";
export const LIGHT_THEME = "booknook";
export const DARK_THEME = "booknook-dark";

export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="${LIGHT_THEME}"&&t!=="${DARK_THEME}"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"${DARK_THEME}":"${LIGHT_THEME}"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;
