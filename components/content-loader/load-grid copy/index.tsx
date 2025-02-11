import React from "react";
import ContentLoader from "react-content-loader";

const SubscriptionCardLoader = () => (
  <ContentLoader 
    speed={2}
    width={350}
    height={250}
    viewBox="0 0 350 250"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    {/* Title */}
    <rect x="20" y="20" rx="4" ry="4" width="150" height="20" />
    
    {/* Checkmark icon */}
    <circle cx="30" cy="60" r="8" />
    
    {/* Text */}
    <rect x="50" y="55" rx="4" ry="4" width="250" height="15" />
    
    {/* Price */}
    <rect x="20" y="90" rx="4" ry="4" width="80" height="30" />
    
    {/* Calendar box */}
    <rect x="20" y="140" rx="8" ry="8" width="310" height="80" />
    
    {/* Calendar icon */}
    <rect x="160" y="160" rx="6" ry="6" width="30" height="30" />
    
    {/* Subscription period */}
    <rect x="110" y="200" rx="4" ry="4" width="130" height="15" />
  </ContentLoader>
);

export default SubscriptionCardLoader;
