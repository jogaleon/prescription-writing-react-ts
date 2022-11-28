import MarkerData from "../types/state/markerData";

type MarkerSettingsType = {
    DEFAULT_WIDTH: number
    MIN_WIDTH: number
    MIN_HEIGHT: number
}

const MARKER_SETTINGS: MarkerSettingsType = {
    DEFAULT_WIDTH: 100,
    MIN_WIDTH: 30,
    MIN_HEIGHT: 30,
};

export default MARKER_SETTINGS;
