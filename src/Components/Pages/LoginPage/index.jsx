import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useContextSelector } from "use-context-selector";
import UserContext from "../../../Context/UserContext";
import { useRouter } from "next/router";
import AuthProvider from "../../../Data/AuthProvider";
import { toast } from "react-toastify";

const LoginPage = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
      } = useForm();
      const { isAuth, user: currentUser } = useContextSelector(
        UserContext,
        (ctx) => ctx.state
      );
      const loginContext = useContextSelector(
        UserContext,
        (ctx) => ctx.actions.login
      );
      const router = useRouter();
      const [loading, setLoading] = useState(false);
    
      useEffect(() => {
        console.log(currentUser);
        console.log(isAuth);
        if (isAuth) {
            router.replace("/dashboard");
        }
      }, [isAuth, currentUser]);
    
      const onSubmit = (values) => {
        const body = { username: values.name, password: values.password };
        setLoading(true);
        // router.replace("/dashboard");
        AuthProvider.login(body)
          .then(({ data }) => {
            if (data.access) {
              localStorage.setItem("access", data.access);
            }
            if (data.refresh) {
              localStorage.setItem("refresh", data.refresh);
            }
            // localStorage.setItem("token", data.access);
            loginContext(data);
          })
          .catch((err) => {
            if (err.response && err.response.status === 401) {
              logout();
              router.replace("/login");  
            } else {
              toast.error(err?.response?.data?.error[0]);
              
            }
          })
          .finally(() => {
            setLoading(false);
          });
      };

  return (
    <div>
      <div
        className="auth-layout-wrap"
        style={{ backgroundImage: "url(/images/loginBanner.jpg)" }}
      >
        <div className="auth-content">
          <div className="card o-hidden">
            <div className="row">
              <div className="col-md-12">
                <div className="p-4">
                  <div className="auth-logo text-center mb-4">
                    <img style={{width:'150px', height:'auto'}}  src="/icons/logo.svg" alt="" />
                    
                  </div>
                  <h1 className="mb-3 text-18">Kirish</h1>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                      <label for="username">Foydalanuvchi nomi</label>
                      <input
                        className="form-control form-control-rounded"
                        {...register("name", { required: true })}
                        id="username"
                        type="text"
                      />
                    </div>
                    <div className="form-group">
                      <label for="password">Parol</label>
                      <input
                        className="form-control form-control-rounded"
                        {...register("password", { required: true })}
                        id="password"
                        type="password"
                      />
                    </div>
                    <button className="btn btn-rounded btn-primary btn-block mt-2">
                      Kirish
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
