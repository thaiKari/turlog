import { Container } from "@material-ui/core";
import React, { Suspense } from "react";
import { RecoilRoot } from "recoil";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { EditTrip } from "./components/Form/EditTrip";
import { NewTrip } from "./components/Form/NewTrip";
import { NavBar } from "./components/NavBar/Navbar";
import { TripDetail } from "./components/Trip/TripDetail";
import { TripList } from "./components/Trip/TripList";
import { IsMobileCalculator } from "./components/IsMobileCalculator";

export const App = () => {
  return (
    <RecoilRoot>
      <Router>
      <Container>
        <NavBar/>
        <IsMobileCalculator/>
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
