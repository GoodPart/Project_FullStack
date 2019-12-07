let db = {
    users: [
        {
            userId: '2y9fMwRG0xcCQXyL9NPkXBDkBjL2',
            email: 'tesuser4@gmail.com',
            createdAt: '2019-12-02T05:41:13.490Z',
            handle: 'testuser4',
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/socialapp-ee961.appspot.com/o/426473594.jpg?alt=media',
            website: 'http://google.com',
            location: 'suwon',
            bio: 'man'
        }
    ],
    screams: [
        {
            userHandle: 'testuser4',
            body: 'this is the scream body',
            createdAt: '2019-11-18T05:26:45.423Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'testuser4',
            screamId: 'StOXZjJDN2NbCtxzmMEC',
            body: 'Hello!!!',
            createdAt: '2019-12-02T05:26:45.423Z'
        }
    ],
    notifications: [
        {
          recipient: 'user',
          sender: 'john',
          read: 'true | false',
          screamId: 'kdjsfgdksuufhgkdsufky',
          type: 'like | comment',
          createdAt: '2019-03-15T10:59:52.798Z'
        }
      ]
};
const userDetails = {
    // Redux data
    credentials: {
        userId: '2y9fMwRG0xcCQXyL9NPkXBDkBjL2',
        email: 'tesuser4@gmail.com',
        createdAt: '2019-12-02T05:41:13.490Z',
        handle: 'testuser4',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/socialapp-ee961.appspot.com/o/426473594.jpg?alt=media',
        website: 'http://google.com',
        location: 'suwon',
        bio: 'man'
    },
    likes: [
        {
            userHandle: 'user',
            screamId: ''
        },
        {
            userHandle: 'user',
            screamId:
        }
    ]
}