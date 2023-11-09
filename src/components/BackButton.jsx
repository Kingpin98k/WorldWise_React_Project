import Button from "./Button";
import { useNavigate } from "react-router-dom";

function BackButton() {
	const navigate = useNavigate();
	return (
		<Button
			type="back"
			onClick={(e) => {
				//This is to prevent the form from submitting and thus eaving the back navigation to form only
				e.preventDefault();
				//This is to navigate one step back in the page (-1)
				navigate("../cities");
			}}
		>
			&larr; Back
		</Button>
	);
}

export default BackButton;
