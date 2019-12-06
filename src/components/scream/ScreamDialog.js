import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../util/MyButton";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import CommentForm from "./CommentForm";
//MUI Stuff
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";

//Redux stuff
import { connect } from "react-redux";
import { getScream, clearErrors } from "../../redux/actions/dataActions";

const styles = theme => ({
  ...theme,
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover"
  },
  dialogContent: {
    padding: 20
  },
  closeButton: {
    position: "absolute",
    left: "90%"
  },
  expendButton: {
    position: "absolute",
    left: "90%"
  },
  spinnerDiv: {
    textAlign: "center",
    margin: "50px auto"
  }
});

class ScreamDialog extends Component {
  //해당 컴포넌트의 state값 정의
  state = {
    open: false
  };
  componentDidMount() {
    // if (this.props.openDialog) {
    //   console.log("작동하닝??", this.props.openDialog);
    //   alert("asdasdasd");
    //   this.handleOpen();
    // }
    alert(`힝 : ${this.props.openDialog}`);
  }
  handleOpen = () => {
    this.setState({
      open: true
    });
    //dataActions.js 파일의 getScream에 클릭한 btn에 screamId값을 보내기.
    this.props.getScream(this.props.screamId);
  };
  handleClose = () => {
    this.setState({
      open: false
    });
    this.props.clearErrors();
  };

  render() {
    //render되었을때 this.props를 생략할 수 있도록 미리 정의.
    const {
      classes,
      scream: {
        screamId,
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        userHandle,
        comments
      },
      UI: { loading }
    } = this.props;

    //Dialog컴포넌트의 HTML을 DialogMarkup상수로 만들어 불러올 수 있도록 함.

    const dialogMarkup = loading ? (
      //만약 loading의 값이 true라면(loading 중) CircularProgress(loading spinner)를 가져와라.
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} thickness={2} />
      </div>
    ) : (
      //loading값이 false(로딩 끝)라면, 아래 html을 불러옴.
      <Grid container spacing={16}>
        <Grid item sm={5}>
          {/* img가 있다면 해당 유저의 img를 불러오고 없다면 no-img를 불러온다.*/}
          <img
            src={
              userImage
                ? userImage
                : "https://firebasestorage.googleapis.com/v0/b/socialape-32b84.appspot.com/o/no-img.png?alt=media"
            }
            alt="Profile"
            className={classes.profileImage}
          />
        </Grid>
        <Grid item sm={7}>
          {/* 글씨를 불러옴 유저의 아이디. 그리고 Link를 이용해 해당 유저의 페이지로 이동할 수 있음. */}
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/user/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          {/* dayjs를 이용해 createAt값의 format을 변경해서 작성. */}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          {/* body값 나열. */}
          <Typography variant="body1">{body}</Typography>
          <LikeButton screamId={screamId} />
          <span>{likeCount} likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
        </Grid>

        <hr className={classes.visibleSeparator} />
        <CommentForm screamId={screamId} />
        {/* 코멘트 컴포넌트 */}
        <Comments comments={comments} />
      </Grid>
    );
    return (
      <Fragment>
        {/* 하당 버튼을 삽입. //버튼 생성 */}
        <MyButton
          onClick={this.handleOpen}
          tip="Expand scream"
          tipClassName={classes.expendButton}
        >
          {/* 이건 그냥 아이콘임. */}
          <UnfoldMore color="primary" />
        </MyButton>
        {/* 팝업 창 생성 */}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            {/* 닫기버튼 */}
            <CloseIcon />
          </MyButton>
          {/* 위에서 정의한 dialogMarkup 상수 삽입 */}
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

ScreamDialog.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  getScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  scream: state.data.scream,
  UI: state.UI
});

const mapActionsToProps = {
  getScream,
  clearErrors
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ScreamDialog));
