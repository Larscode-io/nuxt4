// server/api/cert.ts

import { exec } from 'node:child_process'

export default defineEventHandler(async () => {
  return new Promise((resolve, reject) => {
    exec('echo | openssl s_client -servername www.const-court.be -connect www.const-court.be:443 2>/dev/null | openssl x509 -noout -enddate', (err, stdout) => {
      if (err) return reject(err)
      const match = stdout.match(/notAfter=(.+)/)
      if (!match) return reject('Could not parse expiry date')
      const expiry = new Date(match[1])
      const daysLeft = Math.floor((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      //   resolve({ expiresOn: expiry.toISOString(), daysLeft })
      resolve({ daysLeft })
    })
  })
})
