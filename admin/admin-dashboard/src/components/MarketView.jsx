import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Typography,
  Modal,
  styled,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ConfirmationPopup from "./ConfirmationPopup";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const FullWidthPaper = styled(Paper)({
  width: "100%",
  marginBottom: "20px",
  overflowX: "auto",
});

const FullWidthTextField = styled(TextField)({
  width: "100%",
  marginBottom: "20px",
});

const NarrowTableCell = styled(TableCell)({
  width: "1%",
  whiteSpace: "nowrap",
  padding: "6px 8px",
});

const DeleteButton = styled(Button)({
  backgroundColor: '#f24537',
  color: 'white',
  '&:hover': {
    backgroundColor: '#c62d1f',
  },
});

const GreenButton = styled(Button)({
  backgroundColor: '#4CAF50',
  color: 'white',
  '&:hover': {
    backgroundColor: '#45a049',
  },
});

const AddButton = styled(Button)({
  backgroundColor: '#2196F3',
  color: 'white',
  '&:hover': {
    backgroundColor: '#1976D2',
  },
  marginLeft: '20px',
});

function MarketView() {
  const { idadmin } = useAuth();
  const [marketItems, setMarketItems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [file, setFile] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [type, setType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    fetchMarketItems();
  }, []);

  const fetchMarketItems = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/market/getall`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMarketItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching market items:", error);
      setMarketItems([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setItemName(item.itemName);
      setItemDescription(item.itemDescription);
      setItemPrice(item.itemPrice);
      setItemImage(item.itemImage);
      setType(item.type);
    } else {
      setEditItem(null);
      setItemName("");
      setItemDescription("");
      setItemPrice("");
      setItemImage("");
      setType("");
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setItemName("");
    setItemDescription("");
    setItemPrice("");
    setItemImage("");
    setType("");
    setEditItem(null);
    setFile(null);
    setUploading(false);
    setUploadSuccess(false);
  };

  const handleImageChange = (event) => {
    setFile(event.target.files[0]);
    setUploadSuccess(false);
  };

  const uploadImage = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "discovery");

    setUploading(true);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dflixnywo/image/upload`,
        formData
      );
      setItemImage(response.data.secure_url);
      setUploadSuccess(true);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!uploadSuccess && file) {
      alert("Please upload the image before submitting.");
      return;
    }
  
    if (!idadmin) {
      console.log("Admin ID is not available. Please log in again.");
      return;
    }
  
    const updatedItem = {
      itemName,
      itemDescription,
      itemPrice,
      itemImage,
      type,
      admin_idadmin: idadmin,
    };
  
    try {
      let response;
      if (editItem) {
        response = await fetch(
          `${API_URL}/admin/market/update/${editItem.iditem}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedItem),
          }
        );
      } else {
        response = await fetch(`${API_URL}/admin/market/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItem),
        });
      }
      if (response.ok) {
        fetchMarketItems();
        handleCloseModal();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding/updating market item:", error);
      alert("An error occurred while saving the item. Please try again.");
    }
  };

  const deleteMarketItem = async (iditem) => {
    try {
      const response = await fetch(`${API_URL}/admin/market/delete/${iditem}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMarketItems(marketItems.filter((item) => item.iditem !== iditem));
      } else {
        console.error("Failed to delete market item");
      }
    } catch (error) {
      console.error("Error deleting market item:", error);
    }
  };

  const filteredItems = marketItems.filter((item) =>
    item && item.itemName
      ? item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
      : false
  );

  const handleOpenImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Market Items</Typography>
        <AddButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Add New Item
        </AddButton>
      </Box>
      <FullWidthTextField
        label="Search Items"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <Box sx={{ flexGrow: 1, overflow: "auto", mt: 2 }}>
        <FullWidthPaper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <NarrowTableCell>Actions</NarrowTableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Image</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.iditem}>
                      <NarrowTableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <GreenButton onClick={() => handleOpenModal(item)}>
                            Edit
                          </GreenButton>
                          <ConfirmationPopup
                            action="Delete"
                            onConfirm={() => deleteMarketItem(item.iditem)}
                            CustomButton={DeleteButton}
                          />
                        </Box>
                      </NarrowTableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.itemDescription}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.itemPrice}</TableCell>
                      <TableCell>
                        {item.itemImage && (
                          <img
                            src={item.itemImage}
                            alt={item.itemName}
                            style={{ width: "50px", height: "50px", cursor: "pointer" }}
                            onClick={() => handleOpenImageModal(item.itemImage)}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </FullWidthPaper>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editItem ? "Update Item" : "Add New Item"}
          </Typography>
          <FullWidthTextField
            label="Name"
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <FullWidthTextField
            label="Description"
            variant="outlined"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />
          <FullWidthTextField
            label="Type"
            variant="outlined"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <FullWidthTextField
            label="Price"
            variant="outlined"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={uploadImage}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={uploading}
          >
            {editItem ? "Update Item" : "Create Item"}
          </Button>
        </Box>
      </Modal>
      <Modal open={openImageModal} onClose={handleCloseImageModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <img
            src={selectedImage}
            alt="Enlarged view"
            style={{ maxWidth: "100%", maxHeight: "80vh" }}
          />
        </Box>
      </Modal>
    </Box>
  );
}

export default MarketView;