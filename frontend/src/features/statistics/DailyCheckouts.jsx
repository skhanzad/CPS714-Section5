import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import {checkedoutDates} from './DummyData';

const margin = { right: 24 };


export default function DailyCheckouts() {
  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <LineChart
        series={[
          { data: checkedoutDates.checkedOut, label: "Amount Checked Out" },
        ]}
        xAxis={[{ scaleType: 'point', data: checkedoutDates.xLabels }]}
        yAxis={[{ width: 50 }]}
        margin={margin}
      />
    </Box>
  );
}