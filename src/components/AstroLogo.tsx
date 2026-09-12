import Image from "next/image";

interface AstroLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function AstroLogo({ size = 28, className = "", showText = true }: AstroLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          borderRadius: "50%",
          boxShadow: "0 0 16px rgba(234, 179, 8, 0.35)",
          flexShrink: 0,
        }}
      >
        <Image
          src="/favicon.svg"
          alt="AstroShubham Vedic Star Logo"
          width={size}
          height={size}
          className="rounded-full"
          priority
        />
      </div>
      {showText && <span className="font-semibold text-white tracking-wide">AstroShubham</span>}
    </div>
  );
}
