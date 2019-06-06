import React, { Component } from 'react';
import MedicineAddView from './MedicineAddView';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { Button, Select, MenuItem } from '@material-ui/core';
import {getWord} from '../language';

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

class UpdateStock extends Component {

  constructor() {
    super();
    this.state = {
      name: "",
      mid: "",
      stock: 0,
      category: " ",
      eName: "",
      tName: "",
      eUnit: "",
      tUnit: ""
    }
  }

  submit = () => {
    if (this.state.stock < 0) {
      alert('Stock quantity cannot be negative')
    }
    if (this.state.name === "" || this.state.tamilName === "" || this.state.mid === "" || this.state.category === " ") {
      alert('Please enter all the required medicine details')
    } else {
      this.addNewMedicine(this.state);
      this.reset();
    }
  }

  reset = () => {
    this.setState({
      name: "",
      tamilName: "",
      mid: "",
      stock: 0,
      category: " ",
      eNmae: "",
      tName: "",
      eUnit: "",
      tUnit: ""
    })
  }

  handleStockChange = (event) => {
    this.setState({ stock: event.target.value })
  }

  handleMidChange = (event) => {
    this.setState({ mid: event.target.value })
  }

  handleNameChange = (event) => {
    this.setState({ name: event.target.value })
  }

  handleTamilNameChange = (event) => {
    this.setState({ tamilName: event.target.value })
  }

  handleCatsChange = (name) => (event) => {
    this.setState({ [name]: event.target.value })
  }

  handleCategoryChange = event => {
    this.setState({ category: event.target.value });
  };

  addNewMedicine = async (med) => {
    let response = await axios.post('http://127.0.0.1:5000/addNewMedicine', med);
    let responseData = response.data
    alert(responseData.message)
    this.props.refreshData(4);
  }

  updateStock = async (med) => {
    let response = await axios.post('http://127.0.0.1:5000/updateStock', med);
    let responseData = response.data
    alert(responseData.message)
    this.props.refreshData(4);
  }

  addCategory = async () => {
    let request = {}
    request.eName = this.state.eName;
    request.tName = this.state.tName;
    request.eUnit = this.state.eUnit;
    request.tUnit = this.state.tUnit;
    console.log(request)
    if (request.eName !== "" && request.tName !== "" && request.eUnit !== "" && request.tUnit !== "") {
      let response = await axios.post('http://127.0.0.1:5000/admin/addCategory', request);
      let responseData = response.data
      alert(responseData.message)
      this.props.refreshData(4);
    } else {
      alert('Enter all category details')
    }

  }

  adminJob1 = async () => {
    let request = {}
    request["access_code"] = "arjun";
    let response = await axios.post('http://127.0.0.1:5000/admin/triggerJob1', request);
    alert(response.data)
  }

  render() {

    const { classes } = this.props;

    return (
      <div>
        <h1>{getWord("heading-update-stock", this.props.language)}</h1>
        <div style={{ textAlign: "left", paddingLeft: "50px" }}>
          <MedicineAddView language={this.props.language} meds={this.props.meds} cats={this.props.cats} getAdded={this.updateStock} />
        </div>
        <h1>{getWord("heading-add-new-medicine", this.props.language)}</h1>
        <div>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              className={classes.textField}
              id="medicine-name"
              label={getWord("medicine-english-name", this.props.language)}
              margin="normal"
              value={this.state.name}
              onChange={this.handleNameChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              className={classes.textField}
              id="medicine-tName"
              label={getWord("medicine-tamil-name", this.props.language)}
              margin="normal"
              value={this.state.tamilName}
              onChange={this.handleTamilNameChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <div>
              <TextField
                className={classes.textField}
                style={{ width: "10%" }}
                id="medicine-id"
                label={getWord("medicine-id", this.props.language)}
                value={this.state.mid}
                onChange={this.handleMidChange}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
              <TextField
                className={classes.textField}
                style={{ width: "10%" }}
                id="medicine-qty"
                label={getWord("medicine-quantity", this.props.language)}
                value={this.state.stock}
                onChange={this.handleStockChange}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
            </div>
            <div>
              <Select
                style={{ width: "25%" }}
                value={this.state.category}
                onChange={this.handleCategoryChange}
                inputProps={{
                  name: 'category',
                }}
              >
                <MenuItem value=" ">
                  <em>{getWord("select-category", this.props.language)}</em>
                </MenuItem>
                {
                  Object.keys(this.props.cats).map(c => {
                    return (
                      <MenuItem key={c} value={c}>{this.props.cats[c].name[this.props.language]}</MenuItem>
                    );
                  })
                }
              </Select>
            </div>
            <div>
              <Button onClick={this.submit}>{getWord("submit-button", this.props.language)}</Button>
              <Button onClick={this.reset}>{getWord("reset-button", this.props.language)}</Button>
            </div>

            <div>
              <TextField
                className={classes.textField}
                style={{ width: "40%" }}
                id="eName"
                label="Category (English)"
                value={this.state.eName}
                onChange={this.handleCatsChange('eName')}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />

              <TextField
                className={classes.textField}
                style={{ width: "10%" }}
                id="eUnit"
                label="Unit (English)"
                value={this.state.eUnit}
                onChange={this.handleCatsChange('eUnit')}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />

              <TextField
                className={classes.textField}
                style={{ width: "40%" }}
                id="tName"
                label="Category (Tamil)"
                value={this.state.tName}
                onChange={this.handleCatsChange('tName')}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />

              <TextField
                className={classes.textField}
                style={{ width: "10%" }}
                id="tUnit"
                label="Unit (Tamil)"
                value={this.state.tUnit}
                onChange={this.handleCatsChange('tUnit')}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />

              <Button onClick={this.addCategory}>Add Category</Button>
            </div>

            <Button onClick={this.adminJob1}>Update Starting Stock</Button>

          </form>

        </div>
      </div>
    );
  }

}

export default withStyles(styles)(UpdateStock);