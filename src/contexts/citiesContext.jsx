import { circle } from "leaflet";
import {
	createContext,
	useContext,
	useEffect,
	useReducer,
	useState,
} from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000";

const initialState = {
	cities: [],
	isLoading: false,
	currentCity: {},
	error: "",
};
function reducer(state, action) {
	switch (action.type) {
		case "loading":
			return { ...state, isLoading: true };
		case "cities/loaded":
			return { ...state, isLoading: false, cities: action.payload };
		case "city/loaded":
			return { ...state, isLoading: false, currentCity: action.payload };
		case "cities/created":
			return {
				...state,
				isLoading: false,
				cities: [...state.cities, action.payload],
				currentCity: action.payload,
			};
		case "cities/deleted":
			return {
				...state,
				isLoading: false,
				cities: state.cities.filter((city) => city.id !== action.payload),
				currentCity: {},
			};
		case "rejected":
			return { ...state, isLoading: false, error: action.payload };
		default:
			throw new Error("Unknown Action Type: " + action.type);
	}
}

function CitiesProvider({ children }) {
	const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
		reducer,
		initialState
	);

	useEffect(function () {
		async function fetchCities() {
			try {
				dispatch({ type: "loading" });
				const res = await fetch(`${BASE_URL}/cities`);
				const data = await res.json();
				dispatch({ type: "cities/loaded", payload: data });
			} catch (err) {
				dispatch({
					type: "rejected",
					payload: "There was an errror loading data",
				});
			}
		}
		fetchCities();
	}, []);

	async function createCity(newCity) {
		try {
			dispatch({ type: "loading" });
			const res = await fetch(`${BASE_URL}/cities`, {
				method: "POST",
				body: JSON.stringify(newCity),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			dispatch({ type: "cities/created", payload: data });
		} catch (err) {
			dispatch({
				type: "rejected",
				payload: "There was some error in processing the request",
			});
		}
	}

	async function getCity(id) {
		if (Number(id) === currentCity.id) return;

		try {
			dispatch({ type: "loading" });
			const res = await fetch(`${BASE_URL}/cities/${id}`);
			const data = await res.json();
			dispatch({ type: "city/loaded", payload: data });
		} catch (err) {
			dispatch({
				type: "rejected",
				payload: "There was some error in processing the request",
			});
		}
	}

	async function deleteCity(id) {
		try {
			dispatch({ type: "loading" });
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: "DELETE",
			});
			dispatch({ type: "cities/deleted", payload: id });
		} catch (err) {
			dispatch({
				type: "rejected",
				payload: "There was some error in processing the request",
			});
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				getCity,
				error,
				createCity,
				deleteCity,
			}}
		>
			{children}
		</CitiesContext.Provider>
	);
}
function useCities() {
	const context = useContext(CitiesContext);
	if (context === undefined)
		throw new Error("Accessing cities context outside the scope");
	return context;
}

//eslint-disable-next-line
export { CitiesContext, CitiesProvider, useCities };
