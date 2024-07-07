import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const products = [
  { name: 'iPhone 14 Pro Max', price: '$1,099.00', stock: 524 },
  { name: 'Apple Watch S8', price: '$799.00', stock: 320 },
];

function ProductsSection() {
  return (
    <Box sx={{ flexBasis: '50%', pr: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Products</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Products</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.name}>
                <TableCell component="th" scope="row">
                  {product.name}
                  <Typography variant="caption" display="block">
                    {product.stock} in stock
                  </Typography>
                </TableCell>
                <TableCell align="right">{product.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ProductsSection;