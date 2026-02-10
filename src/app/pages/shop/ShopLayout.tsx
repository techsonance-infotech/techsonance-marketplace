import { Navigate, Outlet, useParams } from "react-router";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Spinner } from "../../../components/ui/spinner";
import { Footer, Navbar } from "../../../utils/constants";
import { CartSidebar } from "../../../components/customer/CartSidebar";


export function ShopLayout() {
  // const isLoading = useSelector(selectVendorLoading);
  // const isError = useSelector(selectVendorError);

  // if (isLoading) {
  //   return <Spinner />
  // }
  // if (isError) {
  //   return <div className="text-red-500 text-center mt-4">Failed to load  configuration. Please try again later.</div>
  // }

  return (
    <>
      <Navbar  styles="bg-navbar  " />
      <CartSidebar />
      <Outlet />
      <Footer styles="bg-footer-foreground text-primary" />
    </>
  )
}
