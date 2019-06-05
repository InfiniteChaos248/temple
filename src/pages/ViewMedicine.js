import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class ViewMedicine extends Component {

  render() {
    return (
      <div>
        <h1>Medicine</h1>
        {
          this.props.meds.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.props.meds.map(m => {
                    return (
                      <TableRow key={m.mid}>
                        <TableCell>{m.mid}</TableCell>
                        <TableCell>{m.name[this.props.language]}</TableCell>
                        <TableCell>{this.props.cats[m.category] ? this.props.cats[m.category].name[this.props.language] : ""}</TableCell>
                        <TableCell>{m.stock} {this.props.cats[m.category] ? this.props.cats[m.category].unit[this.props.language] : ""}</TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          ) : (<h6>No Medicine available in database</h6>)
        }
      </div>
    );
  }

}

export default ViewMedicine;