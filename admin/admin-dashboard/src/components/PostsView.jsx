import React, { useState, useEffect } from 'react';
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Button, Modal, Typography } from '@mui/material';

function PostsView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetch("http://192.168.142.72:3000/posts/allposts")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFilteredPosts(data);
        } else {
          console.error("Invalid data format for posts:", data);
        }
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  useEffect(() => {
    const filtered = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.username.toLowerCase().includes(search.toLowerCase()) ||
      post.location.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [search, filteredPosts]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (idposts) => {
    try {
      const response = await fetch(
        `http://192.168.142.72:3000/posts/delete/${idposts}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      const updatedPosts = filteredPosts.filter(
        (post) => post.idposts !== idposts
      );
      setFilteredPosts(updatedPosts);
    } catch (error) {
      console.error("Error deleting post:", error);
      
    }
  };

  const handleShowDetails = (post) => {
    setSelectedPost(post);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPost(null);
  };

  return (
    <Box>
      <TextField 
        label="Search Posts" 
        variant="outlined" 
        fullWidth 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Delete</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Average Rating</TableCell>
              <TableCell>Show Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPosts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((post) => (
                <TableRow key={post.idposts}>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(post.idposts)}>Delete</Button>
                  </TableCell>
                  <TableCell>{post.idposts}</TableCell>
                  <TableCell>{post.username}</TableCell>
                  <TableCell>{post.role}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.location}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{post.averageRating.toFixed(1)}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleShowDetails(post)}>Show Details</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPosts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal open={openModal} onClose={handleCloseModal}>
       <Box sx={{ p: 10, flexGrow: 1, overflowY: 'auto' }}>
          {selectedPost && (
            <>
              <Typography variant="h6" gutterBottom>Post Details</Typography>
              <Typography><strong>Title:</strong> {selectedPost.title}</Typography>
              <Typography><strong>Description:</strong> {selectedPost.description}</Typography>
              <Typography variant="h6" gutterBottom>Images</Typography>
              {selectedPost.images.map((image, index) => (
                <img key={index} src={image} alt={`post-${index}`} style={{ width: '100%', marginBottom: '8px' }} />
              ))}
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleCloseModal}>Close</Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default PostsView;
