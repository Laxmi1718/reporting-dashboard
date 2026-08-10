import { Card, CardContent, Stack, Typography, Box, Skeleton } from '@mui/material';

export default function KpiCard({ icon, label, value, color, accentColor = color ?? '#2a78d6', loading }) {
  const valueText = String(value ?? '');

  return (
    <Card
      sx={{
        height: '100%',
        backgroundColor: `${accentColor}14`,
        border: `1px solid ${accentColor}26`,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ py: 2 }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'flex-start' }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${accentColor}26`,
              color: accentColor,
              flexShrink: 0,
              '& svg': { fontSize: 20 },
            }}
          >
            {icon}
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.78rem', lineHeight: 1.3, minHeight: '2.1em' }}
            >
              {label}
            </Typography>
            {loading ? (
              <Skeleton width={70} height={28} />
            ) : (
              <Typography
                title={valueText}
                fontWeight={700}
                sx={{
                  fontSize: '1.3rem',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {value}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
