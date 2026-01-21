import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Modal, Spin, Checkbox } from "antd";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { login } from "@/services/site/AuthService";
import { UserContext } from "@/contexts/UserContext";

function LoginModal({
  show,
  handleClose,
  handleBack,
  handleShowSignUpModal,
  handleShowForgotPasswordModal,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không đúng định dạng.";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu cần ít nhất 6 ký tự.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);
      const data = await login(email, password);

      const userDetail = {
        userId: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        avatar: data.user.avatar,
        role: data.user.role,
      };

      updateUser(userDetail);
      toast.success(data.message);

      if (data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        handleCloseModal();
      }
    } catch (error) {

      let errorMessage = "Đã xảy ra lỗi, vui lòng thử lại sau!";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setEmail("");
    setPassword("");
    setErrors({});
  };

  return (
    <Modal
      open={show}
      onCancel={handleCloseModal}
      footer={null}
      centered
      width={500}
      closeIcon={
        <span className="text-gray-400 hover:text-gray-600 text-xl">×</span>
      }
    >
      <div className="pt-2">
        {/* Header */}
        <div className="flex items-center mb-6">
          <ArrowLeftOutlined
            className="text-xl cursor-pointer hover:text-gray-600 transition-colors"
            onClick={handleBack}
          />
          <h2 className="flex-1 text-center text-xl font-bold text-gray-900 pr-6">
            Đăng nhập bằng tài khoản
          </h2>
        </div>

        {/* Body */}
        <div className="px-2">
          <form onSubmit={handleLogin}>
            {errors.form && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                {errors.form}
              </div>
            )}

            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="emailField"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="emailField"
                placeholder="Nhập vào số Email của bạn"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                  }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <div className="text-red-500 text-sm mt-1.5">
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label
                htmlFor="passwordField"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="passwordField"
                  placeholder="Nhập vào mật khẩu của bạn"
                  className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors text-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
              {errors.password && (
                <div className="text-red-500 text-sm mt-1.5">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="text-sm"
              >
                <span className="text-gray-700">Nhớ mật khẩu</span>
              </Checkbox>
              <span
                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors"
                onClick={handleShowForgotPasswordModal}
              >
                Quên mật khẩu?
              </span>

            </div>


            {/* Test accounts - testing only */}
            <div className="mb-6 p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                🔧 Tài khoản dùng để test:
              </p>

              <p className="text-sm text-gray-700">
                <span className="font-medium">Admin:</span>{" "}
                dothanhbao1805@gmail.com / 12345678
              </p>

              <p className="text-sm text-gray-700">
                <span className="font-medium">User:</span>{" "}
                dothanhbao42@gmail.com / 12345678
              </p>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingOutlined className="mr-2" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                Bạn chưa có tài khoản?{" "}
                <span
                  className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors"
                  onClick={handleShowSignUpModal}
                >
                  Đăng ký
                </span>
              </p>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 leading-relaxed">
              Nhấn chọn "Đăng nhập" có nghĩa là bạn đã đọc và đồng ý{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Thỏa thuận quyền riêng tư
              </a>{" "}
              &{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Điều khoản dịch vụ
              </a>
              , đồng thời có nghĩa là bạn xác nhận đã tròn 18 tuổi có thể sử
              dụng dịch vụ của chúng tôi
            </p>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default LoginModal;
