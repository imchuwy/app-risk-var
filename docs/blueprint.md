# Risk Lab

Risk Lab estimates how much a hypothetical USD portfolio could lose over one matched price interval at 95% confidence. A visitor can change instrument exposures, switch between historical and parametric estimates, and expand the results to inspect the calculation.

## Data and calculation

1. The browser loads the [archived instrument mid-prices](../public/prices/instrument_data.csv). The [data loader](../src/lib/financial-data.ts) reads the bundled snapshot.
2. The [portfolio calculator](../src/lib/var-calculator.ts) aligns return intervals across the selected instruments and calculates portfolio P/L, value at risk and expected shortfall.
3. The dashboard shows the estimates in USD, VaR as a percentage of portfolio value, the number of matched observations, and the calculation workings. The normal-model reference chart helps explain the parametric estimate.

The [methodology](risk-methodology.md) defines both estimators. The [Python notebook](varprices.ipynb) reproduces the sample results independently, and the [regression tests](../tests/var-calculator.test.mjs) check the app against them.

## Running the demo

GitHub Pages serves the static Next.js export. Local run instructions and screenshots are in the [README](../README.md). Header artwork, theme behavior and font attribution are in the [appearance guide](appearance.md).
