import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRouter from "./routes/AdminRouter";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import UserLayout from "./layouts/UserLayout/UserLayout";
const AuthLayout = lazy(() => import("./layouts/AuthLayout/AuthLayout.jsx"));
const SignIn = lazy(() => import("./module/Admin/Auth/Signin/SignIn.jsx"));
const SignUp = lazy(() => import("./module/Admin/Auth/Signup/Signup.jsx"));
const Home = lazy(() => import("./module/Admin/Auth/Home/Home.jsx"));
const AirDetails = lazy(() =>
  import("./module/Admin/AirDetails/AirDetails.jsx")
);
const Erros = lazy(() => import("./module/Admin/Auth/Error/Error.jsx"));
const UserInfoLayout = lazy(() =>
  import("./layouts/UserInfoLayout/UserInfoLayout.jsx")
);
const BookingHistory = lazy(() =>
  import("./module/Admin/Auth/BookingHistory/BookingHistory.jsx")
);
const AdminRoomList = lazy(() =>
  import("./module/Admin/AdminRoomList/AdminRoomList.jsx")
);
const AdminAddRoom = lazy(() =>
  import("./module/Admin/AdminAddRoom/AdminAddRoom.jsx")
);
const AdminDescList = lazy(() =>
  import("./module/Admin/AdminDescList/AdminDescList.jsx")
);
const AdminAddDesc = lazy(() =>
  import("./module/Admin/AdminAddDesc/AdminAddDesc.jsx")
);
const AdminUserList = lazy(() =>
  import("./module/Admin/AdminUserList/AdminUserList.jsx")
);
const AdminAddUser = lazy(() =>
  import("./module/Admin/AdminAddUser/AdminAddUser.jsx")
);
const AdminCommentList = lazy(() =>
  import("./module/Admin/AdminCommentList/AdminCommentList.jsx")
);
const BookingLayout = lazy(() =>
  import("./layouts/BookingLayout/BookingLayout.jsx")
);
const UserBookingList = lazy(() =>
  import("./module/Admin/Auth/User/UserBookingList/UserBookingList.jsx")
);
const UserCommentList = lazy(() =>
  import("./module/Admin/Auth/User/UserCommentList/UserCommentList.jsx")
);

function App() {
  return (
    <Suspense
      fallback={
        <div className="d-flex justify-content-center align-items-center">
          <img src="/img/loading.gif" class="img-fluid" alt="" />
        </div>
      }
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="phong-thue/:id" element={<AirDetails />} />
            <Route
              path="user/booking"
              element={
                <ProtectedRoute>
                  <BookingLayout />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/" element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserInfoLayout />} />
            <Route path="booking-list" element={<UserBookingList />} />
            <Route path="comment-list" element={<UserCommentList />} />
          </Route>

          <Route
            path="admin"
            element={
              <AdminRouter>
                <AdminLayout />
              </AdminRouter>
            }
          >
            <Route index element={<UserInfoLayout />} />

            <Route path="booking-list" element={<BookingHistory />} />
            <Route path="comment-list" element={<AdminCommentList />} />

            <Route path="user-list" element={<AdminUserList />} />
            <Route path="add-user" element={<AdminAddUser />} />

            <Route path="room-list" element={<AdminRoomList />} />
            <Route path="add-room" element={<AdminAddRoom />} />

            <Route path="desc-list" element={<AdminDescList />} />
            <Route path="add-desc" element={<AdminAddDesc />} />
          </Route>
          <Route path="*" element={<Erros />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
