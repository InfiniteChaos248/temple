import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';

import MedicineAddView from './MedicineAddView';

const styles = theme => ({
    container: {
        display: 'block',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

class NewLog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            num: this.props.ptno+1,
            name: "",
            age: "",
            show: false,
            medList: []
        }
    }

    submit = async () => {
        if (this.state.name === "" || this.state.age === "" || this.state.medList.length === 0) {
            alert('Please enter patient details and add medicine')
        } else {
            let response = await axios.post('http://127.0.0.1:5000/newPatientLog', this.state)
            console.log(response.data)
            alert(response.data.message)
            this.props.refreshData(0);
            this.reset();
        }
    }

    reset = () => {
        this.setState({
            num: this.props.ptno+1,
            name: "",
            age: "",
            show: false,
            medList: []
        })
    }

    getMedFromMid = (mid) => {
        let ret = {}
        this.props.meds.forEach(m => {
            if (m.mid === mid) {
                ret = m;
            }
        })
        return ret;
    }

    newMeds = (med) => {
        let medicine = this.getMedFromMid(med.mid);
        medicine["qty"] = med.qty
        this.setState({ medList: [...this.state.medList, medicine], show: false })
    }

    handleAgeChange = (event) => {
        this.setState({ age: event.target.value })
    }

    handleNameChange = (event) => {
        this.setState({ name: event.target.value })
    }

    handleChange = name => value => {
        this.setState({
            [name]: value,
        });
    };

    toggleAdd = () => {
        this.setState((state, props) => {
            return ({ show: !state.show });
        })
    }

    render() {

        const { classes } = this.props;

        return (
            <div>
                <span style={{ float: "right", paddingRight: "10px" }}>{moment().format('ddd, MMM DD YYYY')}</span>
                <h1>New</h1>
                <div style={{ paddingLeft: "50px", textAlign: "left" }}>
                    <h3>#{this.state.num}</h3>
                    <form className={classes.container} noValidate autoComplete="off">
                        <TextField
                            className={classes.textField}
                            id="patient-name"
                            label="Patient Name"
                            placeholder="Enter Patient Name"
                            margin="normal"
                            value={this.state.name}
                            onChange={this.handleNameChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            className={classes.textField}
                            style={{ width: "10%" }}
                            id="patient-age"
                            label="Age"
                            value={this.state.age}
                            onChange={this.handleAgeChange}
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                        />
                        <div>
                            <ul>
                                {
                                    this.state.medList.map((m, i) => {
                                        return (
                                            <li key={i}>{m.name} - {m.qty} {m.unit}</li>
                                        );
                                    })
                                }
                            </ul>
                            {
                                this.state.show ? (<MedicineAddView meds={this.props.meds} getAdded={this.newMeds} cats={this.props.cats} />) : ("")
                            }
                        </div>
                        <div>
                            <Button onClick={this.toggleAdd}>{this.state.show ? "Cancel" : "Add Medicine"}</Button>
                        </div>
                        <div>
                            <Button onClick={this.submit}>Submit</Button>
                            <Button onClick={this.reset}>Reset</Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}

export default withStyles(styles)(NewLog);