import {
	Chart,
	BarSeries,
} from '@devexpress/dx-react-chart-material-ui';
import { Box, Container, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';


const Home = () => {
	const [data, setData] = useState([]);
	useEffect(() => {
		fetch('http://localhost:9000/api/zonespercity')
			.then(response => response.json())
			.then(results => {
				setData(results);
				console.log(results);
			});
	}, []);

	return (
		<Container className="container" sx={{
			backgroundColor: 'white',
			marginTop: 5,
		}}>
			<Box className="title">
				<h2>Number of zones per city</h2>
			</Box>
			<Paper>
				<Chart data={data} >
					<BarSeries
						name='asdfasdfasfd'
						valueField="numberOfZones"
						argumentField="name"
					/>
				</Chart>
			</Paper>
		</Container>
	);
};

export default Home;