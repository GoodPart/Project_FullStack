const { admin, db } = require('../util/admin');
const config = require('../util/config');
 
const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserDetails, getAuthenticatedUser } = require('../util/validators');

// Signup user
exports.signup = (request, response) => {
    const newUser = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle
    };

    const { valid, errors } = validateSignupData(newUser);

    if(!valid) return response.status(400).json(errors);

    const noImg = 'no-img.png';

    let token, userId;
    db.doc(`/users/${newUser.handle}`)
        .get()
        .then((doc) => {
            if(doc.exists){
                return response.status(400)
                                .json({ handle: '이미 사용중인 아이디 입니다.'});
            } else {
                return firebase
                        .auth()
                        .createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return response.status(201).json({ token });
        })
        .catch((err) => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return response.status(400).json({ email: '이미 사용중인 이메일 입니다.' });
            } else {
                return response.status(500).json({ error: err.code });
            }
        });
};

// log user in
exports.login = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    };

    const { valid, errors } = validateLoginData(user);

    if(!valid) return response.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return response.json({ token });
        })
        .catch((err) => {
            console.error(err);
            // auth/wrong-password
            //auth/user-not-user
            return response.status(403)
                .json({ general: '아이디 또는 비밀번호가 틀렸습니다. 아이디와 비밀번호를 다시 확인하세요.' });
        });
};
// Add user details
exports.addUserDetails = (request, response) => {
    console.log('request.body', request.body);
    let userDetails = reduceUserDetails(request.body);

    db.doc(`users/${request.user.handle}`).update(userDetails)
        .then(() => {
            return response.json({ message: '세부 유저정보가 성공적으로 추가되었습니다.'});
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};
// Get any user's details
exports.getUserDetails = (request, response) => {
    let userData = {};
    db.doc(`/users/${request.params.handle}`).get()
        .then(doc => {
            if(doc.exists){
                userData.user = doc.data();
                return db.collection('screams').where('userHandle', '==', request.params.handle)
                    .orderBy('createdAt', 'desc').get();
            } else {
                return response.status(404).json({ error: '유저를 찾을 수 없습니다.' });
            }
        })
        .then(data => {
            userData.screams = [];
            data.forEach(doc => {
                userData.screams.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    screamId: doc.id
                })
            });
            return response.json(userData);
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code});
        });
};
// Get own user details
exports.getAuthenticatedUser = (request, response) => {
    let userData = {};
    db.doc(`/users/${request.user.handle}`).get()
        .then(doc => {
            if(doc.exists){
                userData.userCredentials = doc.data();
                console.log('db.collection(likes)', db.collection('likes').where('userHandle', '==', request.user.handle).get());
                return db.collection('likes').where('userHandle', '==', request.user.handle).get();
            }
        })
        .then(data => {
            userData.likes = [];
            data.forEach(doc => {
                userData.likes.push(doc.data());
            });
            return db.collection('notifications').where('recipient', '==', request.user.handle)
                .orderBy('createdAt', 'desc').limit(10).get();
        })
        .then(data => {
            userData.notifications = [];
            data.forEach(doc => {
                userData.notifications.push({
                    recipent: doc.data().recipent,
                    sender: doc.data().sender,
                    createdAta: doc.data().createdAt,
                    screamId: doc.data().screamId,
                    type: doc.data().type,
                    read: doc.data().read,
                    notificationsId: doc.id
                });
            });
            return response.json(userData);
        })
        .catch(err => {
            console.log(err);
            return response.status(500).json({ error: err.code });
        });
};
// Upload a profile image for user
exports.uploadImage = (request, response) => {
    const Busboy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new Busboy({ headers: request.headers });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            return response.status(400).json({ error: '잘못된 파일 형식입니다. 파일을 다시 확인하세요.'});
        };

        // my.image.png 확장자 명 따오는거임ㅋ
        const imageExtension = filename.split('.')[filename.split('.').length-1];
        // 124234325.png
        imageFileName = `${Math.round(Math.random()*1000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            metadata: {
                contentType: imageToBeUploaded.mimetype
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${request.user.handle}`).update({ imageUrl });
        })
        .then(() => {
            return response.json({ message: '성공적으로 이미지가 업로드되었습니다.' });
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
    });
    busboy.end(request.rawBody);
};

exports.markNotificationsRead = (request, response) => {
    let batch = db.batch();
    request.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, { read: true });
    });
    batch.commit()
        .then(() => {
            return response.json({ message: '알람을 읽었습니다. '});
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};