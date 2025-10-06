import React, {useEffect} from 'react';
import {useRouter} from "next/router";
import {useContextSelector} from "use-context-selector";
import UserContext from '../../Context/UserContext';

export default function WithAuthComponent({children}) {
  const isAuth = useContextSelector(UserContext, ctx => ctx.state.isAuth);
  // const isAuth = true; 
  const isDoneUserChecking = useContextSelector(UserContext,ctx => ctx.isDoneUserChecking )
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push("/login");
    }
  }, [isAuth])

  if(!isDoneUserChecking){
    return <div className="big_loader_wrap"><span className="big_loader"></span></div>
  }

  return (
    <>
      {
        (isAuth)
          ? children
          : <div></div>
      }
    </>
  )
};
