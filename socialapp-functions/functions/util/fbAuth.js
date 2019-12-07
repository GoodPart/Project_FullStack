const { admin, db } = require('./admin');

module.exports = (request, response, next) => {
    let idToken;

    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer ')){
        idToken = request.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('token을 찾을 수 없습니다.');
        return response.status(403).json({ error: '권한이 없습니다 '});
    }

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            request.user = decodedToken;
            return db.collection('users')
                .where('userId', '==', request.user.uid)
                .limit(1)
                .get();
        })
        .then((data) => {
            request.user.handle = data.docs[0].data().handle;
            request.user.imageUrl = data.docs[0].data().imageUrl;
            return next();
        })
        .catch((err) => {
            console.error('토큰문제로 에러가 생겼습니다.', err);
            return response.status(403).json(err);
        });
};