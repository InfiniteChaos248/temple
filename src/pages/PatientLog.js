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
import {getWord} from '../language';

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
        <h1>{getWord("heading-patient-log", this.props.language)}</h1>

        <TextField
          id="date"
          label={getWord("date", this.props.language)}
          type="date"
          value={this.state.date}
          onChange={this.handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button onClick={this.searchPatient}>{getWord("search-button", this.props.language)}</Button>

        <Button onClick={() => { this.setState({ patientList: this.props.patients, date: moment().format('YYYY-MM-DD') }) }}>{getWord("today-button", this.props.language)}</Button>

        {
          this.state.patientList.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{getWord("date", this.props.language)}</TableCell>
                  <TableCell>{getWord("patient-number", this.props.language)}</TableCell>
                  <TableCell>{getWord("name", this.props.language)}</TableCell>
                  <TableCell>{getWord("age", this.props.language)}</TableCell>
                  <TableCell>{getWord("gender", this.props.language)}</TableCell>
                  <TableCell>{getWord("address", this.props.language)}</TableCell>
                  <TableCell>{getWord("contact", this.props.language)}</TableCell>
                  <TableCell>{getWord("diagnosis", this.props.language)}</TableCell>
                  <TableCell>{getWord("medicine-given", this.props.language)}</TableCell>
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
                        <TableCell>{p.gender !== null ? (p.gender === "M" ? getWord("male", this.props.language) : p.gender === "F" ? getWord("female", this.props.language) : getWord("other", this.props.language)) : ""}</TableCell>
                        <TableCell>{p.address !== null ? p.address : ""}</TableCell>
                        <TableCell>{p.contact !== null ? p.contact : ""}</TableCell>
                        <TableCell>{p.diagnosis !== null ? p.diagnosis : ""}</TableCell>
                        <TableCell>{
                          <ul>
                            {
                              p.medList.map(m => {
                                return (
                                  <li key={m.mid}>{this.props.medicineNames[m.mid][this.props.language]} - {m.qty} {this.props.cats[m.category] ? this.props.cats[m.category].unit[this.props.language] : ""}</li>
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
          ) : (<h6>{getWord("message-no-patients", this.props.language)}</h6>)
        }
      </div>
    );
  }

}

export default PatientLog;