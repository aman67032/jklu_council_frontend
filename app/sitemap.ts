import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://jklu-council.vercel.app' // Replace with your production domain
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/clubs',
        '/councils',
        '/events',
        '/login',
        '/signup',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    // 2. Dynamic Routes: Clubs
    let clubRoutes: MetadataRoute.Sitemap = []
    try {
        const res = await fetch(`${apiUrl}/clubs`, { next: { revalidate: 3600 } })
        const data = await res.json()
        if (data.clubs) {
            clubRoutes = data.clubs.map((club: any) => ({
                url: `${baseUrl}/clubs/${club.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }))
        }
    } catch (error) {
        console.error('Error fetching clubs for sitemap:', error)
    }

    // 3. Dynamic Routes: Councils
    let councilRoutes: MetadataRoute.Sitemap = []
    try {
        const res = await fetch(`${apiUrl}/councils`, { next: { revalidate: 3600 } })
        const data = await res.json()
        if (data.councils) {
            councilRoutes = data.councils.map((council: any) => ({
                url: `${baseUrl}/councils/${council.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }))
        }
    } catch (error) {
        console.error('Error fetching councils for sitemap:', error)
    }

    // 4. Dynamic Routes: Events (Approved)
    let eventRoutes: MetadataRoute.Sitemap = []
    try {
        const res = await fetch(`${apiUrl}/events?status=approved`, { next: { revalidate: 3600 } })
        const data = await res.json()
        if (data.events) {
            eventRoutes = data.events.map((event: any) => ({
                url: `${baseUrl}/events/${event.id}`,
                lastModified: new Date(event.updated_at || event.created_at || new Date()),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            }))
        }
    } catch (error) {
        console.error('Error fetching events for sitemap:', error)
    }

    return [...staticRoutes, ...clubRoutes, ...councilRoutes, ...eventRoutes]
}
