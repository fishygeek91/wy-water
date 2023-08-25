// Reusable types
export type Value = {
    value: number | null;
    unit: string | null;
    timeRecorded: string | null;
}

export type MaxMinMean = {
    max: Value | null;
    min: Value | null;
    mean: Value | null;
}

// Site Value Types
export type CurrentValue = {
    siteName: string;
    siteCode: string;
    currentTemp: Value | null;
    currentFlow: Value | null;
    currentGageHeight: Value | null;
    currentDissolvedOxygen: Value | null;
}

export type CurrentValuesMap = {
    [siteCode: string]: CurrentValue;
}

// Daily Values
export type DailyValue = {
    siteName: string;
    siteCode: string;
    dailyValues: DateValueMap;
}

export type DailyValuesMap = {
    [siteCode: string]: DailyValue;
}

export type DateValueMap = {
    [dateTime: string]: DailyMetrics;
}

export type DailyMetrics = {
    streamflow: Value | null;
    gageHeight: Value | null;
    temperature: MaxMinMean | null;
    dissolvedOxygen: Value | null;
}

// Instantaneous Values
export type InstantaneousValue = {
    siteName: string;
    siteCode: string;
    instantaneousValues: InstantaneousValueMap;
}

export type InstantaneousMetrics = {
    streamflow: Value | null;
    gageHeight: Value | null;
    temperature: Value | null;
    dissolvedOxygen: Value | null;
}

export type InstantaneousValueMap = {
    [dateTime: string]: InstantaneousMetrics;
}

export type InstantaneousValuesMap = {
    [siteCode: string]: InstantaneousValue;
}