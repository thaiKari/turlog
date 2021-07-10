import { Container } from "@material-ui/core";
import React, { Suspense } from "react";
import { RecoilRoot } from "recoil";
import { TripList } from "./components/Trip/TripList";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { NewTrip } from "./components/Trip/NewTrip";
import { EditTrip } from "./components/Trip/EditTrip";

export const App = () => {
  return (
    <RecoilRoot>
      <Router>
      <Container>
        <Suspense fallback={<div>Loading ...</div>}>
        <Switch>
          <Route path="/trip/new" component={NewTrip} />
          <Route path="/trip/edit/:id" component={EditTrip} />
          <Route path="/" component={TripList} />
          </Switch>
        </Suspense>
      </Container>
      </Router>
    </RecoilRoot>
  );
};

export default App;
