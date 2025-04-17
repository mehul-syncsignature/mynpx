import * as React from "react";
import { cn } from "@/lib/utils";
import { CommonComponetProps } from "../types";

/**
 * A customizable social media banner component
 */
function SocialBanner({
  data,
  commonConfig,
  brandConfig,
  className = "",
}: CommonComponetProps) {
  // Extract values from props for easier access
  const {
    width,
    height,
    fontSize,
    buttonStyle = "square",
    textColor = "white",
    backdropConfig = {
      backdropUrl: "https://i.postimg.cc/WbJNvqnF/img.png",
      backdropPosition: "right center",
    },
  } = commonConfig;
  const {
    primaryColor,
    secondaryColor,
    highlightColor,
    primaryFont,
    secondaryFont,
    highlightFont,
  } = brandConfig;

  const {
    heading,
    description,
    imageUrl,
    imageAlt = "Profile image",
    buttonText,
    communityButtonText = "JOIN OUR COMMUNITY",
    ctaButtonText = "Start Free Trial",
  } = data;

  return (
    <div
      className={cn("relative", className)}
      style={{
        backgroundColor: primaryColor,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div
        className="absolute right-0 w-full h-full"
        style={{
          backgroundImage: `url(${backdropConfig?.backdropUrl})`,
          backgroundSize: "contain",
          backgroundPosition: `${backdropConfig?.backdropPosition}`,
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="relative grid grid-cols-[20%_60%_20%]">
        {/* JOIN OUR COMMUNITY button at top left */}
        <div className={`font-${secondaryFont} pl-[40px] pt-[40px]`}>
          <div
            className={`font-${secondaryFont} py-[10px] px-[16px] text-[16px] w-[231px] h-[44px] ${
              buttonStyle === "rounded" ? "rounded-md" : "rounded-none"
            }`}
            style={{ backgroundColor: secondaryColor, color: textColor }}
          >
            {communityButtonText}
          </div>
        </div>

        {/* Main content container with fixed width */}
        <div className="justify-center h-[199.15px] w-[837px] my-auto grid grid-cols-[60%_40%] gap-[32px]">
          {/* Left content area - titles */}
          <div
            className={`h-[130px] tracking-[-.05em] font-${primaryFont} leading-[100%] font-semibold  text-${textColor} text-right`}
            style={{
              fontSize: `${fontSize?.heading}`,
            }}
          >
            {heading}
          </div>

          {/* Right content area - sub-titles */}
          <div className="grid grid-rows-[65%_35%] w-[342px] h-[199px]">
            <div
              className={`text-left w-[342px] h-[118px] font-${secondaryFont} tracking-[-0.05em] leading-[100%] font-normal text-${textColor}`}
              style={{
                fontSize: `${fontSize?.description}`,
                fontFamily: `DM Sans`
              }}
            >
              {description}
            </div>
            <div className="flex items-end">
              <div
                className={`font-${highlightFont} text-center p-[14.08px] tracking-[-.05em] leading-[100%] text-[24.63px] font-semibold h-[49px] w-[188px] ${
                  buttonStyle === "rounded" ? "rounded-md" : "rounded-none"
                }`}
                style={{ backgroundColor: highlightColor, color: textColor }}
              >
                {ctaButtonText}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Headshot with light effect */}
        <div className="relative h-full overflow-hidden rounded-lg">
          {/* Headshot image */}
          <img
            src={imageUrl}
            alt={imageAlt}
            className="object-cover object-right"
            style={{
              height: `396px`,
              width: `486px`,
              top: "-60px",
              left: "-60px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SocialBanner;
