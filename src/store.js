import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import signupReducer from "./slices/signUpSlice";
import infoUserSlice from "./slices/infoUserSlice";
import userListPageSlice from "./slices/userListPageSlice";
import updateUserSlice from "./slices/updateUserSlice";
import adminCreateUser from "./slices/adminCreateUser";
import roomListPageSlice from "./slices/roomListPage";
import updateRoomSlice from "./slices/updateRoomSlice";
import adminCreateRoom from "./slices/adminCreateRoom";
import descListPageSlice from "./slices/descListPageSlice";
import updateDescSlice from "./slices/updateDescSlice";
import adminCreateDesc from "./slices/adminCreateDesc";
import bookingListSlice from "./slices/bookingListSlice";
import updateBookingSlice from "./slices/updateBookingSlice";
import commentListSlice from "./slices/commentListSlice";
import updateCommentSlice from "./slices/updateCommentSlice";
import userCreateBooking from "./slices/userCreateBooking";
import userCreateComment from "./slices/userCreateComment";

const store = configureStore({
  reducer: {
    user: userReducer,
    signup: signupReducer,
    infoUser: infoUserSlice,
    userListPage: userListPageSlice,
    updateUser: updateUserSlice,
    createUser: adminCreateUser,
    roomListPage: roomListPageSlice,
    updateRoom: updateRoomSlice,
    createRoom: adminCreateRoom,
    descListPage: descListPageSlice,
    updateDesc: updateDescSlice,
    createDesc: adminCreateDesc,
    bookingList: bookingListSlice,
    updateBooking: updateBookingSlice,
    commentList: commentListSlice,
    updateComment: updateCommentSlice,
    createBooking: userCreateBooking,
    createComment: userCreateComment,
  },
});

export default store;
