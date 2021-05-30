import { Container } from "@material-ui/core";
import React, { Suspense } from "react";
import { RecoilRoot } from "recoil";
import { TripList } from "./components/TripList";

export const App = () => {
  return (
    <RecoilRoot>
      <Container>
        <Suspense fallback={<div>Loading ...</div>}>
          <TripList />
        </Suspense>
      </Container>
    </RecoilRoot>
  );
};

export default App;
