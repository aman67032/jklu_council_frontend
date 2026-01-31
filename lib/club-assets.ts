
// Map of club slugs to their logo paths
// Note: We are using "With BG" variants where available for cards/lists as they often look better on dark backgrounds if they have a designed background.
// For hero sections, we might stick to this or assume the component handles it.

export const CLUB_LOGOS: Record<string, string> = {
    // Technical Council
    'robotics-club': '/logos/ARC (With BG).png',
    'technology-club': '/logos/TechClub (With BG).png',
    'astronomy-club': '/logos/Nakshatra (Without BG).png', // Only without BG available or preferred?
    'astro-club': '/logos/Nakshatra (Without BG).png', // handle alias
    'cp-club': '/logos/Matrix (With BG).png',

    // Cultural Council
    'drama-club': '/logos/NakabNama (With BG).png',
    'art-club': '/logos/HOA (With BG).png',
    'media-club': '/logos/Sociama (With BG).png',
    'photography-club': '/logos/Shade (Without BG).png', // Updated per user request
    'literary-club': '/logos/MuseInk (Without BG).png',
    'dance-club': '/logos/SteppersSquad.png',
    'music-club': '/logos/Anunaad (Without BG).png',
    'design-club': '/logos/WhiteSpace (With BG).png',

    // Management/Other
    'business-club': '/logos/Corpova (Without BG).png',
    'corpova': '/logos/Corpova (Without BG).png',

    // Fallbacks or others?
    'entrepreneurship-club': '/logos/Udgam (With BG).png',
    'community-development-club': '/logos/Udgam (With BG).png',
    'cdc': '/logos/Udgam (With BG).png',
};

export const COUNCIL_LOGOS: Record<string, string> = {
    'technical-affairs': '/logos/TechnicalAffairs (With BG).png',
    'cultural-affairs': '/logos/CulturalCouncil (With BG).png',
    'student-affairs': '/logos/StudentAffairs (With BG).png',
    // We can map others if we identify them later
};

export const getClubLogo = (slug: string): string | null => {
    if (!slug) return null;
    return CLUB_LOGOS[slug.toLowerCase()] || null;
};

export const getCouncilLogo = (slug: string): string | null => {
    if (!slug) return null;
    return COUNCIL_LOGOS[slug.toLowerCase()] || null;
};
