import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
	randomId,
} from '@mui/x-data-grid-generator';
import { GridToolbarContainer } from '@mui/x-data-grid';
import { GridRowModes } from '@mui/x-data-grid';
import { Container } from '@mui/material';


function EditToolbar(props) {
	const { setRows, setRowModesModel } = props;

	const handleClick = () => {
		const id = randomId();
		console.log('new row id is : ' + id);
		setRows((oldRows) => {
			console.log(oldRows);
			return [...oldRows, { id: id, name: '', zones: [], isNew: true }];
		});
		setRowModesModel((oldModel) => ({
			...oldModel,
			[id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
		}));
	};

	return (
		<GridToolbarContainer>
			<Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
				Add record
			</Button>
		</GridToolbarContainer>
	);
}

EditToolbar.propTypes = {
	setRowModesModel: PropTypes.func.isRequired,
	setRows: PropTypes.func.isRequired,
};

const Cities = () => {
	const [rows, setRows] = React.useState([]);
	const [cities, setCities] = React.useState([]);
	const [rowModesModel, setRowModesModel] = React.useState({});

	React.useEffect(() => {
		console.log('hello from useEffect');
		fetch('http://localhost:9000/api/cities').then(response => response.json()).then(cities => {
			setRows(cities.map(city => { return { id: city._id, name: city.name, zones: city.zones, isNew: false } }));
			// setCities(rows);
		});
	}, [cities]);


	const handleRowEditStart = (params, event) => {
		event.defaultMuiPrevented = true;
	};

	const handleRowEditStop = (params, event) => {
		event.defaultMuiPrevented = true;
	};

	const handleEditClick = (id) => () => {
		console.log(`editing enabled for ${id}`);
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};

	const handleDeleteClick = (id) => (event) => {
		console.log(event);
		fetch(`http://localhost:9000/api/cities/${id}`, {
			method: 'DELETE',
		})
			.then(response => response.json())
			.then(data => {
				console.log('row deleted....');
				setRows(rows.filter((row) => row.id !== id));
			})
			.catch(error => {
				console.error(error);
			});
	};

	const handleCancelClick = (id) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});

		const editedRow = rows.find((row) => row.id === id);
		if (editedRow.isNew) {
			setRows(rows.filter((row) => row.id !== id));
		}
	};

	const processRowUpdate = (newRow, oldRow) => {
		console.log(rows);
		console.log(newRow, oldRow);
		if (newRow.isNew === true) {
			// create a new city
			if (newRow.name.trim() === '') {
				setRows(rows.filter((row) => row.id !== newRow.id));
				return null;
			}
			fetch(`http://localhost:9000/api/cities`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({ name: newRow.name })
			})
				.then(response => response.json())
				.then(data => {
					console.log('row updated....');
					newRow.id = data._id;
					newRow.name = data.name;
					setCities([]);
				})
				.catch(error => {
					console.error(error);
				});
		}
		else {
			// update an existing city
			if (newRow.name.trim() === '') {
				return oldRow;
			}
			fetch(`http://localhost:9000/api/cities/${newRow.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({ name: newRow.name })
			})
				.then(response => response.json())
				.then(data => {
					console.log('row updated....');
				})
				.catch(error => {
					console.error(error);
				});
		}
		const updatedRow = { ...newRow, isNew: false };
		setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		return updatedRow;
	};

	const handleRowModesModelChange = (newRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const handleGetRowId = (r) => {
		console.log(r);
		return r.id;
	}

	const columns = [
		{ field: 'name', headerName: 'Name', width: 180, editable: true },
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			width: 120,
			cellClassName: 'actions',
			getActions: ({ id }) => {
				const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

				if (isInEditMode) {
					return [
						<GridActionsCellItem
							icon={<SaveIcon />}
							label="Save"
							onClick={handleSaveClick(id)}
						/>,
						<GridActionsCellItem
							icon={<CancelIcon />}
							label="Cancel"
							className="textPrimary"
							onClick={handleCancelClick(id)}
							color="inherit"
						/>,
					];
				}

				return [
					<GridActionsCellItem
						icon={<EditIcon />}
						label="Edit"
						className="textPrimary"
						onClick={handleEditClick(id)}
						color="inherit"
					/>,
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label="Delete"
						onClick={handleDeleteClick(id)}
						color="inherit"
					/>,
				];
			},
		},
	];



	return (
		<Container className="container" sx={{
			backgroundColor: 'white',
			marginTop: 5,
		}}>
			<Box className="title">
				<h1>Cities</h1>
			</Box>
			<Box className="about-container" sx={{ height: 400, width: '100%' }}>
				<DataGrid
					rows={rows}
					columns={columns}
					editMode="row"
					getRowId={handleGetRowId}
					rowModesModel={rowModesModel}
					onRowModesModelChange={handleRowModesModelChange}
					onRowEditStart={handleRowEditStart}
					onRowEditStop={handleRowEditStop}
					processRowUpdate={processRowUpdate}
					onProcessRowUpdateError={(e) => console.log(e)}
					slots={{
						toolbar: EditToolbar,
					}}
					slotProps={{
						toolbar: { setRows, setRowModesModel },
					}}
				/>
			</Box>
		</Container>
	);
}

export default Cities;























// import { useNavigate } from 'react-router-dom';
// import Container from '@mui/material/Container';
// import { Box } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';

// const columns = [
// 	{ field: 'id', headerName: 'ID', width: 90 },
// 	{
// 		field: 'firstName',
// 		headerName: 'First name',
// 		width: 150,
// 		editable: true,
// 	},
// 	{
// 		field: 'lastName',
// 		headerName: 'Last name',
// 		width: 150,
// 		editable: true,
// 	},
// 	{
// 		field: 'age',
// 		headerName: 'Age',
// 		type: 'number',
// 		width: 110,
// 		editable: true,
// 	},
// 	{
// 		field: 'fullName',
// 		headerName: 'Full name',
// 		description: 'This column has a value getter and is not sortable.',
// 		sortable: false,
// 		width: 160,
// 		valueGetter: (params) =>
// 			`${params.row.firstName || ''} ${params.row.lastName || ''}`,
// 	},
// ];

// const rows = [
// 	{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
// 	{ id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
// 	{ id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
// 	{ id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
// 	{ id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
// 	{ id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
// 	{ id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
// 	{ id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
// 	{ id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

// const Cities = () => {
// 	const navigate = useNavigate();
// 	return (
// 		<Container className="container" sx={{
// 			backgroundColor: 'white',
// 			marginTop: 5,
// 		}}>
// 			<Box className="title">
// 				<h1>Cities</h1>
// 			</Box>
// 			<Box className="about-container" sx={{ height: 400, width: '100%' }}>
// 				<DataGrid
// 					rows={rows}
// 					columns={columns}
// 					initialState={{
// 						pagination: {
// 							paginationModel: {
// 								pageSize: 5,
// 							},
// 						},
// 					}}
// 					pageSizeOptions={[5]}
// 					// checkboxSelection
// 					// editMode='false'
// 					disableRowSelectionOnClick
// 				/>
// 			</Box>
// 		</Container>
// 	);
// };
