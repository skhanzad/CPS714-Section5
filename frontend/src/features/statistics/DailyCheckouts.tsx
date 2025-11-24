import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import {checkedoutDates} from './DummyData';

const margin = { right: 30 }; //need to do this or else it breaks


export default function DailyCheckouts() {
  return ( //adjust height as needed
    <Box sx={{ width: '100%', height: 500 }}>
      <LineChart
        series={[
          { data: checkedoutDates.checkedOut, label: "Amount Checked Out" },
        ]}
        xAxis={[{ scaleType: 'point', data: checkedoutDates.xLabels }]}
        yAxis={[{ width: 40 }]}
        margin={ { right: 30 }}
      />
    </Box>
  );
}