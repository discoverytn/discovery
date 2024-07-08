import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Modal,
  Typography,
} from "@mui/material";

function UsersView() {
  const [explorerSearch, setExplorerSearch] = useState("");
  const [businessSearch, setBusinessSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [explorerPage, setExplorerPage] = useState(0);
  const [businessPage, setBusinessPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filteredExplorers, setFilteredExplorers] = useState([]);
  const [filteredBusinessOwners, setFilteredBusinessOwners] = useState([]);

  useEffect(() => {
    fetch("http://192.168.100.3:3000/admin/explorer")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFilteredExplorers(data);
        } else {
          console.error("Invalid data format for explorers:", data);
        }
      })
      .catch((error) => console.error("Error fetching explorers:", error));
  }, []);

  useEffect(() => {
    fetch("http://192.168.100.3:3000/admin/business")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFilteredBusinessOwners(data);
        } else {
          console.error("Invalid data format for business owners:", data);
        }
      })
      .catch((error) =>
        console.error("Error fetching business owners:", error)
      );
  }, []);

  const handleOpenModal = (business) => {
    setSelectedBusiness(business);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangeExplorerPage = (event, newPage) => {
    setExplorerPage(newPage);
  };

  const handleChangeBusinessPage = (event, newPage) => {
    setBusinessPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setExplorerPage(0);
    setBusinessPage(0);
  };

  const deleteExplorer = async (idexplorer) => {
    try {
      const response = await fetch(
        `http://192.168.100.3:3000/admin/delete/explorer/${idexplorer}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete explorer");
      }

      const updatedExplorers = filteredExplorers.filter(
        (explorer) => explorer.idexplorer !== idexplorer
      );
      setFilteredExplorers(updatedExplorers);
    } catch (error) {
      console.error("Error deleting explorer:", error);
    }
  };

  const deleteBusinessOwner = async (idbusiness) => {
    try {
      const response = await fetch(
        `http://192.168.100.3:3000/admin/delete/business/${idbusiness}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete business owner");
      }

      const updatedBusinessOwners = filteredBusinessOwners.filter(
        (owner) => owner.idbusiness !== idbusiness
      );
      setFilteredBusinessOwners(updatedBusinessOwners);
    } catch (error) {
      console.error("Error deleting business owner:", error);
    }
  };

  return (
    <Box sx={{ p: 10, flexGrow: 1, overflowY: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Search Explorers"
          variant="outlined"
          fullWidth
          value={explorerSearch}
          onChange={(e) => setExplorerSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Actions</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Posts</TableCell>
                <TableCell>Visits</TableCell>
                <TableCell>Reviews</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExplorers.length > 0 ? (
                filteredExplorers
                  .slice(
                    explorerPage * rowsPerPage,
                    explorerPage * rowsPerPage + rowsPerPage
                  )
                  .map((explorer) => (
                    <TableRow key={explorer.idexplorer}>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => deleteExplorer(explorer.idexplorer)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                      <TableCell>{explorer.idexplorer}</TableCell>
                      <TableCell>{explorer.username}</TableCell>
                      <TableCell>{explorer.firstname}</TableCell>
                      <TableCell>{explorer.lastname}</TableCell>
                      <TableCell>{explorer.email}</TableCell>
                      <TableCell>{explorer.numOfPosts}</TableCell>
                      <TableCell>{explorer.numOfVisits}</TableCell>
                      <TableCell>{explorer.numOfReviews}</TableCell>
                      <TableCell>{explorer.governorate},{explorer.municipality}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11}>No explorers found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredExplorers.length}
          rowsPerPage={rowsPerPage}
          page={explorerPage}
          onPageChange={handleChangeExplorerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <Box>
        <TextField
          label="Search Business Owners"
          variant="outlined"
          fullWidth
          value={businessSearch}
          onChange={(e) => setBusinessSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Actions</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>ID Number</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Reviews</TableCell>
                <TableCell>Business Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBusinessOwners.length > 0 ? (
                filteredBusinessOwners
                  .slice(
                    businessPage * rowsPerPage,
                    businessPage * rowsPerPage + rowsPerPage
                  )
                  .map((owner) => (
                    <TableRow key={owner.idbusiness}>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => deleteBusinessOwner(owner.idbusiness)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                      <TableCell>{owner.idbusiness}</TableCell>
                      <TableCell>{owner.BOid}</TableCell>
                      <TableCell>{owner.username}</TableCell>
                      <TableCell>{owner.firstname}</TableCell>
                      <TableCell>{owner.lastname}</TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell>{owner.numOfReviews}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => handleOpenModal(owner)}
                        >
                          Show Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10}>No business owners found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBusinessOwners.length}
          rowsPerPage={rowsPerPage}
          page={businessPage}
          onPageChange={handleChangeBusinessPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="business-details-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Business Details
          </Typography>
          {selectedBusiness && (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Business Name</TableCell>
                    <TableCell>{selectedBusiness.businessName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>{selectedBusiness.businessDesc}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>{selectedBusiness.category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Location</TableCell>
                    <TableCell>{selectedBusiness.governorate},{selectedBusiness.municipality}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Contact Phone</TableCell>
                    <TableCell>{selectedBusiness.mobileNum}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default UsersView;
