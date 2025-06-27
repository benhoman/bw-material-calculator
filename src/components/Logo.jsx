import React from 'react';

export function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width="64"
      height="64"
      role="img"
      aria-label="BW YC logo"
    >
      <rect width="64" height="64" rx="12" fill="#000" />
      <text
        x="50%"
        y="40%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
        fontWeight="700"
        fontSize="20"
        letterSpacing="2"
      >
        BW
      </text>
      <text
        x="50%"
        y="65%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#3B82F6"
        fontFamily="Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
        fontWeight="700"
        fontSize="20"
        letterSpacing="2"
      >
        YC
      </text>
    </svg>
  );
}

