import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { newRegistrationInfo } from './DummyData';


function createData(userName, FirstbookID, RegistrationDate) {
  return { userName, FirstbookID, RegistrationDate };
}

const rows = newRegistrationInfo.map((info) => createData(info.name, info.firstBookId, info.registrationDate));

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>New User Name</TableCell>
            <TableCell align="right">First&nbsp;Book&nbsp;Id</TableCell>
            <TableCell align="right">Registration&nbsp;Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.userName}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.userName}
              </TableCell>
              <TableCell align="right">{row.FirstbookID}</TableCell>
              <TableCell align="right">{row.RegistrationDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}