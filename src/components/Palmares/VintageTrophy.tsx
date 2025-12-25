import React from 'react';

export default function VintageTrophy({ className, size = 64 }: { className?: string; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FEE684" />
                    <stop offset="20%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#FEE684" />
                    <stop offset="80%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#996515" />
                </linearGradient>
                <linearGradient id="trophyDark" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#B8860B" />
                    <stop offset="100%" stopColor="#AA6C39" />
                </linearGradient>
            </defs>

            {/* Base */}
            <path
                d="M136 416H376V464H136V416Z"
                fill="url(#trophyDark)"
            />
            <path
                d="M112 464H400V496H112V464Z"
                fill="url(#trophyGold)"
            />

            {/* Stem/Neck */}
            <path
                d="M232 304H280L296 416H216L232 304Z"
                fill="url(#trophyGold)"
            />

            {/* Handles */}
            <path
                d="M432 128C432 110.3 417.7 96 400 96H384V160C384 219.6 348 270.8 296 294.6V304.6C347.6 304.6 392.6 272.2 414.2 224.2C425.4 199.2 432 171.6 432 142.6V128ZM384 128H400V142.6C400 162.8 395.2 181.8 386.8 198.6C373.8 227.4 346.8 248.6 314.8 259.2C355.8 238.4 384 196.2 384 147.2V128Z"
                fill="url(#trophyDark)"
            />
            <path
                d="M80 128C80 110.3 94.3 96 112 96H128V160C128 219.6 164 270.8 216 294.6V304.6C164.4 304.6 119.4 272.2 97.8 224.2C86.6 199.2 80 171.6 80 142.6V128ZM128 128H112V142.6C112 162.8 116.8 181.8 125.2 198.6C138.2 227.4 165.2 248.6 197.2 259.2C156.2 238.4 128 196.2 128 147.2V128Z"
                fill="url(#trophyDark)"
            />

            {/* Cup Bowl */}
            <path
                d="M144 64H368V144C368 205.9 317.9 256 256 256C194.1 256 144 205.9 144 144V64Z"
                fill="url(#trophyGold)"
            />
            {/* Cup Rim highlight */}
            <ellipse cx="256" cy="64" rx="112" ry="16" fill="#FFF8DC" opacity="0.6" />

            {/* Star/Detail on Cup */}
            <path
                d="M256 120L266 140L288 143L272 158L276 180L256 170L236 180L240 158L224 143L246 140L256 120Z"
                fill="#B8860B"
                opacity="0.8"
            />
        </svg>
    );
}
