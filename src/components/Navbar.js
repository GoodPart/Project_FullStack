import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux' 
import PropTypes from 'prop-types'
import MyButton from '../util/MyButton'

//MUI stuff
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { Tooltip } from '@material-ui/core';

//Icons
import AddIcon from '@material-ui/icons/Add'
import HomeIcon from '@material-ui/icons/Home'
import Notifications from '@material-ui/icons/Notifications'

export class Navbar extends Component {
    render() {
        const { authenticated  } = this.props
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {authenticated ? (
                        <Fragment>
                            <MyButton tip="Post A Scream!">
                                <AddIcon />
                            </MyButton>
                            <Link to="/">
                            <MyButton tip="Home">
                                <HomeIcon />
                            </MyButton>
                            </Link>
                            <MyButton tip="Notifications">
                                <Notifications />
                            </MyButton>
                        </Fragment>
                    ):(
                        <Fragment>
                            <Button component={Link} to="/login" color="inherit">Login</Button>
                            <Button component={Link} to="/" color="inherit">Home</Button>
                            <Button component={Link} to="signup" color="inherit">Signup</Button>
                        </Fragment>
                            
                    )}
                </Toolbar>
            </AppBar>
        )
    }
}

Navbar.propTypes = {
    authenticated : PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    authenticated : state.user.authenticated
})

export default connect(mapStateToProps)(Navbar)
