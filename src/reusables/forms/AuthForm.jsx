import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AuthForm({ fields, onSubmit, title, buttonText }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);


  
  return (
    <div className="text-black">
      <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map(
          ({ name, label, type = "text", placeholder, validation }) => (
            <div key={name} className="relative  ">
              {label && (
                <label className="mb-1 font-medium text-gray-800">
                  {label}
                </label>
              )}
              <Input
                id={name}
                className={type === "password" ? "pr-10 placeholder:text-[1rem] text-xl" : "placeholder:text-[1rem] text-xl"}
                type={
                  type === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : type
                }
                placeholder={placeholder}
                {...register(name, validation)}
              />
              {type === "password" && (
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-3 top-7 hover:bg-transparent hover:text-black p-0 h-6 w-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6" />
                  ) : (
                    <Eye className="h-6 w-6" />
                  )}
                </Button>
              )}
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1 px-3">
                  {errors[name]?.message}
                </p>
              )}
            </div>
          )
        )}
        <Button type="submit" className="w-full">
          {buttonText}
        </Button>
      </form>
    </div>
  );
}
