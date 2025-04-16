import * as React from "react";
import { Button } from "@/components/ui/button";

// Define prop types for the component
interface SocialBannerData {
  heading: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  buttonText: string;
  communityButtonText?: string;
  ctaButtonText?: string;
}

interface SocialBannerCommonConfig {
  width: number;
  height: number;
  buttonStyle?: "rounded" | "square";
  fontSize?: {
    heading?: string;
    description?: string;
    button?: number;
  };
  textColor?: string;
}

// Match the existing BrandConfigState interface
interface BrandConfig {
  primaryColor: string;
  secondaryColor: string;
  highlightColor: string;
  primaryFont: string;
  secondaryFont: string;
  highlightFont: string;
}

interface SocialBannerProps {
  data: SocialBannerData;
  commonConfig: SocialBannerCommonConfig;
  brandConfig: BrandConfig;
  className?: string;
}

/**
 * A customizable social media banner component
 */
function SocialBanner({
  data,
  commonConfig,
  brandConfig,
  className = "",
}: SocialBannerProps) {
  // Extract values from props for easier access
  const {
    width,
    height,
    fontSize,
    buttonStyle = "square",
    textColor = "white",
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
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: primaryColor,
      }}
    >
      <div className="grid grid-cols-[20%_60%_20%]">
        {/* JOIN OUR COMMUNITY button at top left */}
        <div className={`font-${secondaryFont} pl-[40px] pt-[40px]`}>
          <Button
            className={`font-${secondaryFont} py-[10px] px-[16px] text-[16px] w-[231px] h-[44px] ${
              buttonStyle === "rounded" ? "rounded-md" : "rounded-none"
            }`}
            style={{ backgroundColor: secondaryColor, color: textColor }}
          >
            {communityButtonText}
          </Button>
        </div>

        {/* Main content container with fixed width */}
        <div className="justify-center h-[195.15px] w-[837px] my-auto grid grid-cols-[60%_40%] gap-[32px]">
          {/* Left content area - titles */}
          <div
            className={`h-[130px] tracking-[-.05em] font-${primaryFont} leading-[100%] font-semibold text-${commonConfig.fontSize?.heading} text-${textColor} text-right`}
          >
            {heading}
          </div>

          {/* Right content area - sub-titles */}
          <div className="grid grid-rows-[70%_30%]">
            <div
              className={`align-left text-${commonConfig.fontSize?.description} font-${secondaryFont} tracking-[-.05em] leading-[100%] font-normal text-${textColor}`}
            >
              {description}
            </div>
            <div className="flex items-end">
              <Button
                className={`font-${highlightFont} p-[14.08px] tracking-[-.05em] leading-[100%] text-[24.63px] font-semibold h-[45.15px] w-[184.15px] ${
                  buttonStyle === "rounded" ? "rounded-md" : "rounded-none"
                }`}
                style={{ backgroundColor: highlightColor, color: textColor }}
              >
                {ctaButtonText}
              </Button>
            </div>
          </div>
        </div>

        {/* Right side - Headshot with light effect */}
        <div className="h-full">
          {/* Light effect behind headshot */}
          <div className="inset-0 rounded-full opacity-20 bg-white blur-2xl" />

          {/* Headshot image */}
          <img
            src={imageUrl}
            alt={imageAlt}
            className="object-cover object-right"
            style={{
              height: `389px`,
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
