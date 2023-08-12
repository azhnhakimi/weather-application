import styles from "./Card.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import FooterData from "../FooterData/FooterData";
import { getContainerStyle, getIconColor, getTextColor } from "../../helpers";
import Location from "../Location/Location";

const Card = () => {
	const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);
	const [daysArray, setDaysArray] = useState(null);
	const [primaryDay, setPrimaryDay] = useState(null);
	const [primaryWeatherGroup, setPrimaryWeatherGroup] = useState(null);
	const [location, setLocation] = useState("");
	const [iconSrc, setIconSrc] = useState(null);

	useEffect(() => {
		const storedLocation = localStorage.getItem("location");
		setLocation(storedLocation);
	}, []);

	// Gets the longitude and latitude of location based on name
	useEffect(() => {
		if (location) {
			axios
				.get(
					`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`
				)
				.then((res) => setGeoCoordinates(res.data))
				.catch((err) => console.log(err));
		}
	}, [location]);

	const handleLocationUpdate = (newLocation) => {
		setLocation(newLocation);
	};

	// Sets the longitude and latitude params
	const setGeoCoordinates = (data) => {
		// # note : add location to local storage here
		data.forEach((element) => {
			setLatitude(element.lat);
			setLongitude(element.lon);
		});
	};

	// Make calls to the API and processes the information
	useEffect(() => {
		if (latitude !== null && longitude !== null) {
			axios
				.get(
					`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
				)
				.then((res) => processData(res.data))
				.catch((err) => console.log(err));
		}
	}, [latitude, longitude]);

	useEffect(() => {
		if (daysArray) {
			setPrimaryDay(daysArray[0]);
		}
	}, [daysArray]);

	useEffect(() => {
		if (primaryWeatherGroup) {
			const iconColor = getIconColor(primaryWeatherGroup);
			const weatherGroup = primaryWeatherGroup.toLowerCase();

			import(`../../assets/${weatherGroup}-icon-${iconColor}.svg`).then(
				(module) => setIconSrc(module.default)
			);
		}
	}, [primaryWeatherGroup]);

	useEffect(() => {
		if (primaryDay) {
			setPrimaryWeatherGroup(
				primaryDay.maxWeatherGroup.group.toLowerCase()
			);
		}
	}, [primaryDay]);

	const processData = (data) => {
		const dailyForecasts = {};
		data.list.forEach((item, index) => {
			// Get the date as a string in the format "YYYY-MM-DD"
			const date = item.dt_txt.split(" ")[0];
			let dayName;

			if (index === 0) {
				// Extract the day name from the date
				dayName = new Date(date).toLocaleDateString("en-US", {
					weekday: "long",
				});
			} else {
				// Extract the day name from the date
				dayName = new Date(date).toLocaleDateString("en-US", {
					weekday: "short",
				});
			}

			// Extract temperature, weather description, and weather group
			const temperature = item.main.temp;
			const weatherDescription = item.weather[0].description;
			const weatherGroup = item.weather[0].main;

			// Add temperature, weather description, and weather group to the dailyForecasts object using the date as the key
			if (!dailyForecasts[date]) {
				dailyForecasts[date] = {
					day: dayName,
					temperatureSum: temperature,
					dataPointCount: 1,
					weatherDescriptions: [weatherDescription],
					weatherGroups: [weatherGroup],
					maxWeatherDescription: {
						description: weatherDescription,
						count: 1,
					},
					maxWeatherGroup: { group: weatherGroup, count: 1 },
				};
			} else {
				dailyForecasts[date].temperatureSum += temperature;
				dailyForecasts[date].dataPointCount++;
				dailyForecasts[date].weatherDescriptions.push(
					weatherDescription
				);
				dailyForecasts[date].weatherGroups.push(weatherGroup);

				// Update the occurrences of weather descriptions and groups
				const weatherDescriptionsOccurrences = dailyForecasts[
					date
				].weatherDescriptions.reduce((acc, desc) => {
					acc[desc] = (acc[desc] || 0) + 1;
					return acc;
				}, {});

				const weatherGroupsOccurrences = dailyForecasts[
					date
				].weatherGroups.reduce((acc, group) => {
					acc[group] = (acc[group] || 0) + 1;
					return acc;
				}, {});

				// Find the most frequent weather description and group
				const maxWeatherDescription = Object.entries(
					weatherDescriptionsOccurrences
				).reduce((a, b) => (a[1] > b[1] ? a : b));

				const maxWeatherGroup = Object.entries(
					weatherGroupsOccurrences
				).reduce((a, b) => (a[1] > b[1] ? a : b));

				dailyForecasts[date].maxWeatherDescription = {
					description: maxWeatherDescription[0],
					count: maxWeatherDescription[1],
				};
				dailyForecasts[date].maxWeatherGroup = {
					group: maxWeatherGroup[0],
					count: maxWeatherGroup[1],
				};
			}
		});

		// Calculate the average temperature for each day
		Object.keys(dailyForecasts).forEach((date) => {
			const averageTemperature =
				dailyForecasts[date].temperatureSum /
				dailyForecasts[date].dataPointCount;
			dailyForecasts[date].averageTemperature =
				Math.round(averageTemperature);
		});

		const dailyForecastsArray = Object.keys(dailyForecasts).map(
			(key) => dailyForecasts[key]
		);

		setDaysArray(dailyForecastsArray);
	};

	const mainContainerStyle = getContainerStyle(primaryWeatherGroup);

	let footerDaysArray;
	if (daysArray) {
		footerDaysArray = daysArray.slice(1);
	}
	const iconColor = getIconColor(primaryWeatherGroup);
	const textColor = getTextColor(iconColor).color;

	return (
		<div className={styles.mainContainer} style={mainContainerStyle}>
			<div className={styles.locationContainer}>
				<Location
					onUpdateLocation={handleLocationUpdate}
					primaryWeatherGroup={primaryWeatherGroup}
				/>
			</div>
			<div
				className={styles.primaryDay}
				style={{ "--primaryColor": textColor }}
			>
				{primaryDay && (
					<>
						<div className={styles.temperature}>
							{primaryDay.averageTemperature}
						</div>

						<div className={styles.dayDescription}>
							{primaryDay.maxWeatherDescription.description}
						</div>
					</>
				)}
			</div>
			<div className={styles.information}>
				<div className={styles.subInfo}>
					{primaryDay && (
						<>
							<p
								className={styles.location}
								style={{ "--primaryColor": textColor }}
							>
								{location}
							</p>
							<p
								className={styles.dayDisplay}
								style={{ "--primaryColor": textColor }}
							>
								{primaryDay.day}
							</p>
						</>
					)}
				</div>

				{iconSrc && (
					<img
						className={styles.icon}
						src={iconSrc}
						alt={`primary-weather-icon`}
					/>
				)}
			</div>
			<div
				className={styles.mainFooterContainer}
				style={{ "--borderTopColor": textColor }}
			>
				{footerDaysArray &&
					footerDaysArray.map((day) => (
						<div key={day.day} className={styles.footerContainer}>
							<FooterData
								day={day.day}
								weatherGroup={day.maxWeatherGroup.group.toLowerCase()}
								weatherDescription={
									day.maxWeatherDescription.description
								}
								primaryWeatherGroup={primaryWeatherGroup}
							/>
						</div>
					))}
			</div>
		</div>
	);
};

export default Card;
