import styles from "./Location.module.css";
import { useState, useEffect, useRef } from "react";
import { getIconColor, getTextColor } from "../../helpers";

const Location = ({ onUpdateLocation, primaryWeatherGroup }) => {
	const [active, setActive] = useState(false);
	const containerRef = useRef(null);
	const inputRef = useRef(null);
	const [submitted, setSubmitted] = useState(false);
	const [location, setLocation] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();
		if (location.trim() === "") {
			return;
		}

		localStorage.setItem("location", location);
		onUpdateLocation(location);
		setActive(false);
		setLocation("");
		setSubmitted(true);
	};

	const handleIconToggle = () => {
		setActive(!active);
		setSubmitted(false);
		if (!active && inputRef.current) {
			setTimeout(() => {
				inputRef.current.focus(); // Focus the input after a brief delay
			}, 0);
		}
	};

	const handleInputChange = (event) => {
		setLocation(event.target.value);
	};

	const handleKeyDown = (event) => {
		if (event.keyCode == 13) {
			handleSubmit(event);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target)
			) {
				setActive(false);
				setLocation("");
				setSubmitted(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const iconColor = getIconColor(primaryWeatherGroup);
	const textColor = getTextColor(iconColor);

	return (
		<>
			<div className={styles.container} ref={containerRef}>
				<div
					onClick={handleIconToggle}
					className={`${styles.icon} ${
						active ? styles.inactive : ""
					}`}
				>
					&gt;_
				</div>

				<input
					className={`${styles.mainInput} ${
						active ? styles.active : ""
					}`}
					ref={inputRef}
					placeholder="Enter location"
					type="text"
					value={location}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					disabled={submitted}
					style={{
						"--inputColor": textColor.color,
						"--placeholderColor": textColor.color,
					}}
				/>
			</div>
		</>
	);
};

export default Location;
