import React from 'react';
import { Box, Card, Typography } from '@mui/material';

const Reports = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="600">
        Reports & Analytics
      </Typography>
      <Card sx={{ p: 3, mt: 3 }}>
        <Typography>Reports and analytics will be implemented here</Typography>
      </Card>
    </Box>
  );
};

export default Reports;
