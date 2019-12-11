import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/pengsu.jpg';
import axios from 'axios';
import { Link } from 'react-router-dom';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
    ...theme.spreadThis
});

class login extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            loading: false,
            errors: {}
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        axios.post('/login', userData)
            .then((res) => {
                console.log(res.data);
                localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
                this.setState({
                    loading: false
                });
                this.props.history.push('/');
            })
            .catch((err) => {
                this.setState({
                    errors: err.response.data,
                    loading: false
                });
            });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    render() {
        const { classes } = this.props;
        const { errors, loading } = this.state;

        return (
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img src={AppIcon} alt="pengsu" className={classes.image}/>
                    <Typography variant="h2" className={classes.pageTitle}>
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField 
                            id="email" 
                            name="email" 
                            type="email" 
                            label="이메일" 
                            className={classes.textField}
                            value={this.state.email} 
                            onChange={this.handleChange} 
                            helperText={errors.email} 
                            error={errors.email ? true : false} 
                            fullWidth
                        />
                        <TextField 
                            id="password" 
                            name="password" 
                            type="password" 
                            label="비밀번호" 
                            className={classes.textField}
                            value={this.state.password} 
                            onChange={this.handleChange} 
                            helperText={errors.password} 
                            error={errors.password ? true : false} 
                            fullWidth
                        />
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            label="로그인" 
                            className={classes.button}
                            disabled={loading}
                        >
                            로그인
                            {loading && (
                                <CircularProgress size={30} className={classes.progress}/>
                            )}
                        </Button>
                        <br/>   
                        <small>
                            아이디가 없으신가요? <Link to="/signup"> ☞회원가입하러 가기 </Link>
                        </small>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        );
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(login);