import React from 'react';
import { Box, Card, Typography } from '@mui/material';

const SupplierList = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="600">
        Suppliers
      </Typography>
      <Card sx={{ p: 3, mt: 3 }}>
        <Typography>Supplier management will be implemented here</Typography>
      </Card>
    </Box>
  );
};

export default SupplierList;
