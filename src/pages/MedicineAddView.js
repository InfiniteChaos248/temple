import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import MedicineSelect from './MedicineSelect';
import { Button } from '@material-ui/core';
import { getWord } from '../language';

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

class MedicineAddView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mid: "",
            qty: ""
        }
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            mid: "",
            qty: ""
        })
    }

    handleMidChange = (event) => {
        this.setState({ mid: event.target.value })
    }

    handleQtyChange = (event) => {
        this.setState({ qty: event.target.value })
    }

    selectMid = (mid) => {
        this.setState({ mid: mid })
    }

    okClicked = () => {
        if (this.state.qty < 0) {
            alert(getWord('alert-negative-quantity', this.props.language))
        }
        else if (this.state.mid === "" || this.state.qty === "") {
            alert(getWord('alert-medicine-details', this.props.language))
        } else {
            let retObj = {}
            retObj.mid = Number(this.state.mid)
            retObj.qty = Number(this.state.qty)
            this.props.getAdded(retObj)
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <MedicineSelect language={this.props.language} meds={this.props.meds} cats={this.props.cats} setMid={this.selectMid} mid={this.state.mid} />
                <TextField
                    className={classes.textField}
                    style={{ width: "10%" }}
                    value={this.state.mid}
                    onChange={this.handleMidChange}
                    id="med-id"
                    label={getWord("medicine-id", this.props.language)}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <TextField
                    className={classes.textField}
                    style={{ width: "10%" }}
                    value={this.state.qty}
                    onChange={this.handleQtyChange}
                    id="med-qty"
                    label={getWord("medicine-quantity", this.props.language)}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <Button
                    onClick={this.okClicked}
                >{getWord("ok-button", this.props.language)}</Button>
            </div>
        );
    }

}

export default withStyles(styles)(MedicineAddView);