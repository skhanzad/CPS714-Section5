import { BarChart } from '@mui/x-charts/BarChart';
import {popularBooks} from './DummyData';




export default function PopularItems() {
const bookName = popularBooks.map((book) => book.title);
const countCheckedOut = popularBooks.map((book) => book.totalCheckout);

return(
<BarChart
    xAxis={[{ data: bookName }]}
      series={[{ data:countCheckedOut}]}
    height={300}

    />

);

}