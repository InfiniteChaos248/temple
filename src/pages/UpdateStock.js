import React, { Component } from 'react';
import MedicineAddView from './MedicineAddView';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { Button, Select, MenuItem } from '@material-ui/core';
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
      alert(getWord('alert-negative-quantity', this.props.language))
    }
    else if (this.state.name === "" || this.state.tamilName === "" || this.state.mid === "" || this.state.category === " ") {
      alert(getWord('alert-medicine-details', this.props.language))
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
      alert(getWord('alert-category-details', this.props.language))
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
            <h1>{getWord("heading-new-category", this.props.language)}</h1>
            <div>
              <TextField
                className={classes.textField}
                style={{ width: "40%" }}
                id="eName"
                label={getWord("category-e", this.props.language)}
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
                label={getWord("unit-e", this.props.language)}
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
                label={getWord("category-t", this.props.language)}
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
                label={getWord("unit-t", this.props.language)}
                value={this.state.tUnit}
                onChange={this.handleCatsChange('tUnit')}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />

              <Button onClick={this.addCategory}>{getWord("add-category-button", this.props.language)}</Button>
            </div>

            <Button onClick={this.adminJob1}>{getWord("generate-starting-stock-button", this.props.language)}</Button>

          </form>

        </div>
      </div>
    );
  }

}

export default withStyles(styles)(UpdateStock);