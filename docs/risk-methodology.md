# Risk Lab methodology

The existing three-column archived mid-price dataset contains 50,754 observations across 160 instrument symbols from 1 January to 18 November 2025. The portfolio consists of hypothetical long USD exposures. The same archived CSV is used by the browser and [the reproducible notebook](varprices.ipynb).

1. Sort the prices for each instrument by date. For consecutive observations at dates a and b, compute the simple return as (mid[b] / mid[a]) - 1.
2. Match intervals by both dates across every included instrument. Discard intervals absent from any selected instrument. An interval may span more than one calendar day when quotes are missing or markets are closed.
3. Multiply each instrument's return by its USD exposure and add those amounts to obtain scenario portfolio P/L. Loss is negative P/L, so a negative loss represents a gain.
4. **Historical VaR** uses the linearly interpolated 95th percentile of losses. **Historical expected shortfall** weights each observation equally and averages the worst 5% of that mass, including fractional weight on the last observation when required.
5. **Parametric VaR and expected shortfall** assume normally distributed P/L with mean zero and sample standard deviation s. VaR is 1.644854 × s. Expected shortfall is φ(1.644854) / 0.05 × s, approximately 2.062713 × s.
6. **VaR as a percentage of NAV** divides VaR by total included notional and multiplies by 100.

The notebook also preserves the legacy per-instrument diagnostics: the 5th and 95th return percentiles, the absolute-return 95th percentile, and the normal-approximation interval for the sample mean, mean ± 1.96 × s / √n.

Positions remain fixed across the scenarios. This simple model uses mid-price changes and excludes spreads, fees, FX conversion of actual holdings, derivatives repricing, and live quotes.

References: [BIS market risk terminology](https://www.bis.org/committees/bcbs/basel-framework/standard/mar/10/inforce/2023-01-01/published/2020-03-27) and [NumPy linear quantile convention](https://numpy.org/doc/stable/reference/generated/numpy.quantile.html).
