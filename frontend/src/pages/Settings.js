import React from 'react';
import { Box, Card, Typography } from '@mui/material';

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="600">
        Settings
      </Typography>
      <Card sx={{ p: 3, mt: 3 }}>
        <Typography>Settings will be implemented here</Typography>
      </Card>
    </Box>
  );
};

export default Settings;
