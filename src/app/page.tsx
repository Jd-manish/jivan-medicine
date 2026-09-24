/**
 * Root page — static HTML with client-side locale redirect.
 *
 * The meta refresh sends everyone (including bots) to /en as the safe default.
 * The client script upgrades to the detected locale for human visitors with JS.
 */

import { supportedLocales } from "@/lib/i18n";

export default function RootPage() {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content="0;url=/en" />
        <link rel="canonical" href="/en" />
        {/* Client-side locale detection — upgrades from /en to the right locale */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var s = localStorage.getItem("jivan_locale");
                  var sup = ${JSON.stringify(supportedLocales)};
                  if (s && sup.indexOf(s) !== -1) { window.location.replace("/" + s); return; }
                  var langs = navigator.languages || [navigator.language || "en"];
                  for (var i = 0; i < langs.length; i++) {
                    var base = langs[i].split("-")[0].toLowerCase();
                    if (sup.indexOf(base) !== -1 && base !== "en") {
                      window.location.replace("/" + base);
                      return;
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <p>Redirecting to <a href="/en">Jivan</a>…</p>
      </body>
    </html>
  );
}
