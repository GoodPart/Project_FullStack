const { db } = require('../util/admin');

exports.getAllScreams =  (request,response) => {
    db
        .collection('screams')
        .orderBy('createAt', 'desc')
        .get()
        .then((data) => {
            let screams = [];
            data.forEach((doc) => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount,
                    userImage: doc.data().userImage
                });
            });
            return response.json(screams);
        })
        .catch((err) => {
            console.error(err);
            response.status(500).json({ error: err.code });
        });
};

exports.postOneScream = (request, response) => {
    if(request.body.body.trim() === ''){
        return response.status(400).json({ body: '내용을 입력해주세요.' });
    }

    const newScream = {
        body: request.body.body,
        userHandle: request.user.handle,
        userImage: request.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    db
        .collection('screams')
        .add(newScream)
        .then((doc) => {
            const responseScream = newScream;
            responseScream.screamId = doc.id;
            response.json(responseScream);
        })
        .catch((err) => {
            response.status(500).json({error: '어딘가에 문제가 생겼다 다시 확인해주세요.'});
            console.error(err);
        });
};
// Fetch On scream
exports.getScream = (request, response) => {
    let screamData = {};
    db.doc(`/screams/${request.params.screamId}`).get()
        .then((doc) => {
            if(!doc.exists){
                return response.status(404).json({ error: '해당 게시물이 없습니다.' });
            }
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db
                .collection('comments')
                .orderBy('createdAt', 'desc')
                .where('screamId', '==', request.params.screamId)
                .get();
        })
        .then((data) => {
            screamData.comments = [];
            data.forEach((doc) => {
                screamData.comments.push(doc.data());
            });
            return response.json(screamData);
        })
        .catch((err) => {
            console.error(err);
            response.status(500).json({ error: err.code });
        });
};
// Comment on a comment
exports.commentOnScream = (request, response) => {
    if(request.body.body.trim() === '') return response.status(400).json({ comment: '내용을 입력해주세요.' });

    const newComment = {
        body: request.body.body,
        createAt: new Date().toISOString(),
        screamId: request.params.screamId,
        userHandle: request.user.handle,
        userImage: request.user.imageUrl
    };

    db.doc(`/screams/${request.params.screamId}`).get()
        .then((doc) => {
            if(!doc.exists){
                return response.status(404).json({ error: '해당 게시물이 없습니다.' });
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        })
        .then(() => {
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            response.json(newComment);
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({ error: '어떤 문제로 인해 에러가 났습니다. 다시 시도해주세요.' });
        });
};
// like a scream
exports.likeScream = (request, response) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', request.user.handle)
        .where('screamId', '==', request.params.screamId).limit(1);
    
    const screamDocument = db.doc(`/screams/${request.params.screamId}`);

    let screamData;

    screamDocument.get()
        .then((doc) => {
            if(doc.exists){
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get();
            } else {
                return response.status(404).json({ error: '해당 게시물이 없습니다.' });
            }
        })
        .then((data) => {
            if(data.empty){
                return db.collection('likes').add({
                    screamId: request.params.screamId,
                    userHandle: request.user.handle
                })
                .then(() => {
                    screamData.likeCount++;
                    return screamDocument.update({ likeCount: screamData.likeCount });
                })
                .then(() => {
                    return response.json(screamData);
                })
            } else {
                return response.status(400).json({ error: '이미 졸아요 누른 게시물입니다. '});
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(500).json({ error: err.code });
        });
};

exports.unLikeScream = (request, response) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', request.user.handle)
    .where('screamId', '==', request.params.screamId).limit(1);

const screamDocument = db.doc(`/screams/${request.params.screamId}`);

let screamData;

screamDocument.get()
    .then((doc) => {
        if(doc.exists){
            screamData = doc.data();
            screamData.screamId = doc.id;
            return likeDocument.get();
        } else {
            return response.status(404).json({ error: '해당 게시물이 없습니다.' });
        }
    })
    .then((data) => {
        if(data.empty){
            return response.status(400).json({ error: '이미 싫어요 누른 게시물입니다. '});
        } else {
            return db.doc(`/likes/${data.docs[0].id }`)
            .delete()
            .then(() => {
                screamData.likeCount--;
                return screamDocument.update({ likeCount: screamData.likeCount });
            })
            .then(() => {
                response.json(screamData);
            })
        }
    })
    .catch((err) => {
        console.log(err);
        response.status(500).json({ error: err.code });
    });
};
// Delete a scream
exports.deleteScream = (request, response) => {
    const document = db.doc(`/screams/${request.params.screamId}`);

    document.get()
        .then(doc => {
            if(!doc.exists){
                return response.status(404).json({ error: '해당 개시물이 존재하지 않습니다. '});
            }
            if(doc.data().userHandle !== request.user.handle){
                return response.status(403).json({ error: '권한이 없습니다.' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            response.json({ message: '성공적으로 게시물이 삭제되었습니다.' });
        })
        .catch(err => {
            console.log(err);
            return response.status(500).json({ error: err.code });
        });
};