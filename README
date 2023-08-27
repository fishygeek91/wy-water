# wy-water

The `wy-water` package provides functionality to fetch and process water data, specifically river flow data from the USGS API for sites in Wyoming. This package helps developers extract river metrics like current temperature, flow, gage height, and dissolved oxygen values. It also offers functionality to fetch daily river metrics and instantaneous river metrics.

## Main Features:

1. **Fetch Data**: Retrieve data from specific endpoints using the base USGS API.
2. **Extract Current Metrics**: Obtain current metrics for various river sites in Wyoming.
3. **Daily River Metrics**: Retrieve and process metrics taken daily.
4. **Instantaneous River Metrics**: Retrieve and process metrics taken instantaneously.

## Usage:

#### Importing the module:

```javascript
import {
  getRiverFlowData,
  getWyomingSites,
  getDailyRiverMetrics,
  getInstantaneousRiverMetrics,
} from "wy-water";
```

Fetching current metrics for Wyoming sites:

```javascript
const wyomingSitesData = await getWyomingSites();
```

Fetching daily river metrics:

```javascript
const dailyMetrics = await getDailyRiverMetrics(siteCode, period);
```

Fetching instantaneous river metrics:

```javascript
const instantaneousMetrics = await getInstantaneousRiverMetrics(siteCode, period);
```

## Data Types:

- Value: Represents a basic metric containing value, unit, and the time when it was recorded.
- MaxMinMean: Represents maximum, minimum, and mean values of a particular metric.
- CurrentValue: Represents current values for temperature, flow, gage height, and dissolved oxygen for a site.
- DailyValue: Represents daily metrics for streamflow, gage height, temperature, and dissolved oxygen.
- InstantaneousValue: Represents instantaneous metrics for streamflow, gage height, temperature, and dissolved oxygen.

Please refer to types.ts for detailed type definitions and structure.

Contributing:
If you wish to contribute to the wy-water package, please submit a pull request or open an issue for discussion.
