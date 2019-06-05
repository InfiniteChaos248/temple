//Dependencies
import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//Styles
import './App.css';
//Components
import ViewMedicine from './pages/ViewMedicine';
import ViewMedicineLog from './pages/ViewMedicineLog';
import NewLog from './pages/NewLog';
import PatientLog from './pages/PatientLog';
import UpdateStock from './pages/UpdateStock';
import MedicineReport from './pages/MedicineReport';

class App extends Component {

  getData = async (tab) => {
    this.state.tabValue = -1;
    let response = await axios.get('http://127.0.0.1:5000/getData');
    let medicines = response.data.medicines;
    let categories = response.data.categories;
    let patients = response.data.patients;
    console.log(medicines)
    console.log(categories)
    console.log(patients)
    let nameMap = {}
    let categoryMap = {}
    medicines.forEach(m => {
      let mid = m.mid
      let name = m.name
      let cat = m.category
      nameMap[mid] = name
      categoryMap[mid] = cat
    });
    console.log(nameMap)
    console.log(categoryMap)
    this.setState({ allMedicine: medicines, medicineNames: nameMap, medicineCategories: categoryMap }, () => {
      this.setState({ allCategories: categories }, () => {
        this.setState({ patientList: patients }, () => {
          this.setState({ tabValue: tab })
        })
      })
    })
  }

  constructor() {
    super();
    this.state = {
      showTabs: true,
      tabValue: -1,
      allMedicine: [],
      patientList: [],
      allCategories: {},
      medicineNames: {},
      medicineCategories: {},
      language: "E"
    }
    this.getData(0);
  }

  toggleLanguage = () => {
    let language = this.state.language;
    this.setState({language: language === "E" ? "T" : "E"})
  }

  render() {
    return (
      <div className="App">
        {
          this.state.showTabs ? (
            <div style={{ width: "20%", float: "left" }}>
              <Tooltip title="Hide"><span style={{ float: "right", cursor: "pointer" }} onClick={() => { this.setState({ showTabs: false }) }}>&lt;</span></Tooltip>
              <div style={{ cursor: "pointer" }} onClick={() => { this.setState({ tabValue: 0 }) }}>New</div>
              <div style={{ cursor: "pointer" }} onClick={() => { this.setState({ tabValue: 1 }) }}>Medicine</div>
              <div style={{ cursor: "pointer" }} onClick={() => { this.setState({ tabValue: 2 }) }}>Medicine Log</div>
              <div style={{ cursor: "pointer" }} onClick={() => { this.setState({ tabValue: 3 }) }}>Patient Log</div>
              <div style={{ cursor: "pointer" }} onClick={() => { this.setState({ tabValue: 4 }) }}>Update Stock</div>
              <div style={{ cursor: "pointer" }} onClick={() => { this.setState({ tabValue: 5 }) }}>Medicine Report</div>

              <Typography component="div">
                <Grid component="label" container alignItems="center" spacing={0}>
                  <Grid item>Tamil</Grid>
                  <Grid item>
                    <Switch
                      checked={this.state.language === "E"}
                      onChange={this.toggleLanguage}
                    />
                  </Grid>
                  <Grid item>English</Grid>
                </Grid>
              </Typography>

            </div>
          ) : (
              <div style={{ float: "left" }}>
                <Tooltip title="Show"><span style={{ float: "right", cursor: "pointer" }} onClick={() => { this.setState({ showTabs: true }) }}>&gt;</span></Tooltip>
              </div>
            )
        }
        <div style={{ width: this.state.showTabs ? "80%" : "100%", float: "right" }}>
          {
            this.state.tabValue === 0 ? <NewLog language={this.state.language} meds={this.state.allMedicine} cats={this.state.allCategories} ptno={this.state.patientList.length} refreshData={this.getData} /> : ""
          }
          {
            this.state.tabValue === 1 ? <ViewMedicine language={this.state.language} meds={this.state.allMedicine} cats={this.state.allCategories} /> : ""
          }
          {
            this.state.tabValue === 2 ? <ViewMedicineLog language={this.state.language} meds={this.state.allMedicine} medicineNames={this.state.medicineNames} medicineCategories={this.state.medicineCategories} cats={this.state.allCategories} /> : ""
          }
          {
            this.state.tabValue === 3 ? <PatientLog language={this.state.language} patients={this.state.patientList} medicineNames={this.state.medicineNames} cats={this.state.allCategories} /> : ""
          }
          {
            this.state.tabValue === 4 ? <UpdateStock language={this.state.language} meds={this.state.allMedicine} cats={this.state.allCategories} refreshData={this.getData} /> : ""
          }
          {
            this.state.tabValue === 5 ? <MedicineReport language={this.state.language} meds={this.state.allMedicine} cats={this.state.allCategories} /> : ""
          }
        </div>
      </div>
    );
  }
}

export default App;
