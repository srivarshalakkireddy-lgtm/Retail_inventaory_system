import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, Typography, Grid, Avatar, Divider, Chip } from '@mui/material';
import { AccountCircle, Email, Phone, BusinessCenter } from '@mui/icons-material';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom fontWeight="600">
        My Profile
      </Typography>
      
      <Card sx={{ mt: 3, overflow: 'visible', position: 'relative' }}>
        <Box sx={{ height: 120, bgcolor: 'primary.main', borderRadius: '4px 4px 0 0' }} />
        
        <Box sx={{ px: 4, pb: 4, pt: 8, position: 'relative' }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'secondary.main',
              fontSize: '2.5rem',
              position: 'absolute',
              top: -50,
              left: 32,
              border: '4px solid white',
              boxShadow: 2,
            }}
          >
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </Avatar>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" fontWeight="600">
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <BusinessCenter fontSize="small" sx={{ mr: 1 }} />
                {user?.SystemRole?.name || user?.role || 'User'}
              </Typography>
            </Box>
            <Chip 
              label={user?.is_active ? 'Active Account' : 'Inactive'} 
              color={user?.is_active ? 'success' : 'default'} 
              variant="outlined" 
            />
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom fontWeight="600">
            Contact Information
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Email Address
                  </Typography>
                  <Typography variant="body1">{user?.email}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">{user?.phone || 'Not provided'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
                <AccountCircle color="action" sx={{ mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Account ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {user?.id}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default Profile;
