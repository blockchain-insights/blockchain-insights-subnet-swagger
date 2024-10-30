import { cn } from "../../utils/cn";
import React from "react";

export default function Title() {
  return (
    <span className="flex items-center justify-left">
      <ArrowTopRight className="w-[44px] md:w-[90px] lg:w-[95px] xl:w-[95px] mt-5" />
      <span className="colorful-text2 sm:text-[44px] xsm:text-[44px] text-[90px] font-trap">
        Chain Insights API
      </span>
    </span>
  );
}

const ArrowTopRight = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 90 90"
      fill="none"
      className={cn("w-[44px] md:w-[90px] lg:w-[90px]", props.className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.7013 6.0382H70.3449V58.6818H61.4813V21.1694L13.6033 69.0474L7.33576 62.7798L55.2138 14.9018L17.7013 14.9018L17.7013 6.0382Z"
        fill="url(#paint0_linear_2247_538)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2247_538"
          x1="-12.0257"
          y1="38.4772"
          x2="76.1126"
          y2="81.6527"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2DDA6" />
          <stop offset="1" stopColor="#887A55" />
        </linearGradient>
        <linearGradient
          id="paint0_linear_2247_537"
          x1="12.5049"
          y1="11.6909"
          x2="6.85052"
          y2="-2.82808"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2DDA6" />
          <stop offset="1" stopColor="#887A55" />
        </linearGradient>
        <linearGradient
          id="paint0_linear_2247_536"
          x1="0.495145"
          y1="1.30909"
          x2="6.14948"
          y2="15.8281"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2DDA6" />
          <stop offset="1" stopColor="#887A55" />
        </linearGradient>
      </defs>
    </svg>
  );
};
