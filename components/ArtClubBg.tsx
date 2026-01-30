'use client';

export default function ArtClubBg() {
    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#FAF9F6]">
            {/* Abstract Watercolor-like Static Background */}

            {/* Soft gradients to simulate watercolor washes */}
            <div className="absolute top-0 left-0 w-full h-full opacity-60 bg-[radial-gradient(circle_at_20%_20%,_#ffe4e6_0%,_transparent_50%)]"></div>
            <div className="absolute top-0 right-0 w-full h-full opacity-60 bg-[radial-gradient(circle_at_80%_10%,_#e0e7ff_0%,_transparent_50%)]"></div>
            <div className="absolute bottom-0 left-1/4 w-full h-full opacity-60 bg-[radial-gradient(circle_at_40%_90%,_#fef3c7_0%,_transparent_50%)]"></div>

            {/* Texture overlay for paper feel */}
            <div className="absolute inset-0 opacity-[0.4]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                filter: 'contrast(120%) brightness(100%)'
            }}></div>

            {/* Static Splashes (SVG shapes) positioned artistically */}
            <svg className="absolute top-[10%] left-[5%] w-96 h-96 opacity-30 text-pink-300 fill-current mix-blend-multiply" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M47.5,-58.9C61.3,-46.6,72.4,-31.6,76.5,-14.9C80.7,1.8,77.9,20.2,68.4,35.6C58.9,51.1,42.7,63.6,25.3,69.2C7.9,74.8,-10.7,73.5,-27.1,66.3C-43.5,59.1,-57.7,46,-65.8,30.3C-73.9,14.6,-75.9,-3.7,-69.6,-19.9C-63.3,-36.1,-48.7,-50.2,-33.5,-61.8C-18.3,-73.4,-2.5,-82.5,10.6,-80.4L23.7,-78.3Z" transform="translate(100 100)" />
            </svg>

            <svg className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px] opacity-30 text-blue-200 fill-current mix-blend-multiply" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M44.7,-51.5C57.3,-41.8,66.4,-27.8,70.3,-12.4C74.2,3,72.9,19.8,63.8,33.5C54.7,47.2,37.8,57.8,20.2,63.1C2.6,68.4,-15.8,68.4,-30.9,61.4C-46,54.4,-57.8,40.4,-63.9,24.5C-70,8.6,-70.4,-9.2,-62.7,-24C-55,-38.8,-39.2,-50.7,-24.1,-58.5C-9,-66.3,5.4,-70,17.2,-66.5L29,-63Z" transform="translate(100 100)" />
            </svg>
        </div>
    );
}
