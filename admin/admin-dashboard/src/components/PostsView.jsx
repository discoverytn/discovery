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
  Typography,
  styled,
} from "@mui/material";

const FullWidthBox = styled(Box)({
  flex: 1,
  height: '100vh',
  padding: '20px',
  boxSizing: 'border-box',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

const FullWidthPaper = styled(Paper)({
  width: '100%',
  marginBottom: '20px',
});

const FullWidthTextField = styled(TextField)({
  width: '100%',
  marginBottom: '20px',
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
    fetch("http://192.168.100.4:3000/posts/explorer/posts")

      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExplorerPosts(data);
        } else {
          console.error("Invalid data format for explorer posts:", data);
        }
      })
      .catch((error) => console.error("Error fetching explorer posts:", error));


    fetch("http://192.168.100.4:3000/posts/business/posts")

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
      const response = await fetch(
        `http://192.168.100.4:3000/posts/delete/${idposts}`,

        {
          method: "DELETE",
        }
      );

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

  const renderTable = (posts, page, handleChangePage, search) => (
    <FullWidthPaper elevation={3}>
      <TableContainer sx={{ width: '100%' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Delete</TableCell>
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
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() =>
                        handleDelete(
                          post.idposts,
                          post.explorer_idexplorer !== null
                        )
                      }
                    >
                      Delete
                    </Button>
                  </TableCell>
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
    <FullWidthBox>
      <Typography variant="h4" gutterBottom align="center">
        Explorer Posts
      </Typography>
      <FullWidthTextField
        label="Search Explorer Posts"
        variant="outlined"
        value={explorerSearch}
        onChange={(e) => setExplorerSearch(e.target.value)}
      />
      {renderTable(
        explorerPosts,
        explorerPage,
        handleChangeExplorerPage,
        explorerSearch
      )}

      <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
        Business Posts
      </Typography>
      <FullWidthTextField
        label="Search Business Posts"
        variant="outlined"
        value={businessSearch}
        onChange={(e) => setBusinessSearch(e.target.value)}
      />
      {renderTable(
        businessPosts,
        businessPage,
        handleChangeBusinessPage,
        businessSearch
      )}
    </FullWidthBox>
  );
}

export default PostsView;
