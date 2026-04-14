import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const OrderForm = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/orders')} sx={{ mb: 2 }}>
        Back to Orders
      </Button>

      <Typography variant="h4" gutterBottom fontWeight="600">
        Create Order
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography>Order form will be implemented here</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderForm;
