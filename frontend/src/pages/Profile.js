import React from 'react';
import { Box, Card, Typography } from '@mui/material';

const Profile = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="600">
        Profile
      </Typography>
      <Card sx={{ p: 3, mt: 3 }}>
        <Typography>User profile will be implemented here</Typography>
      </Card>
    </Box>
  );
};

export default Profile;
