import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import axios from 'axios';

class PatientLog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      patientList: this.props.patients,
      date: moment().format('YYYY-MM-DD'),
      searchClicked: false
    };
  }

  handleDateChange = (event) => {
    this.setState({ date: event.target.value, searchClicked: false });
  }

  searchPatient = async () => {
    if (this.state.date === moment().format('YYYY-MM-DD')) {
      this.setState({ patientList: this.props.patients, date: moment().format('YYYY-MM-DD') })
    } else if (!this.state.searchClicked) {
      console.log("searching for patients seen on " + this.state.date)
      let request = {}
      request.date = this.state.date
      let response = await axios.post('http://127.0.0.1:5000/patientListByDate', request);
      console.log(response.data)
      this.setState({ patientList: response.data, searchClicked: true })
    }
  }

  render() {
    return (
      <div>
        <h1>Patient Log</h1>

        <TextField
          id="date"
          label="Date"
          type="date"
          value={this.state.date}
          onChange={this.handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button onClick={this.searchPatient}>Search</Button>

        <Button onClick={() => { this.setState({ patientList: this.props.patients, date: moment().format('YYYY-MM-DD') }) }}>Today</Button>

        {
          this.state.patientList.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Patient#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Contact#</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  <TableCell>Medicine Given</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.state.patientList.map(p => {
                    return (
                      <TableRow key={p.id}>
                        <TableCell>{p.date}</TableCell>
                        <TableCell>{p.id}</TableCell>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{p.age}</TableCell>
                        <TableCell>{p.gender !== null ? (p.gender === "M" ? "Male" : p.gender === "F" ? "Female" : "Other") : ""}</TableCell>
                        <TableCell>{p.address !== null ? p.address : ""}</TableCell>
                        <TableCell>{p.contact !== null ? p.contact : ""}</TableCell>
                        <TableCell>{p.diagnosis !== null ? p.diagnosis : ""}</TableCell>
                        <TableCell>{
                          <ul>
                            {
                              p.medList.map(m => {
                                return (
                                  <li key={m.mid}>{m.name} - {m.qty} {this.props.cats[m.category]}</li>
                                )
                              })
                            }
                          </ul>
                        }</TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          ) : (<h6>No patients seen today</h6>)
        }
      </div>
    );
  }

}

export default PatientLog;