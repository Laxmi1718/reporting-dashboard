import { useState } from 'react';
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import DownloadIcon from '@mui/icons-material/Download';
import ShieldIcon from '@mui/icons-material/Shield';
import AppsIcon from '@mui/icons-material/Apps';
import PersonIcon from '@mui/icons-material/Person';

const FEATURES = [
  {
    icon: <QueryStatsIcon fontSize="small" />,
    title: 'Real-time Analytics',
    description: 'View live login, training and engagement metrics.',
  },
  {
    icon: <DownloadIcon fontSize="small" />,
    title: 'Export Reports',
    description: 'Download detailed reports for any period in one click.',
  },
  {
    icon: <ShieldIcon fontSize="small" />,
    title: 'Secure & Reliable',
    description: 'Your data is protected with enterprise-grade security.',
  },
  {
    icon: <AppsIcon fontSize="small" />,
    title: 'Multi Application Support',
    description: 'Manage and analyze data across multiple applications.',
  },
];

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = onLogin(username, password);
    setError(ok ? '' : 'Invalid username or password');
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex' }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 15% 15%, rgba(0,194,255,0.35) 0%, transparent 45%), linear-gradient(160deg, #0a1e4d 0%, #061336 55%, #020817 100%)',
          }}
        />

        {/* Left marketing panel */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            width: '46%',
            color: '#ffffff',
            p: { md: 5, lg: 7 },
            gap: 4,
            justifyContent: 'center',
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0a6cff',
              }}
            >
              <InsightsIcon />
            </Box>
            <Typography variant="h6" fontWeight={800}>
              Reporting Dashboard
            </Typography>
          </Stack>

          <Box>
            <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.15, fontSize: { md: '2.1rem', lg: '2.5rem' } }}>
              <Box component="span" sx={{ color: '#4ea1ff' }}>
                Smart
              </Box>{' '}
              Analytics.
              <br />
              <Box component="span" sx={{ color: '#4ea1ff' }}>
                Better
              </Box>{' '}
              Decisions.
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: 'rgba(255,255,255,0.7)', maxWidth: 380 }}>
              Track performance, analyze data and export insightful reports in one place.
            </Typography>
          </Box>

          <Stack spacing={2}>
            {FEATURES.map((feature) => (
              <Stack key={feature.title} direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 1.5,
                    flexShrink: 0,
                    backgroundColor: 'rgba(10, 108, 255, 0.25)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {feature.icon}
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={700}>
                    {feature.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Right form panel */}
        <Box
          sx={{
            position: { xs: 'relative', md: 'absolute' },
            zIndex: 2,
            top: 0,
            right: 0,
            bottom: 0,
            width: { xs: '100%', md: '60%' },
            clipPath: {
              md: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)',
            },
            background: 'linear-gradient(160deg, #f5f8ff 0%, #e9f0ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            flex: { xs: 1, md: 'none' },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: 440,
              backgroundColor: '#ffffff',
              borderRadius: 5,
              boxShadow: '0 30px 60px -20px rgba(2, 8, 23, 0.2)',
              p: { xs: 3.5, sm: 5 },
            }}
          >
            <Stack spacing={3}>
              <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: 'linear-gradient(135deg, #0061FF 0%, #00C2FF 100%)',
                    color: '#ffffff',
                    boxShadow: '0 10px 24px -6px rgba(10, 108, 255, 0.55)',
                  }}
                >
                  <InsightsIcon fontSize="medium" />
                </Box>
                <Typography variant="h5" fontWeight={800}>
                  Welcome Back! 👋
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to continue to Reporting Dashboard
                </Typography>
              </Stack>

              {error && <Alert severity="error">{error}</Alert>}

              <Stack spacing={2}>
                <TextField
                  label="Username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  label="Password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowPassword((v) => !v)}
                            edge="end"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? (
                              <VisibilityOffIcon fontSize="small" />
                            ) : (
                              <VisibilityIcon fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>

              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label={<Typography variant="body2">Remember Me</Typography>}
                />
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600, cursor: 'default' }}>
                  Forgot Password?
                </Typography>
              </Stack>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                sx={{ py: 1.3 }}
              >
                Log In
              </Button>

              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                <PersonIcon fontSize="inherit" sx={{ fontSize: 14 }} />
                <Typography variant="caption">Authorized personnel only</Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
