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
import MedicineSelect from './MedicineSelect';
import {getWord} from '../language';

class ViewMedicineLog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      logList: [],
      date: moment().format('YYYY-MM-DD'),
      mid: "",
      todayClicked: false,
      searchClicked: false
    };
  }

  handleDateChange = (event) => {
    this.setState({ date: event.target.value, todayClicked: false, searchClicked: false });
  }

  selectMid = (mid) => {
    this.setState({ mid: mid, todayClicked: false, searchClicked: false })
  }

  handleMidChange = (event) => {
    this.setState({mid: event.target.value, todayClicked: false, searchClicked: false});
  }

  getLog = async () => {
    if (this.state.mid === "") {
      alert(getWord("alert-view-log", this.props.language))
    } else if (this.state.date === moment().format('YYYY-MM-DD')) {
      this.getTodayLog();
    } else if (this.state.searchClicked) {
      //search click optimization => if search is clicked again without changing medicine or date do nothing
      console.log("optimized search clicking")
    } else {
      this.setState({ logList: [], todayClicked: false, searchClicked: true })
      let request = {
        date: this.state.date,
        mid: this.state.mid
      }
      console.log(request)
      let response = await axios.post('http://127.0.0.1:5000/getMedicineLog', request);
      console.log(response.data)
      this.setState({ logList: response.data })
    }
  }

  getTodayLog = async () => {
    if (this.state.mid === "") {
      alert(getWord("alert-view-log", this.props.language))
    } else if (this.state.todayClicked) {
      //today click optimization => if today is clicked again without changing medicine or date do nothing
      console.log("optimized today clicking")
    } else {
      this.setState({ date: moment().format('YYYY-MM-DD'), logList: [], todayClicked: true, searchClicked: false })
      let request = {
        date: moment().format('YYYY-MM-DD'),
        mid: this.state.mid
      }
      console.log(request)
      let response = await axios.post('http://127.0.0.1:5000/getMedicineLog', request);
      console.log(response.data)
      this.setState({ logList: response.data })
    }
  }

  render() {
    return (
      <div>
        <h1>{getWord("heading-medicine-log", this.props.language)}</h1>

        <MedicineSelect language={this.props.language} meds={this.props.meds} cats={this.props.cats} setMid={this.selectMid} mid={this.state.mid} />

        <TextField
          id="mid"
          label={getWord("medicine-id", this.props.language)}
          type="number"
          style={{ width: "10%" }}
          value={this.state.mid}
          onChange={this.handleMidChange}
          InputLabelProps={{
            shrink: true,
          }}
        />

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

        <Button onClick={this.getLog}>{getWord("search-button", this.props.language)}</Button>

        <Button onClick={this.getTodayLog}>{getWord("today-button", this.props.language)}</Button>

        {
          this.state.logList.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{getWord("date", this.props.language)}</TableCell>
                  <TableCell>{getWord("medicine-id", this.props.language)}</TableCell>
                  <TableCell>{getWord("patient-number", this.props.language)}</TableCell>
                  <TableCell>{getWord("medicine-name", this.props.language)}</TableCell>
                  <TableCell>{getWord("medicine-quantity", this.props.language)}</TableCell>
                  <TableCell>{getWord("in-out", this.props.language)}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.state.logList.map( (log, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{log.date}</TableCell>
                        <TableCell>{log.mid}</TableCell>
                        <TableCell>{log.pid === -1 ? getWord("doctor", this.props.language) : log.pid}</TableCell>
                        <TableCell>{this.props.medicineNames[log.mid][this.props.language]}</TableCell>
                        <TableCell>{log.qty} {this.props.cats[this.props.medicineCategories[log.mid]] ? this.props.cats[this.props.medicineCategories[log.mid]].unit[this.props.language] : ""}</TableCell>
                        <TableCell>{log.io ? getWord("received", this.props.language) : getWord("issued", this.props.language)}</TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          ) : (<h6>{getWord("message-no-log", this.props.language)}</h6>)
        }
      </div>
    );
  }

}

export default ViewMedicineLog;