import { Container } from "@material-ui/core";
import React, { Suspense } from "react";
import { RecoilRoot } from "recoil";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { NewTrip } from "./components/form/NewTrip";
import { EditTrip } from "./components/form/EditTrip";
import { TripDetail } from "./components/trip/TripDetail";
import { NavBar } from "./components/navbar/Navbar";
import { TripList } from "./components/trip/TripList";

export const App = () => {
  return (
    <RecoilRoot>
      <Router>
      <Container>
        <NavBar/>
        <Suspense fallback={<div>Loading ...</div>}>
        <Switch>
          <Route path="/trip/new" component={NewTrip} />
          <Route path="/trip/edit/:id" component={EditTrip} />
          <Route path="/trip/:id" component={TripDetail} />
          <Route path="/" component={TripList} />
          </Switch>
        </Suspense>
      </Container>
      </Router>
    </RecoilRoot>
  );
};

export default App;
