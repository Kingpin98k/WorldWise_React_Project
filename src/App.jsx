import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Product from "./pages/product";
import Pricing from "./pages/Pricing";
import Homepage from "./pages/Homepage";
import Pagenotfound from "./pages/Pagenotfound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import { CitiesContext, CitiesProvider } from "./contexts/CitiesContext";

function App() {
	return (
		<CitiesProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="pricing" element={<Pricing />} />
					<Route path="product" element={<Product />} />
					<Route path="*" element={<Pagenotfound />} />
					<Route path="login" element={<Login />} />
					<Route path="app" element={<AppLayout />}>
						{/* Using nested routes */}
						<Route path="cities" element={<CityList />} />
						<Route path="cities/:id" element={<City />} />
						<Route path="countries" element={<CountryList />} />
						<Route path="form" element={<Form />} />
						{/* Implementing Index Routes */}
						<Route index element={<Navigate to="cities" />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</CitiesProvider>
	);
}

export default App;
