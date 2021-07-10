import { makeStyles } from "@material-ui/core";

export const useCommonStyles = makeStyles((theme) =>({
    centeredParent: {
      display:'flex',
      justifyContent:'center'
    },
    flexEndParent: {
        display:'flex',
        justifyContent:'flex-end',
        marginRight: theme.spacing(2)
      }
  }));