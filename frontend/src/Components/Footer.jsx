import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className=" pb-5 w-full xl:w-[90%] ">
      <div className=" flex flex-col md:flex-row items-start md:item-center max-md:px-2 w-full gap-5 ">
        {/* left side */}
        <div>
          <img src={assets.logo} alt="" className=" w-40 sm:w-48" />
          <p className=" text-sm mt-2 w-[90%] md:w-[370px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            qui vel labore cum dolore illo minus, quam cupiditate aspernatur
            tempore saepe debitis ducimus. Quod expedita, ipsam fugit officia,
            incidunt eaque itaque doloremque quas dolore nostrum quisquam quam
            corrupti consequatur necessitatibus!
          </p>
        </div>
        {/* center */}
        <div className=" flex flex-col lg:flex-row lg:gap-20 gap-5 justify-start lg:justify-end w-full">
          <div className=" flex  gap-5 max-md:mt-5 sm:gap-10">
            <div>
              <p className=" text-xl font-semibold underline ">Contact Us</p>
              <p className=" text-sm font-normal text-zinc-800 mt-2">
                Help & Support
              </p>
              <p className=" text-sm font-normal text-zinc-800 mt-1">
                Partner with Us
              </p>
              <p className=" text-sm font-normal text-zinc-800 mt-1">
                Ride with US
              </p>
            </div>
            <div>
              <p className=" text-xl font-semibold underline">Company</p>
              <p className=" text-sm font-normal text-zinc-800 mt-2">Home</p>
              <p className=" text-sm font-normal text-zinc-800 mt-1">Carrers</p>
              <p className=" text-sm font-normal text-zinc-800 mt-1">Team</p>
              <p className=" text-sm font-normal text-zinc-800 mt-1">
                About Us
              </p>
              <p className=" text-sm font-normal text-zinc-800 mt-1">Contact</p>
            </div>
            <div>
              <p className=" text-xl font-semibold underline">Legal</p>
              <p className=" text-sm font-normal text-zinc-800 mt-2">
                Terms & conditions
              </p>
              <p className=" text-sm font-normal text-zinc-800 mt-1">
                Cookie Policy
              </p>
              <p className=" text-sm font-normal text-zinc-800 mt-1">
                Privacy Policy
              </p>
            </div>
          </div>
          {/* right side */}
          <div className=" ">
            <p className=" text-xl font-semibold underline">Available In :</p>
            <p className=" text-sm font-normal text-zinc-800 mt-2">Surat</p>
            <p className=" text-sm font-normal text-zinc-800 mt-1">Ahmedabad</p>
            <p className=" text-sm font-normal text-zinc-800 mt-1">Vadodara</p>
            <p className=" text-sm font-normal text-zinc-800 mt-1">Rajkot</p>
            <p className=" text-sm font-normal text-zinc-800 mt-1">Mumbai</p>
            <p className=" text-sm font-normal text-zinc-800 mt-1">Banglore</p>
            <p className=" text-sm font-normal text-zinc-800 mt-1">
              And more...
            </p>
          </div>
        </div>
      </div>
      <div>
        <hr className=" w-full border border-black m-auto outline-none mt-5" />
        <p className=" text-sm font-normal text-zinc-800 text-center mt-2">
          Copyright 2024 @ QuickBites - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
