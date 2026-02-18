import { Navigate, Outlet, useParams } from "react-router";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";

import { Footer, Navbar } from "../../../utils/constants";
import { CartSidebar } from "../../../components/customer/CartSidebar";
import { TabNavBar } from "../../../components/customer/TabNavBar";
import { useMediaQuery } from "react-responsive";
import { Activity } from "react";


export function ShopLayout() {
  // const isLoading = useSelector(selectVendorLoading);
  // const isError = useSelector(selectVendorError);
  const isMobile = useMediaQuery({ maxWidth: 767 })

  // if (isLoading) {
  //   return <Spinner />
  // }
  // if (isError) {
  //   return <div className="text-red-500 text-center mt-4">Failed to load  configuration. Please try again later.</div>
  // }

  return (
    <>
      <Navbar styles="bg-navbar  " />
      <CartSidebar />
      <Outlet />
      <Activity mode={isMobile ? "visible" : "hidden"}>
        <TabNavBar />
      </Activity>
      <Footer styles="bg-footer-foreground text-primary" />
    </>
  )
}
