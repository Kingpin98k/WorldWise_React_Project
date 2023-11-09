import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import "react-datepicker/dist/react-datepicker.css";

import {
	MapContainer,
	TileLayer,
	Popup,
	Marker,
	useMap,
	useMapEvent,
	useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
	const { cities } = useCities();

	const [mapPosition, setMapPosition] = useState([40, 0]);

	const {
		isLoading: isLoadingPosition,
		position: geolocationPosition,
		getPosition,
	} = useGeolocation();

	const [mapLat, mapLng] = useUrlPosition();

	useEffect(
		function () {
			if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
		},
		[mapLat, mapLng]
	);

	useEffect(
		function () {
			if (geolocationPosition) setMapPosition(geolocationPosition);
		},
		[geolocationPosition]
	);

	return (
		<div className={styles.mapContainer}>
			{!geolocationPosition && (
				<Button type="position" onClick={getPosition}>
					{isLoadingPosition ? "Loading..." : "Use your Position"}
				</Button>
			)}
			<MapContainer
				center={[mapLat, mapLng]}
				zoom={13}
				scrollWheelZoom={true}
				className={styles.map}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
				/>
				{cities &&
					Array.isArray(cities) &&
					cities.map((city) => (
						<Marker
							position={[city.position.lat, city.position.lng]}
							key={city.id}
						>
							<Popup>
								<span>{city.emoji}</span>
								<span>{city.cityName}</span>
							</Popup>
						</Marker>
					))}
				<ChangeCenter position={mapPosition}></ChangeCenter>
				<DetectClick />
			</MapContainer>
		</div>
	);
}

//THese are custom function components that we create to add functionalities to the map
function ChangeCenter({ position }) {
	const map = useMap();
	map.setView(position);
	return null;
}

function DetectClick() {
	const navigate = useNavigate();
	useMapEvents({
		click: (e) => {
			navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
		},
	});
}

export default Map;
