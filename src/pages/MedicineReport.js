import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import MedicineSelect from './MedicineSelect';

class MedicineReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mid: "",
            reportList: [],
            generated: false
        };
    }

    selectMid = (mid) => {
        this.setState({ mid: mid, generated: false })
    }

    handleMidChange = (event) => {
        this.setState({ mid: event.target.value, generated: false });
    }

    generateReport = async () => {
        let request = {};
        request.mid = Number(this.state.mid);
        if(this.state.mid === ""){
            alert("Please select medicine to view report")
            return;
        }
        if(this.state.generated){
            console.log("Optimized for double click")
            return;
        }
        console.log(request)
        let response = await axios.post('http://127.0.0.1:5000/fetchMedicineReport', request);
        console.log(response.data)
        this.setState({ reportList: response.data, generated: true })
    }

    render() {
        return (
            <div>
                <h1>Medicine Report</h1>

                <MedicineSelect meds={this.props.meds} cats={this.props.cats} setMid={this.selectMid} mid={this.state.mid} />

                <TextField
                    id="mid"
                    label="Medicine ID"
                    type="number"
                    style={{ width: "10%" }}
                    value={this.state.mid}
                    onChange={this.handleMidChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <Button onClick={this.generateReport}>Get Report</Button>

                {
                    this.state.reportList.length > 0 ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Opening Stock</TableCell>
                                    <TableCell>Issued</TableCell>
                                    <TableCell>Received</TableCell>
                                    <TableCell>Balance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.reportList.map((r, i) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell>{r.date}</TableCell>
                                                <TableCell>{r.opening}</TableCell>
                                                <TableCell>{r.issued}</TableCell>
                                                <TableCell>{r.received}</TableCell>
                                                <TableCell>{r.balance}</TableCell>
                                            </TableRow>
                                        )
                                    }
                                    )
                                }
                            </TableBody>
                        </Table>
                    ) : (<h6>No reports to show</h6>)
                }

            </div>
        )
    }

}

export default (MedicineReport);