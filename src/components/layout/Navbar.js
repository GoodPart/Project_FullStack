import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux' 
import PropTypes from 'prop-types'
import MyButton from '../../util/MyButton'
import PostScream from '../scream/PostScream'
//MUI stuff
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

//Icons
// import AddIcon from '@material-ui/icons/Add'
import HomeIcon from '@material-ui/icons/Home'
import Notifications from '@material-ui/icons/Notifications'

export class Navbar extends Component {
    render() {
        const { authenticated  } = this.props
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {/* authenticated 가 ture라면(로그인되어 인증이 되었을 경우) 아래 갑싱 리턴된다. */}
                    {authenticated ? (
                        <Fragment>
                            <PostScream />
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
                        // authenticated 가 false라면(로그인되어 인증이 안되었을 경우) 아래 갑싱 리턴된다.
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
