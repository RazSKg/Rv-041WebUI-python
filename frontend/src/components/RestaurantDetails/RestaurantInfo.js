import React from "react";
import {
  withStyles,
  Card,
  Divider,
  Typography,
  CardContent,
} from "@material-ui/core/";
import AddUpdateRestaurant from "../Profile/AddUpdateRestaurant";

const styles = {
  root: {
    paddingLeft: 24,
    paddingRight: 24,
  },
};

class RestaurantInfo extends React.Component {
  render() {
    const { classes, restInfo, onUpdate } = this.props;
    return (
      <div className={classes.root}>
        <Card>
          <CardContent>
            <div
              style={{
                width: "300px",
                height: "300px",
                backgroundColor: "#fafafa",
                float: "left",
                marginRight: "16px",
              }}
              className="gallery"
            />
            <div className="content">
              <Typography gutterBottom variant="h4">
                {restInfo.name}
              </Typography>
              <Typography gutterBottom variant="h6" component="p">
                Address: {restInfo.address_id} <br />
                Phone: {restInfo.phone}
              </Typography>
              <Divider style={{ marginBottom: "2em" }} />
              <Typography variant="body1" gutterBottom component="p">
                {restInfo.description}
              </Typography>
            </div>
          </CardContent>
        </Card>
        <AddUpdateRestaurant
          requestType="put"
          onUpdate={onUpdate}
          id={restInfo.id}
          restInfo={this.props.restInfo}
        />
      </div>
    );
  }
}

export default withStyles(styles)(RestaurantInfo);
