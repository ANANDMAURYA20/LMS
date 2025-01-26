import React from "react";
import { BsFacebook, BsInstagram, BsTwitter, BsWhatsapp } from "react-icons/bs";

export default function Footer() {
  const curDate = new Date();
  const year = curDate.getFullYear();
  return (
    <footer className="py-12 md:px-16 px-3 bg-slate-100 dark:bg-gray-900 flex md:flex-row flex-col md:justify-between justify-center items-center gap-4">
      <span className="md:text-xl  text-lg font-[600] text-gray-700 dark:text-white">
        Copyright {year} | All Right Reserved Lyceum Digisolutions Pvt Ltd (OPC)
      </span>
      <div className="flex gap-5 items-center">
        <a
          href="#"
          className="md:text-3xl text-xl text-gray-900 dark:text-slate-50 hover:text-gray-500 dark:hover:text-slate-300"
        >
          <BsFacebook />
        </a>
        <a
          href="#"
          className="md:text-3xl text-xl text-gray-900 dark:text-slate-50 hover:text-gray-500 dark:hover:text-slate-300"
        >
          <BsInstagram />
        </a>
        <a
          href="https://api.whatsapp.com/send?phone=+916394499123%20&%20text=Hi%20I%20"
          className="md:text-3xl text-xl text-gray-900 dark:text-slate-50 hover:text-gray-500 dark:hover:text-slate-300"
        >
          <BsWhatsapp />
        </a>
        <a
          href="#"
          className="md:text-3xl text-xl text-gray-900 dark:text-slate-50 hover:text-gray-500 dark:hover:text-slate-300"
        >
          <BsTwitter />
        </a>
      </div>
    </footer>
  );
}
