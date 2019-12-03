import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import MyButton from '../../util/MyButton'

//redux stuff
import { connect } from 'react-redux'
import { editUserDetails} from '../../redux/actions/userActions'

//MUI stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

//Icons
import EditIcon from '@material-ui/icons/Edit'


const styles = (theme) => ({
    ...theme,
    button : {
        float: 'right'
    }
})

class EditDetails extends Component {
    //이 컴포넌트에서 사용될 스테이트 명시
    state = {
        bio: '',
        website : '',
        location: '',
        open: false
    };
    //해당 함수를 이용, 로그인 한 ID의 credentials값을 props로 받아 state값 재정의.
    mapUserDetailsToState = (credentials) => { 
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : ''
        });
    }

    //해당 함수를 이용, open의 state값을 true전환.
    handleOpen = () => {
        this.setState({
            open: true
        })
        this.mapUserDetailsToState(this.props.credentials);
    }
    //해당 함수를 이용, open의 state값을 false전환.
    handleClose = () => {
        this.setState({
            open: false
        })
    }

    //컴포넌트가 마운트 되었을때, props값을 credentials상수에 삽입, 그리고 mapUserDetailsToState에 그 값을 넘김. 결론적으로 json값의 유저 정보가서 Input에 사용자의 정보가 적어짐.
    componentDidMount() {
        const { credentials } = this.props
        this.mapUserDetailsToState(credentials);
    }

    //Dialog의 input이 변경될때마다, 해당 값을 저장 및 변경.    
    handleChange = (event)=> {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    //submit이벤트 발생시 handleChange함수에서 받은 userDetails상수의 bio, website, location값으로 변경.
    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location,
        };
        //userActions(actions/userActions.js의 함수)의 editUserDetails함수를 가져와 실행.
        //마지막 종료.
        this.props.editUserDetails(userDetails);
        this.handleClose();
    }


    render() {

        const {classes} = this.props // 빠른 사용.

        return (
            <Fragment>
                <MyButton tip="Edit details" onClick={this.handleOpen} btnClassName={classes.button}>
                    <EditIcon color="primary" />
                </MyButton>
                <Dialog
                open={this.state.open}//edit 아이콘을 클릭시 handleOpen함수를 통해 state: open:true로 변경됨에 따라 해당 Dialog값, open도 true로 변경됨. 결론적으로 열림.
                onClose={this.handleClose}//이건 뭐 닫기지 ㅇㅇ
                fullWidth
                maxWidth="sm">
                    <DialogTitle>나를 바꿔방 L(ㅇ_ㅇ)ㄱ</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                            name="bio"
                            type="text"
                            label="Bio"
                            multiline
                            rows="3"
                            placeholder="A short bio about yerself"
                            className={classes.TextField}
                            value={this.state.bio} //여기의 값은 현제 state의 bio값.
                            onChange={this.handleChange}//handleChange될떄마다 값이 현제 state에 저장됨.
                            fullWidth
                            />
                            <TextField
                            name="website"
                            type="text"
                            label="Website"
                            placeholder="your personal/professional website"
                            className={classes.TextField}
                            value={this.state.website}
                            onChange={this.handleChange}
                            fullWidth
                            />
                            <TextField
                            name="location"
                            type="text"
                            label="Location"
                            placeholder="where you live"
                            className={classes.TextField}
                            value={this.state.location}
                            onChange={this.handleChange}
                            fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancle
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}
// (해당 클래스이름).propTypes = {}
EditDetails.propTypes = {
    editUserDetails : PropTypes.func.isRequired,
    classes : PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
})

export default connect(mapStateToProps, {editUserDetails})(withStyles(styles)(EditDetails))
