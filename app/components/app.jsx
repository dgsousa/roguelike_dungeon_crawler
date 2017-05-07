import React from "react";
import Message from "./message.jsx";
import Board from "./board.jsx";
import Restart from "./restart.jsx";
import Stats from "./stats.jsx";
import Lights from "./lights.jsx";



const App = () => {		

	return (
		<div>
			<Message />
			<Board>
				<Restart />			
				<Stats />
				<Lights />
			</Board>
		</div>	
	);
};

export default App;







