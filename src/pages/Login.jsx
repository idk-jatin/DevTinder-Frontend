import { loginFields } from "@/constants/authFormFields";
import AuthForm from "../reusables/forms/AuthForm";
import { LoginThunk } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import LoginImage from "../assets/Loginillust.png";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const response = await dispatch(LoginThunk(data)).unwrap();
      toast.success(response.message || "Login Successful");
      navigate("/feed");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden items-center">
      <div className="relative w-full lg:w-full h-48 md:h-full hidden md:block md:visible">
        <img
          src={LoginImage}
          alt="Login Illustration"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-[rgba(247,231,206,0.4)] z-10" />
      </div>

      <div className="flex items-center justify-center w-full lg:w-1/2 bg-[#fefaf6] h-screen md:h-fit px-6 sm:px-10 py-12 sm:top-36 lg:py-0 md:absolute lg:left-1/2 lg:bg-transparent lg:pl-40 md:w-1/2 md:rounded-lg md:bg-opacity-90">
        <div className="max-w-md w-full z-20">
          <span className="text-4xl font-semibold tracking-wider text-orange-500 mb-6 block font-mono">
          {"<>AlgoMate"}
          </span>
          <h2 className="text-3xl font-bold  text-gray-900">Welcome back!</h2>
          <p className="text-sm text-gray-600 mb-8">
            Where the blossoms greet your return.
          </p>

          <AuthForm
            fields={loginFields}
            onSubmit={handleLogin}
            buttonText="Log in"
          />

          <div className="mt-4 text-sm text-center text-black">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-800 font-bold">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
