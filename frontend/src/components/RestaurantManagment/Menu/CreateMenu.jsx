import React from "react";
import PropTypes from "prop-types";

import {
  withStyles,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  Grid,
  FormControlLabel,
  RadioGroup,
  Radio,
  IconButton,
  FormControl,
  FormLabel,
  Divider,
  TextField
} from "@material-ui/core/";
import { PhotoCamera } from "@material-ui/icons";

import MenuImage from "./MenuImage";
import MenuToolbar from "./MenuToolbar";
import ImageUploader from "./ImageUploader";
import MenuTable from "./MenuTable";

const styles = theme => ({
  root: {
    width: "100%"
  },
  input: { display: "none" },
  resetContainer: {
    padding: theme.spacing.unit * 3,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

function getSteps() {
  return ["Add basic information", "Create an ad group", "Create an ad"];
}

function getStepContent(step, props, menuType, menuName, menuItems) {
  switch (step) {
    case 0:
      return <AddInfo menuName={menuName} menuType={menuType} />;
    case 1:
      return (
        <FillMenu>
          {menuType === "image" ? (
            <Paper>
              <MenuToolbar menuName={menuName} />
              <Divider />
              <ImageUploader />
            </Paper>
          ) : (
            <MenuTable
              menuName={menuName}
              props={props}
              menuItems={menuItems}
            />
          )}
        </FillMenu>
      );
    case 2:
      return (
        <Grid item xs={12}>
          <Typography>
            Try out different ad text to see what brings in the most customers,
            and learn how to enhance your ads using features like ad extensions.
            If you run into any problems with your ads, find out how to tell if
            they're running and how to resolve approval issues.
          </Typography>
        </Grid>
      );
    default:
      return "Unknown step";
  }
}

const AddInfo = props => {
  return (
    <>
      <Grid item xs={12}>
        <Typography gutterBottom>
          For each ad campaign that you create, you can control how much you're
          willing to spend on clicks and conversions, which networks and
          geographical locations you want your ads to show on, and more.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          value={props.menuName}
          name="menuName"
          label="Menu Name"
          fullWidth
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <FormLabel component="legend">Choose menu type:</FormLabel>
          <RadioGroup name="menuType" value={props.menuType}>
            <FormControlLabel
              value="list"
              control={<Radio />}
              label="List menu"
            />
            <FormControlLabel
              value="image"
              control={<Radio />}
              label="Image menu"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
    </>
  );
};

const FillMenu = props => {
  return (
    <>
      <Grid item xs={12}>
        <Typography>
          An ad group contains one or more ads which target a shared set of
          keywords.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {props.children}
      </Grid>
    </>
  );
};

class CreateMenu extends React.Component {
  state = {
    img: "",
    activeStep: 0,
    menuName: "",
    menuType: "list",
    imgSrc: "",
    imgBody: {},
    imgName: "",
    menuItems: []
  };

  _getInitialState = () => {
    const initialState = {
      img: "",
      activeStep: 0,
      menuName: "",
      menuType: "list",
      imgSrc: "",
      imgBody: {},
      imgName: "",
      menuItems: []
    };
    return initialState;
  };

  _resetState = () => {
    this.setState(this._getInitialState());
  };

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleReset = () => {
    this._resetState();
  };

  handleImageChange = e => {
    e.target.files[0] &&
      this.setState({
        imgBody: e.target.files[0],
        imgSrc: URL.createObjectURL(e.target.files[0]),
        imgName: e.target.files[0].name
      });
  };

  handleFormChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    const restId = this.props.restId;
    const img = this.state.imgBody;
    let formData = new FormData();
    formData.append("img", img);
    let data = { name: this.state.menuName, image: "" };

    fetch("http://localhost:6543/api/file", {
      method: "POST",
      headers: {
        "x-auth-token": localStorage.getItem("token")
      },
      body: formData
    })
      .then(response => {
        return response.status >= 200 && response.status < 300
          ? response.json()
          : response.json().then(Promise.reject.bind(Promise));
      })
      .then(response => {
        data["image"] = response;
        fetch(`http://localhost:6543/api/restaurant/${restId}/menu`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token")
          },
          body: JSON.stringify(data)
        })
          .then(response => {
            return response.status >= 200 && response.status < 300
              ? response.json()
              : response.json().then(Promise.reject.bind(Promise));
          })
          .then(response => {
            this.props.onAddMenu(response.data);
          })
          .catch(err => {
            console.log(err);
          });
      })
      .then(
        this.setState(state => ({
          activeStep: state.activeStep + 1
        }))
      )
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { classes, ...props } = this.props;
    const steps = getSteps();
    const {
      imgSrc,
      imgName,
      activeStep,
      menuType,
      menuName,
      menuItems
    } = this.state;

    return (
      <Paper className={classes.root}>
        <form
          onChange={this.handleFormChange}
          onSubmit={this.handleSubmit}
          noValidate
          autoComplete="off"
        >
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Grid container spacing={16} justify="space-between">
                    {getStepContent(
                      index,
                      props,
                      menuType,
                      menuName,
                      menuItems,
                      this.handleImageChange
                    )}
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        fullWidth
                      >
                        Back
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={
                          activeStep === steps.length - 1
                            ? this.handleSubmit
                            : this.handleNext
                        }
                        disabled={menuName.trim().length === 0}
                        fullWidth
                      >
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </Grid>
                  </Grid>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} className={classes.resetContainer}>
              <Typography>
                All steps completed - you&apos;re finished
              </Typography>
              <Button onClick={this.handleReset} className={classes.button}>
                Reset
              </Button>
            </Paper>
          )}
        </form>
      </Paper>
    );
  }
}

CreateMenu.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(CreateMenu);
