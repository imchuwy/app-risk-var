# OC AI Risk Lab

An interactive portfolio demo for one-day value at risk (VaR) at 95% confidence. Compare parametric and historical estimates, change the sample portfolio, and read an explanation of the results in the browser.

The USD positions and returns are simulated. No live market feed, API key, or server is needed for the exported app.

## Run locally

- Install the locked dependencies with npm ci.
- Run npm run dev and open the address printed in the terminal.
- Run npm run build to export a static site to out/. Set NEXT_PUBLIC_BASE_PATH to /app-var when building for the GitHub Pages project URL.

The OC AI design kit supplies the visual tokens, wordmarks and fonts. Font licenses are under public/oc/assets/fonts/licenses.
