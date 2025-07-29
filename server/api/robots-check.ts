// server/api/robots-check.get.ts

// automatisch valideren wat je headers en robots.txt beleid is

export default defineEventHandler((event) => {
  const host = getRequestHeader(event, 'host') || ''
  const accept = getRequestHeader(event, 'accept') || ''
  const robots = host.startsWith('www.') || host.startsWith('staging.') ? 'BLOCK' : 'ALLOW'
  const html = accept.includes('text/html') ? 'HTML' : 'Other'

  return {
    host,
    robotsPolicy: robots,
    xRobotsTag: robots === 'BLOCK' && html === 'HTML' ? 'noindex, nofollow' : 'none',
    explanation: robots === 'BLOCK'
      ? 'Indexering is uitgeschakeld via robots.txt én X-Robots-Tag.'
      : 'Subdomein mag worden geïndexeerd.'
  }
})
