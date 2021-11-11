import { FETCH_ALL, CREATE, UPDATE, DELETE } from '../constants/actionTypes';

export default (posts = [], action) => {
    switch (action.type) {
        case FETCH_ALL:
            return action.payload;
        case 'CREATE':
            return [...posts, action.payload];
        case UPDATE:
            return posts.map((post) => {
                if (post._id === action.payload._id) {
                    return action.payload;
                } else {
                    return post;
                }
            });
        case DELETE:
            return posts.filter((post) => {
                return post._id !== action.payload;
            });
        default:
            return posts;
    }
};