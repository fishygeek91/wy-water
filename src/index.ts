import { Value, DateValueMap, DailyValue, DailyValuesMap, CurrentValue, CurrentValuesMap, InstantaneousMetrics, InstantaneousValueMap, InstantaneousValuesMap } from "./types";
const USGS_API_BASE = "https://waterservices.usgs.gov/nwis/";

/**
 * Fetch river flow data from a specific endpoint using fetch
 *
 * @param {string} endpoint - The specific endpoint after the base URL.
 * @returns {Promise} - A promise resolving with the fetched data or rejecting with an error.
 */

async function getWyomingSites() {
  const response = await fetch(`${USGS_API_BASE}iv/?stateCd=WY&format=json`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const responseJson = await response.json();

  const sitesData: CurrentValuesMap = {};

  responseJson.value.timeSeries.forEach((element: any) => {

    const siteName = element.sourceInfo.siteName;
    const siteCode = element.sourceInfo.siteCode[0].value;
    const variableName = element.variable.variableName;
    const unit = element.variable.unit.unitCode;
    const value = element.values[0].value[0].value;
    const timeRecorded = element.values[0].value[0].dateTime;

    if (!sitesData[siteCode]) {
      sitesData[siteCode] = {
        siteName,
        siteCode,
        currentTemp: null,
        currentFlow: null,
        currentGageHeight: null,
        currentDissolvedOxygen: null,
      };
    }

    if (variableName.includes("Streamflow")) {
      sitesData[siteCode].currentFlow = {
        value,
        unit,
        timeRecorded,
      };
    } else if (variableName.includes("Gage height")) {
      sitesData[siteCode].currentGageHeight = {
        value,
        unit,
        timeRecorded,
      };
    } else if (variableName.includes("Temperature")) {
      sitesData[siteCode].currentTemp = {
        value,
        unit,
        timeRecorded,
      };
    } else if (variableName.includes("Dissolved oxygen")) {
      sitesData[siteCode].currentDissolvedOxygen = {
        value,
        unit,
        timeRecorded,
      };
    }
  });

  return sitesData;
}

function getDailyRiverMetrics(siteCode: string, period: string) {
  return fetch(`${USGS_API_BASE}dv/?site=${siteCode}&period=${period}&format=json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const dailyMetrics: DailyValuesMap = {};

      data.value.timeSeries.forEach((element: any) => {
        const variableName = element.variable.variableName;
        const unit = element.variable.unit.unitCode;
        const statistic = element.variable.options.option[0].value;

        if (!dailyMetrics[siteCode]) {
          dailyMetrics[siteCode] = {
            siteName: element.sourceInfo.siteName,
            siteCode: siteCode,
            dailyValues: {},
          };
        }

        element.values[0].value.forEach((val: any) => {
          const date = val.dateTime.split("T")[0];
          if (!dailyMetrics[siteCode].dailyValues[date]) {
            dailyMetrics[siteCode].dailyValues[date] = { streamflow: null, gageHeight: null, temperature: null, dissolvedOxygen: null };
          }

          if (variableName.includes("Streamflow")) {
            dailyMetrics[siteCode].dailyValues[date].streamflow = {
              value: val.value,
              unit: unit,
              timeRecorded: val.dateTime,
            };
          } else if (variableName.includes("pH")) {
            dailyMetrics[siteCode].dailyValues[date].gageHeight = {
              value: val.value,
              unit: unit,
              timeRecorded: val.dateTime,
            };
          } else if (variableName.includes("Temperature")) {
            if (!dailyMetrics[siteCode].dailyValues[date].temperature) {
              dailyMetrics[siteCode].dailyValues[date].temperature = { max: null, min: null, mean: null };
            }

            if (statistic.includes("Maximum")) {
              dailyMetrics[siteCode].dailyValues[date].temperature!.max = {
                value: val.value,
                unit: unit,
                timeRecorded: val.dateTime,
              };
            } else if (statistic.includes("Minimum")) {
              dailyMetrics[siteCode].dailyValues[date].temperature!.min = {
                value: val.value,
                unit: unit,
                timeRecorded: val.dateTime,
              };
            } else if (statistic.includes("Mean")) {
              dailyMetrics[siteCode].dailyValues[date].temperature!.mean = {
                value: val.value,
                unit: unit,
                timeRecorded: val.dateTime,
              };
            }
          } else if (variableName.includes("Dissolved oxygen")) {
            dailyMetrics[siteCode].dailyValues[date].dissolvedOxygen = {
              value: val.value,
              unit: unit,
              timeRecorded: val.dateTime,
            };
          }
        });

        // Sorting the dates:
        const sortedDates = Object.keys(dailyMetrics[siteCode].dailyValues).sort();
        const sortedDailyValues: DateValueMap = {};
        sortedDates.forEach(date => {
          sortedDailyValues[date] = dailyMetrics[siteCode].dailyValues[date];
        });
        dailyMetrics[siteCode].dailyValues = sortedDailyValues;
      });

      return dailyMetrics;
    })
    .catch((error) => {
      console.error(`Failed to fetch data: ${error.message}`);
      throw error;
    });
}


function getInstantaneousRiverMetrics(siteCode: string, period: string) {
  return fetch(`${USGS_API_BASE}iv/?site=${siteCode}&period=${period}&format=json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const instantaneousMetrics: InstantaneousValuesMap = {};

      data.value.timeSeries.forEach((element: any) => {
        const variableName = element.variable.variableName;
        const unit = element.variable.unit.unitCode;
        const statistic = element.variable.options.option[0].value;

        if (!instantaneousMetrics[siteCode]) {
          instantaneousMetrics[siteCode] = {
            siteName: element.sourceInfo.siteName,
            siteCode: element.value,
            instantaneousValues: {},
          };
        }

        element.values[0].value.forEach((val: any) => {
          const dateTime = val.dateTime;
          if (!instantaneousMetrics[siteCode].instantaneousValues[dateTime]) {
            instantaneousMetrics[siteCode].instantaneousValues[dateTime] = { streamflow: null, gageHeight: null, temperature: null, dissolvedOxygen: null };
          }

          if (variableName.includes("Streamflow")) {
            instantaneousMetrics[siteCode].instantaneousValues[dateTime].streamflow = {
              value: val.value,
              unit: unit,
              timeRecorded: val.dateTime,
            };
          } else if (variableName.includes("pH")) {
            instantaneousMetrics[siteCode].instantaneousValues[dateTime].gageHeight = {
              value: val.value,
              unit: unit,
              timeRecorded: val.dateTime,
            };
          } else if (variableName.includes("Temperature")) {
            if (!instantaneousMetrics[siteCode].instantaneousValues[dateTime].temperature) {
              instantaneousMetrics[siteCode].instantaneousValues[dateTime].temperature = { value: val.value, unit: null, timeRecorded: null };
            }
          } else if (variableName.includes("Dissolved oxygen")) {
            instantaneousMetrics[siteCode].instantaneousValues[dateTime].dissolvedOxygen = {
              value: val.value,
              unit: unit,
              timeRecorded: val.dateTime,
            };
          }
        });
        const sortedDateTimes = Object.keys(instantaneousMetrics[siteCode].instantaneousValues).sort();
        const sortedInstantaneousValues: InstantaneousValueMap = {};
        sortedDateTimes.forEach(dateTime => {
          sortedInstantaneousValues[dateTime] = instantaneousMetrics[siteCode].instantaneousValues[dateTime];
        });
        instantaneousMetrics[siteCode].instantaneousValues = sortedInstantaneousValues;
      });

      return instantaneousMetrics;
    })
    .catch((error) => {
      console.error(`Failed to fetch data: ${error.message}`);
      throw error;
    });
}

function getRiverFlowData(endpoint: string) {
  return fetch(`${USGS_API_BASE}${endpoint}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error(`Failed to fetch data: ${error.message}`);
      throw error;
    });
}

export {
  getRiverFlowData,
  getWyomingSites,
  getDailyRiverMetrics,
  getInstantaneousRiverMetrics
  // ... other functions you may want to add
};
