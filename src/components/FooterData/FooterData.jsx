import styles from "./FooterData.module.css";
import { getIconColor, getTextColor } from "../../helpers";
import { useEffect, useState } from "react";

const FooterData = ({
	day,
	weatherGroup,
	weatherDescription,
	primaryWeatherGroup,
}) => {
	const [iconSrc, setIconSrc] = useState(null);
	const [iconColor, setIconColor] = useState(null);

	useEffect(() => {
		setIconColor(getIconColor(primaryWeatherGroup));
	}, [primaryWeatherGroup]);

	useEffect(() => {
		if (iconColor) {
			import(`../../assets/${weatherGroup}-icon-${iconColor}.svg`).then(
				(module) => setIconSrc(module.default)
			);
		}
	}, [iconColor, weatherGroup]);

	const textColor = getTextColor(iconColor);

	return (
		<>
			<div className={styles.container}>
				<p className={styles.day} style={textColor}>
					{day}
				</p>
				{iconSrc && (
					<img
						className={styles.icon}
						src={iconSrc}
						alt={`${weatherGroup}-icon`}
					/>
				)}
				<p className={styles.weatherDescription} style={textColor}>
					{weatherDescription}
				</p>
			</div>
		</>
	);
};

export default FooterData;
