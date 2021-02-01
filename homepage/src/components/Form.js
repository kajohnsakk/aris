import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import logo from '../assets/logo.png';
import Grid from '@material-ui/core/Grid';
import Brochure1 from '../assets/Brochure_ARIS-3-cr-01.png';
import Brochure2 from '../assets/Brochure_ARIS-3-cr-02.png';
import { Button } from '@material-ui/core';
import { renderComponent } from 'recompose';



const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },

    button: {
        backgroundColor: '#EC3390',
        '&:hover': {
            backgroundColor: '#f379b6',
        }
    }
});

// clickButton = () => {
//     const url = 'https://docs.google.com/forms/d/e/1FAIpQLSf-J5UHym3veBuWxIJlRXxuxsXKqouKgoi41tbqHa7PfKGWwQ/viewform?usp=pp_url'
//         window.open(url, "_blank")
//     }


function Form(props) {
    const { classes } = props;
    
    return (
        <div className={classes.root}>
            <br/>
            <br/>
            <div align='center' style = {{paddingLeft: '10'}}>
                <img align = 'left' style={{flex: 1, width: '10%', height: undefined }} src={logo} alt="logo" />
                <Button size = 'large' variant="contained" color="primary" className={classes.button}
                    // onClick= "window.location.href= 'https://docs.google.com/forms/d/e/1FAIpQLSf-J5UHym3veBuWxIJlRXxuxsXKqouKgoi41tbqHa7PfKGWwQ/viewform?usp=pp_url'"
                    a href={'https://docs.google.com/forms/d/e/1FAIpQLSf-J5UHym3veBuWxIJlRXxuxsXKqouKgoi41tbqHa7PfKGWwQ/viewform?usp=pp_url'}
                >
                   กดเพื่อลงทะเบียน
             </Button>
             
                <img align='right' style={{ flex: 1, width: '10%', height: undefined, visibility:'hidden' }} src={logo} alt="logo" />
                <br />
             </div>
            <br />
            <br />

            {/* <Grid container spacing={24}>
                <Grid item xs={12} > */}
                <div align = 'center'>
                <img style={{  flex: 1, width: '50%', height: undefined}} src={Brochure1} alt="Brochure1" />
                </div>
                   
                    {/* <Paper className={classes.paper}>xs=6</Paper> */}
                {/* </Grid>
                <Grid item xs={12}> */}
                    <div align = 'center'>                   
                 <img className='text-center' style={{ flex: 1, width: '50%', height: undefined }} src={Brochure2} alt="Brochure2" />
                </div>
                    {/* <Paper className={classes.paper}>xs=6</Paper> */}
                {/* </Grid>
             </Grid> */}
            <br />
            <br />
            <div align='center'>
                <img align='left' style={{ flex: 1, width: '10%', height: undefined, visibility:'hidden' }} src={logo} alt="logo" />
                <Button size = 'large' variant="contained" color="primary" className={classes.button}
                    a href={'https://docs.google.com/forms/d/e/1FAIpQLSf-J5UHym3veBuWxIJlRXxuxsXKqouKgoi41tbqHa7PfKGWwQ/viewform?usp=pp_url'}
                >
                    กดเพื่อลงทะเบียน
             </Button>
                <img align='right' style={{ flex: 1, width: '10%', height: undefined, visibility: 'hidden' }} src={logo} alt="logo" />

            </div>
            <br />
            <br />
        </div>
    );
}
Form.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Form);
