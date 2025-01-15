import { useEffect, useState } from "react";
import {
  useForm,
  UseFormRegisterReturn,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface ILogin {
  email: string;
  password: string;
  confirmPassword: string;
}
enum AppThemeEnum {
  DARK = "dark",
  LIGHT = "light",
}

const passwordConfig = {
  max: 10,
  min: 4,
};
const validationSchema = yup.object().shape({
  email: yup.string().email().required("Required"),
  password: yup
    .string()
    .required("Required")
    .min(passwordConfig.min)
    .max(passwordConfig.max),
  confirmPassword: yup
    .string()
    .required("Required")
    .oneOf([yup.ref("password")], "not matching"),
});
type ITextBox = React.InputHTMLAttributes<HTMLInputElement> & {
  register: UseFormRegisterReturn;
};
function PasswordGenerator() {
  const [options, setOptions] = useState([
    {
      id: 0,
      checked: false,
      label: "Include capital letters",
      data: "ABCDEFGHIJKLMNOPQRST",
    },
    {
      checked: false,
      label: "Include small letters",
      id: 1,
      data: "abcdefghijklmnopqrst",
    },
    {
      checked: false,
      label: "Include number",
      id: 2,
      data: "0123456789",
    },
    {
      checked: false,
      label: "Include Special Characters",
      id: 3,
      data: "!@#$%^&*()_+",
    },
  ]);
  const [password, setGeneratedPassword] = useState<null | string>(null);
  const [length] = useState(10);
  const [copied, setCopied] = useState(false);
  const generatePassword = () => {
    let characterSet = "";
    let generatedPassword = "";
    const selectedOptions = options.filter((e) => e.checked);

    selectedOptions.forEach((option) => {
      switch (option.id) {
        case 0: {
          characterSet += options[0].data;
          break;
        }
        case 1: {
          characterSet += options[1].data;
          break;
        }
        case 2: {
          characterSet += options[2].data;
          break;
        }
        case 3: {
          characterSet += options[3].data;
          break;
        }
        default: {
          break;
        }
      }
    });

    const lengthCharacterSet = characterSet.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * lengthCharacterSet);
      generatedPassword += characterSet.charAt(randomIndex);
    }
    return generatedPassword;
  };
  return (
    <div>
      {password && (
        <div className=" bg-blue-200 rounded p-3 flex flex-row items-center justify-between ">
          <div>{password}</div>
          <button
            type="button"
            className=" bg-green-400 hover:bg-green-500 rounded text-sm text-gray-800 px-2 py-1"
            onClick={() => {
              navigator.clipboard.writeText(password);
              setCopied(true);

              setTimeout(() => setCopied(false), 900);
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}

      <div className=" flex flex-row flex-wrap gap-4 mt-6">
        {options.map((option, i) => (
          <div
            key={i}
            onClick={() => {
              const optionState = [...options];
              optionState[i].checked = !optionState[i].checked;
              console.log(optionState);
              setOptions(optionState);
            }}
            className=" text-sm text-gray-800  flex flex-row items-center gap-3"
          >
            <input type="checkbox" checked={option.checked} />
            <label>{option.label}</label>
          </div>
        ))}
      </div>
      <button
        className=" mt-4 py-2 bg-blue-400 rounded text-sm font-semibold text-white px-2"
        type="button"
        onClick={() => {
          setGeneratedPassword(generatePassword());
        }}
      >
        Generate
      </button>
    </div>
  );
}

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: yupResolver(validationSchema),
  });
  console.log({ errors });

  const onSubmit = (e: ILogin) => {
    console.log(e);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", AppThemeEnum.LIGHT);
  }, []);

  const TextBox = (props: ITextBox) => {
    const { className, register, ...restProps } = props;
    return (
      <input
        {...restProps}
        {...register}
        className={` mt-8 font-light border border-gray-200 bg-gray-100 py-2 rounded px-2 text-gray-600 focus:outline-none ${className}`}
      />
    );
  };

  return (
    <section className="login-form w-full flex flex-col min-h-screen  ">
      <label className=" toggle-theme self-end ">
        <input
          type="checkbox"
          onChange={(e) => {
            document.documentElement.setAttribute(
              "data-theme",
              e.target.checked ? AppThemeEnum.DARK : AppThemeEnum.LIGHT
            );
          }}
        />
        <span className=" slider"></span>
      </label>
      <form
        className="md:w-2/6 w-10/12 py-8 px-6 rounded  flex flex-col absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 gap-6"
        action=""
        onSubmit={handleSubmit(onSubmit)}
      >
        <label
          className=" border-b-4 border-blue-600 text-3xl self-center text-gray-700 font-bold"
          htmlFor=""
        >
          Login
        </label>

        <TextBox
          register={register("email", { required: true, min: 4, max: 8 })}
          type="text"
          placeholder="Email"
        />
        <TextBox
          name="password"
          register={register("password", { required: true, min: 4, max: 8 })}
          type="text"
          placeholder="Password"
        />
        <TextBox
          register={register("confirmPassword", {
            required: true,
            min: 4,
            max: 8,
          })}
          type="text"
          placeholder="Confirm Password"
        />
        <input
          type="submit"
          name="submitBtn"
          className=" bg-blue-700 border text-white font-bold rounded p-2 hover:bg-blue-600 cursor-pointer"
        />
        <div className=" text-sm text-gray-500 hover:underline cursor-pointer self-center">
          Forget Password
        </div>

        <PasswordGenerator />
      </form>
    </section>
  );
}

export default Login;
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//       console.log(e);
//       const form = e.target as HTMLFormElement;
//       const userId = (form.elements.namedItem('email') as HTMLInputElement)?.value
//       const password =(form.elements.namedItem('password')as HTMLInputElement)?.value
//       console.log({ userId, password });
//   };
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log({ email, password });
//   };
