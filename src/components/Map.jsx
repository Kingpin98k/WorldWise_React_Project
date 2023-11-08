import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
	const navigate = useNavigate();

	const [serachParams, setSearchParams] = useSearchParams();
	const lat = serachParams.get("lat");
	const lng = serachParams.get("lng");

	return (
		<div className={styles.mapContainer} onClick={() => navigate("form")}>
			<h1>MAP</h1>
			<h1>
				Position: {lat},{lng}
			</h1>
		</div>
	);
}

export default Map;
