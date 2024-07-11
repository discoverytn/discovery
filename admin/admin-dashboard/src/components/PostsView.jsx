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
  Typography,
  styled,
} from "@mui/material";
import ConfirmationPopup from "./ConfirmationPopup";

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

const CustomTableContainer = styled(TableContainer)({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
});

const CustomTable = styled(Table)({
  flexGrow: 1,
});

const DeleteButton = styled('button')({
  boxShadow: 'inset 0px 1px 0px 0px #f5978e',
  background: 'linear-gradient(to bottom, #f24537 5%, #c62d1f 100%)',
  backgroundColor: '#f24537',
  borderRadius: '6px',
  border: '1px solid #d02718',
  display: 'inline-block',
  cursor: 'pointer',
  color: '#ffffff',
  fontFamily: 'Arial',
  fontSize: '15px',
  fontWeight: 'bold',
  padding: '10px 24px',
  textDecoration: 'none',
  textShadow: '0px 1px 0px #810e05',
  '&:hover': {
    background: 'linear-gradient(to bottom, #c62d1f 5%, #f24537 100%)',
    backgroundColor: '#c62d1f',
  },
  '&:active': {
    position: 'relative',
    top: '1px',
  },
});

const NarrowTableCell = styled(TableCell)({
  width: '1%',
  whiteSpace: 'nowrap',
  padding: '6px 8px',
});

function PostsView() {
  const [explorerPage, setExplorerPage] = useState(0);
  const [businessPage, setBusinessPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [explorerSearch, setExplorerSearch] = useState("");
  const [businessSearch, setBusinessSearch] = useState("");
  const [explorerPosts, setExplorerPosts] = useState([]);
  const [businessPosts, setBusinessPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/posts/explorer/posts`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExplorerPosts(data);
        } else {
          console.error("Invalid data format for explorer posts:", data);
        }
      })
      .catch((error) => console.error("Error fetching explorer posts:", error));

    fetch(`${API_URL}/posts/business/posts`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBusinessPosts(data);
        } else {
          console.error("Invalid data format for business posts:", data);
        }
      })
      .catch((error) => console.error("Error fetching business posts:", error));
  }, []);

  const filterPosts = (posts, search) => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase())
    );
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

  const handleDelete = async (idposts, isExplorer) => {
    try {
      const response = await fetch(`${API_URL}/posts/delete/${idposts}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      if (isExplorer) {
        setExplorerPosts(
          explorerPosts.filter((post) => post.idposts !== idposts)
        );
      } else {
        setBusinessPosts(
          businessPosts.filter((post) => post.idposts !== idposts)
        );
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const renderTable = (posts, page, handleChangePage, search, isExplorer) => (
    <FullWidthPaper elevation={3}>
      <TableContainer sx={{ flexGrow: 1 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <NarrowTableCell>Delete</NarrowTableCell>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Average Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterPosts(posts, search)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((post) => (
                <TableRow key={post.idposts}>
                  <NarrowTableCell>
                    <ConfirmationPopup
                      action="Delete Post"
                      onConfirm={() => handleDelete(post.idposts, isExplorer)}
                      CustomButton={DeleteButton}
                    />
                  </NarrowTableCell>
                  <TableCell>{post.idposts}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.location}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    {post.averageRating ? post.averageRating.toFixed(1) : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filterPosts(posts, search).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </FullWidthPaper>
  );
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        Explorer Posts
      </Typography>
      <FullWidthTextField
        label="Search Explorer Posts"
        variant="outlined"
        value={explorerSearch}
        onChange={(e) => setExplorerSearch(e.target.value)}
      />
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 4 }}>
        {renderTable(
          explorerPosts,
          explorerPage,
          handleChangeExplorerPage,
          explorerSearch,
          true
        )}
      </Box>

      <Typography variant="h4" gutterBottom>
        Business Posts
      </Typography>
      <FullWidthTextField
        label="Search Business Posts"
        variant="outlined"
        value={businessSearch}
        onChange={(e) => setBusinessSearch(e.target.value)}
      />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {renderTable(
          businessPosts,
          businessPage,
          handleChangeBusinessPage,
          businessSearch,
          false
        )}
      </Box>
    </Box>
  );
}

export default PostsView;