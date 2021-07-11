import { Button } from '@material-ui/core';
import React from 'react'
import { useCommonStyles } from '../commonStyles';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';

interface Props {

}

export const AddTripButton = (props: Props) => {
    const commonStyle = useCommonStyles();
    const history = useHistory();

    return (
        <div className={commonStyle.flexEndParent}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={()=> history.push("/trip/new")}
            >
                Add Trip
            </Button>
        </div>
    )
}
