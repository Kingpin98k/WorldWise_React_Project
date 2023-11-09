/*eslint-disable*/

import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CityList() {
	const { cities, isLoading } = useCities();

	if (isLoading) {
		return <Spinner />;
	}

	if (!cities.length) {
		return (
			<Message message="Add your first city by clicking on a city on the map" />
		);
	}
	// Using reducer for Filtering out unique countries
	const countries = cities.reduce((arr, city) => {
		//If the array doesnot contain the country already
		if (!arr.map((el) => el.country).includes(city.country)) {
			//Then add the coutry and return it for further procesing...
			return [...arr, { country: city.country, emoji: city.emoji }];
		}
		//Else simply return the current array
		else {
			return arr;
		}
	}, []);

	return (
		<ul className={styles.countryList}>
			{countries.map((country) => (
				<CountryItem country={country} key={country.country} />
			))}
		</ul>
	);
}

export default CityList;
