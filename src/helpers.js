export const getIconColor = (primaryWeatherGroup) => {
	let iconColor = "black";

	if (
		primaryWeatherGroup === "thunderstorm" ||
		primaryWeatherGroup === "clouds" ||
		primaryWeatherGroup === "rain"
	) {
		iconColor = "white";
	} else if (
		primaryWeatherGroup === "snow" ||
		primaryWeatherGroup === "atmosphere" ||
		primaryWeatherGroup === "clear" ||
		primaryWeatherGroup === "drizzle"
	) {
		iconColor = "black";
	}
	return iconColor;
};

export const getContainerStyle = (primaryWeatherGroup) => {
	let mainContainerStyle = {};

	switch (primaryWeatherGroup) {
		case "thunderstorm":
			mainContainerStyle = { background: "var(--thunderstorm)" };
			break;
		case "clouds":
			mainContainerStyle = { background: "var(--cloudy)" };
			break;
		case "rain":
			mainContainerStyle = { background: "var(--rain)" };
			break;
		case "snow":
			mainContainerStyle = { background: "var(--snow)" };
			break;
		case "atmosphere":
			mainContainerStyle = { background: "var(--atmosphere)" };
			break;
		case "clear":
			mainContainerStyle = { background: "var(--clear)" };
			break;
		case "drizzle":
			mainContainerStyle = { background: "var(--drizzle)" };
			break;
		default:
			mainContainerStyle = { background: "var(--primaryBackground)" };
			break;
	}

	return mainContainerStyle;
};

export const getTextColor = (iconColor) => {
	return iconColor === "white" ? { color: "#ffffff" } : { color: "#000000" };
};
