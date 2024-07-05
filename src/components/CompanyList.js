import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  IconButton,
  Button,
  Toolbar,
  Typography,
  TablePagination,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { Link, NavLink } from 'react-router-dom';

const CompanyList = ({ userId }) => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchCompanies = async () => {
      let userId = localStorage.getItem('userId');
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/companies?userId=${userId}`
        );
        setCompanies(response.data);
        setFilteredCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();
  }, [userId]);

  useEffect(() => {
    setFilteredCompanies(
      companies.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, companies]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one company to delete.');
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API}/companies`, {
        data: { ids: selectedIds },
      });
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => !selectedIds.includes(company._id))
      );
      setSelectedIds([]);
    } catch (error) {
      console.error('Error deleting companies:', error);
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one company to download.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/download`,
        { ids: selectedIds },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'selected_companies.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading selected companies:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const HandleBack = (e) => {
    e.preventDefault();

    window.location = '/';
  };
  return (
    <div>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Company List
        </Typography>

        <NavLink
          className="link"
          style={{ textDecoration: 'none', marginRight: '10px' }}
          to="/"
        >
          Home
        </NavLink>

        <Button
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          disabled={selectedIds.length === 0}
        >
          Delete Selected
        </Button>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handleDownloadSelected}
          disabled={selectedIds.length === 0}
        >
          Download Selected
        </Button>
      </Toolbar>
      {Array.isArray(companies) && companies.length > 0 ? (
        <>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{ margin: '10px 0' }}
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedIds.length > 0 &&
                        selectedIds.length < filteredCompanies.length
                      }
                      checked={
                        filteredCompanies.length > 0 &&
                        selectedIds.length === filteredCompanies.length
                      }
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked
                            ? filteredCompanies.map((company) => company._id)
                            : []
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCompanies
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((company) => (
                    <TableRow
                      key={company._id}
                      selected={selectedIds.includes(company._id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.includes(company._id)}
                          onChange={() => handleCheckboxChange(company._id)}
                        />
                      </TableCell>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>{company.description}</TableCell>
                      <TableCell>
                        <IconButton
                          component={Link}
                          to={`/company/${company._id}`}
                          size="small"
                        >
                          View Details
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCompanies.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <span> -- Not available Make your list -- </span>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
