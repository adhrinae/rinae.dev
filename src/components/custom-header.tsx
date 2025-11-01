import React from "react";
import Logo from "@/components/logo";

const CustomHeader = async () => {
  return (
    <div className="custom-header flex items-center justify-between mb-10">
      <div className="flex items-center gap-2">
        <Logo />
        <span className="font-bold">Read, Think and Code</span>
      </div>
    </div>
  );
};

export default CustomHeader;
