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
import {getWord} from '../language';

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
            alert(getWord('alert-medicine-report', this.props.language))
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
                <h1>{getWord("heading-medicine-report", this.props.language)}</h1>

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

                <Button onClick={this.generateReport}>{getWord("get-report", this.props.language)}</Button>

                {
                    this.state.reportList.length > 0 ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{getWord("date", this.props.language)}</TableCell>
                                    <TableCell>{getWord("opening-stock", this.props.language)}</TableCell>
                                    <TableCell>{getWord("total-received", this.props.language)}</TableCell>
                                    <TableCell>{getWord("total-issued", this.props.language)}</TableCell>
                                    <TableCell>{getWord("balance", this.props.language)}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.reportList.map((r, i) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell>{r.date}</TableCell>
                                                <TableCell>{r.opening}</TableCell>
                                                <TableCell>{r.received}</TableCell>
                                                <TableCell>{r.issued}</TableCell>
                                                <TableCell>{r.balance}</TableCell>
                                            </TableRow>
                                        )
                                    }
                                    )
                                }
                            </TableBody>
                        </Table>
                    ) : (<h6>{getWord("message-no-report", this.props.language)}</h6>)
                }

            </div>
        )
    }

}

export default (MedicineReport);