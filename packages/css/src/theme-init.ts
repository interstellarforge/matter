/**
 * Inline this in <head> before first paint (SSR or static HTML) so the stored
 * theme, colour mode and density are applied without a flash. Without stored
 * values the CSS falls back to the OS colour scheme.
 */
export const themeInitScript = `(function(){try{var e=document.documentElement,s=localStorage;['theme','color-mode','density'].forEach(function(k){var v=s.getItem('matter-'+k);if(v)e.setAttribute('data-'+k,v)})}catch(_){}})();`;
