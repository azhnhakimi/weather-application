import "./App.css";
import axios from "axios";
import { useEffect } from "react";

function App() {
	useEffect(() => {
		axios
			.get(
				"http://api.openweathermap.org/geo/1.0/direct?q=Kuala Lumpur&limit=5&appid=fabd0680cafbb21a09efe3f07d816826"
			)
			.then((res) => showResults(res.data))
			.catch((err) => console.log(err));
	}, []);

	const showResults = (data) => {
		data.forEach((element) => {
			console.log(element);
		});
	};

	return (
		<>
			<div className="mainContainer"></div>
		</>
	);
}

export default App;
