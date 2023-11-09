import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { Navigate, useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import ReactDatePicker from "react-datepicker";
//disable-eslint-for-next-line
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
	const codePoints = countryCode
		.toUpperCase()
		.split("")
		.map((char) => 127397 + char.charCodeAt());
	return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
	const [lat, lng] = useUrlPosition();
	const [cityName, setCityName] = useState("");
	const [country, setCountry] = useState("");
	const [date, setDate] = useState(new Date());
	const [notes, setNotes] = useState("");
	const navigate = useNavigate();
	const [isLoadingGeo, setIsLoadingGeo] = useState(false);
	const [emoji, setEmoji] = useState();
	const [geoCodingError, setGeoCodingError] = useState(null);
	const { createCity, isLoading } = useCities();

	useEffect(
		function () {
			async function fetchCityData() {
				try {
					setGeoCodingError(null);
					setIsLoadingGeo(true);
					const res = await fetch(
						`${BASE_URL}?latitude=${lat}&longitude=${lng}`
					);
					const data = await res.json();

					if (!data.countryCode) {
						throw new Error(
							"That doesn't seem to be a city click somewhere else !!"
						);
					}
					setCityName(data.city || data.locality || "");
					setCountry(data.countryName);
					setEmoji(convertToEmoji(data.countryCode));
				} catch (err) {
					setGeoCodingError(err.message);
				} finally {
					setIsLoadingGeo(false);
				}
			}
			fetchCityData();
		},
		[lat, lng, setGeoCodingError]
	);

	async function handleSubmit(e) {
		e.preventDefault();

		if (!cityName || !date) return;

		const newCity = {
			cityName,
			country,
			emoji,
			date,
			notes,
			position: { lat, lng },
		};

		await createCity(newCity);

		navigate("/app/cities");
	}

	if (isLoadingGeo) return <Spinner />;

	if (geoCodingError) {
		return <Message message={geoCodingError} />;
	}
	return (
		<form className={`${styles.form} ${isLoading ? styles.loading : ""}`}>
			<div className={styles.row}>
				<label htmlFor="cityName">City name</label>
				<input
					id="cityName"
					onChange={(e) => setCityName(e.target.value)}
					value={cityName}
				/>
				<span className={styles.flag}>{emoji}</span>
			</div>

			<div className={styles.row}>
				<label htmlFor="date">When did you go to {cityName}?</label>
				{/* <input
					id="date"
					onChange={(e) => setDate(e.target.value)}
					value={date}
				/> */}
				<ReactDatePicker
					id="date"
					onChange={(date) => setDate(date)}
					selected={date}
					dateFormat="dd/MM/yyyy"
				/>
			</div>

			<div className={styles.row}>
				<label htmlFor="notes">Notes about your trip to {cityName}</label>
				<textarea
					id="notes"
					onChange={(e) => setNotes(e.target.value)}
					value={notes}
				/>
			</div>

			<div className={styles.buttons}>
				<Button type="primary" onClick={handleSubmit}>
					Add
				</Button>
				<BackButton />
			</div>
		</form>
	);
}

export default Form;
