import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import {
	randomId,
} from '@mui/x-data-grid-generator';
import { GridToolbarContainer } from '@mui/x-data-grid';
import { GridRowModes } from '@mui/x-data-grid';
import { Container } from '@mui/material';
import { isObject } from '@mui/x-data-grid/internals';


function EditToolbar(props) {
	const { setRows, setRowModesModel, cities } = props;

	const handleClick = () => {
		const id = randomId();
		console.log('new row id is : ' + id);
		console.log(cities);
		setRows((oldRows) => {
			console.log(oldRows);
			return [...oldRows, { id: id, name: '', city: cities[0].id, isNew: true }];
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
function CombinedToolbar(props) {
	return (
		<React.Fragment>
			<EditToolbar setRows={props.setRows} setRowModesModel={props.setRowModesModel} cities={props.cities}/>
			<GridToolbar />
		</React.Fragment>
	);
}

EditToolbar.propTypes = {
	setRowModesModel: PropTypes.func.isRequired,
	setRows: PropTypes.func.isRequired,
	cities: PropTypes.array.isRequired
};

const Zones = () => {
	const [rows, setRows] = React.useState([]);
	const [zones, setZones] = React.useState([]);
	const [cities, setCities] = React.useState([]);
	const [rowModesModel, setRowModesModel] = React.useState({});

	React.useEffect(() => {
		console.log('hello from useEffect');
		console.log(GridToolbar);
		fetch('http://localhost:9000/api/zones').then(response => response.json()).then(zones => {
			setRows(zones.map(zone => {
				return { id: zone._id, name: zone.name, city: zone.city._id, isNew: false }
			}));
			// setRows([
			// 	{ id: 'BR', name: 'Brazil', city: 'ayoub' },
			// 	{ id: 'FR', name: 'France', city: 'nouri' }
			// ])
		});
		fetch('http://localhost:9000/api/cities').then(response => response.json()).then(cities => {
			setCities(cities.map(city => {
				return {
					id: city._id,
					city: city.name
				};
			}));
			// console.log(cities);
		});
	}, [zones]);


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
		fetch(`http://localhost:9000/api/zones/${id}`, {
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
		// console.log(rows);
		// console.log(newRow, oldRow);
		if (newRow.isNew === true) {
			// create a new city
			if (newRow.name.trim() === '') {
				setRows(rows.filter((row) => row.id !== newRow.id));
				return null;
			}
			fetch(`http://localhost:9000/api//cities/${newRow.city}/zones`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({ name: newRow.name })
			})
				.then(response => response.json())
				.then(data => {
					console.log('row created....');
					newRow.id = data._id;
					newRow.name = data.name;
					setZones([]);
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
			fetch(`http://localhost:9000/api/zones/${newRow.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					name: newRow.name,
					city: newRow.city
				})
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
		// console.log(r);
		return r.id;
	}

	const columns = [
		{ field: 'name', headerName: 'Name', width: 200, editable: true },
		{
			field: 'city',
			headerName: 'City',
			type: 'singleSelect',
			width: 200,
			editable: true,
			valueGetter: (params) => {
				// console.log(params);
				return params.row.city;
			},
			getOptionValue: (value) => isObject(value) ? value.id : String(value),
			getOptionLabel: (value) => isObject(value) ? value.city : String(value),
			valueOptions: cities
		},
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
				<h1>Zones</h1>
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
					// slots={{ 
					// 	toolbar:GridToolbar,
					//  }}
					slots={{
						toolbar: CombinedToolbar,
					}}
					slotProps={{
						toolbar: { setRows, setRowModesModel, cities },
					}}
				/>
			</Box>
		</Container>
	);
}

export default Zones;