const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};

exports.validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = '이메일이 비어있습니다. 이메일을 입력하세요.';
  } else if (!isEmail(data.email)) {
    errors.email = '이메일 형식이 맞지 않습니다. 이메일 형식에 맞게 입력하세요.';
  }

  if (isEmpty(data.password)) errors.password = '비밀번호가 비어있습니다. 비밀번호를 입력하세요.';
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = '비밀번호 확인과 비밀번호가 맞지 않습니다. 다시 확인해주세요.';

  if (isEmpty(data.handle)) errors.handle = '아이디가 비어있습니다. 아이디를 확인하세요.';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = '이메일이 비어있습니다. 이메일을 입력하세요.';
  if (isEmpty(data.password)) errors.password = '비밀번호가 비어있습니다. 비밀번호를 입력하세요.';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio; 
  if(!isEmpty(data.website.trim())){
    // https://website.com
    if(data.website.trim().substring(0, 4) !== 'http'){
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }
  if(!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};
