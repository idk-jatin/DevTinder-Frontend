import { signupFields } from "@/constants/authFormFields";
import AuthForm from "../reusables/forms/AuthForm";
import { SignupThunk } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import SignupImage from "../assets/Signupillust.png";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (data) => {
    try {
      const response = await dispatch(SignupThunk(data)).unwrap();
      toast.success(response.message || "Signup Successful");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden items-center ">
      <div className="relative w-full lg:w-full h-48 md:h-full hidden md:block md:visible">
        <img
          src={SignupImage}
          alt="Signup Illustration"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-[rgba(247,231,206,0.4)] z-10" />
      </div>

      <div className="flex items-center justify-center w-full lg:w-1/2 bg-[#fefaf6]  h-screen px-6 sm:px-10 py-12 md:h-fit md:top-[+4%] lg:top-24 lg:py-0 md:absolute lg:right-1/2 lg:bg-transparent lg:pr-40 md:w-1/2 md:rounded-lg md:bg-opacity-90">
        <div className="max-w-md w-full z-20">
          <span className="text-4xl font-semibold tracking-wider text-orange-500 mb-6 block font-mono">
      {"<>AlgoMate"}
          </span>
          <h2 className="text-3xl font-bold  text-gray-900">Get Started</h2>
          <p className="text-sm text-gray-600 mb-8">
            Join us and blossom your journey!
          </p>

          <AuthForm
            fields={signupFields}
            onSubmit={handleSignup}
            title=""
            buttonText="Create Account"
          />

          <div className="mt-4 text-sm text-center text-black">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-800 font-bold">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
