import { portfolio } from '../../data/portofolio'

export const certificateRails = [
  {
    id: 'certificate-rail-1',
    title: 'CERTIFICATES',

    position: [13, 0, -28],
    rotation: [0, 0.3, 0],

    interactionDistance: 6,

    certificateIds: [
      'frontend-development-libraries',
      'javascript-algorithm',
      'legacy_javascript-algorithm',
    ],
  },

  {
    id: 'certificate-rail-2',
    title: 'CERTIFICATES',

    position: [-2, 0, -28],
    rotation: [0, 0.3, 0],

    interactionDistance: 6,

    certificateIds: [
      'responsive_web','scientific-computing','flutter'
    ],
  },
]

export function getRailCertificates(rail) {
  return rail.certificateIds
    .map((id) =>
      portfolio.certificates.find(
        (certificate) =>
          certificate.id === id
      )
    )
    .filter(Boolean)
}