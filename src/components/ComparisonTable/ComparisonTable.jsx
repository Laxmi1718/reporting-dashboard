import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  Stack,
  Box,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { formatNumber, formatDecimal, formatGrowth, formatSignedPercent } from '../../utils/format';
import { STATUS_COLORS, COMPARISON_HIGHLIGHT, CHART_COLORS } from '../../utils/constants';
import { BASE_METRICS, getComparisonMetrics } from '../../utils/comparisonMetrics';

function formatValue(value, decimals) {
  return decimals === 0 ? formatNumber(value) : formatDecimal(value, decimals);
}

function highlightFor(current, previous) {
  if (current > previous) return COMPARISON_HIGHLIGHT.higher;
  if (current === previous) return COMPARISON_HIGHLIGHT.equal;
  return COMPARISON_HIGHLIGHT.lower;
}

function growthStatusFor(current, previous) {
  if (current === previous) return 'equal';
  return current > previous ? 'higher' : 'lower';
}

const GROWTH_COLOR = {
  higher: STATUS_COLORS.good,
  equal: CHART_COLORS.blue,
  lower: STATUS_COLORS.critical,
};

export default function ComparisonTable({ currentPeriod, previousPeriod, loading }) {
  const metrics = getComparisonMetrics(currentPeriod);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Period Comparison
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Metric</TableCell>
                <TableCell align="right">
                  Current Period{currentPeriod ? ` (${currentPeriod.reportPeriod})` : ''}
                </TableCell>
                <TableCell align="right">
                  Previous Period{previousPeriod ? ` (${previousPeriod.reportPeriod})` : ''}
                </TableCell>
                <TableCell align="right">Difference</TableCell>
                <TableCell align="right">Growth %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(loading ? BASE_METRICS : metrics).map((metric) => {
                if (!currentPeriod || !previousPeriod || loading) {
                  return (
                    <TableRow key={metric.key}>
                      <TableCell>{metric.label}</TableCell>
                      <TableCell align="right">—</TableCell>
                      <TableCell align="right">—</TableCell>
                      <TableCell align="right">—</TableCell>
                      <TableCell align="right">—</TableCell>
                    </TableRow>
                  );
                }

                const current = metric.get(currentPeriod);
                const previous = metric.get(previousPeriod);
                const difference = current - previous;
                const growth = formatGrowth(current, previous);
                const growthStatus = growthStatusFor(current, previous);
                const growthColor = GROWTH_COLOR[growthStatus];

                return (
                  <TableRow key={metric.key} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{metric.label}</TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          px: 1,
                          borderRadius: 1,
                          backgroundColor: highlightFor(current, previous),
                        }}
                      >
                        {formatValue(current, metric.decimals)}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatValue(previous, metric.decimals)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {difference >= 0 ? '+' : ''}
                      {formatValue(difference, metric.decimals)}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Chip
                          size="small"
                          icon={
                            growthStatus === 'equal' ? (
                              <TrendingFlatIcon sx={{ fontSize: 14 }} />
                            ) : growthStatus === 'higher' ? (
                              <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                            ) : (
                              <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                            )
                          }
                          label={formatSignedPercent(growth)}
                          sx={{
                            color: growthColor,
                            backgroundColor: `${growthColor}1a`,
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                              color: growthColor,
                            },
                          }}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
