import { portfolio } from '../../data/portofolio'

export const projectBoards = [
  {
    id: 'development-board',
    title: 'DEVELOPMENT',
    motif: 'development',

    position: [-11, 0, 26],
    rotation: [0, 0.2, 0],

    interactionDistance: 6,

    projectIds: [
      'music-pen',
      'inversa',
      'create-eve',
      'visikom',
      'robust',
    ],
  },

  {
    id: 'journal-board',
    title: 'JOURNAL & WEB',
    motif: 'journal',

    position: [20, 0, 12],
    rotation: [0, -0.25, 0],

    interactionDistance: 6,

    projectIds: [
      'ijib',
      'ijodm',
      'abdimas',
      'adil',
      'future',
    ],
  },
  {
    id: 'journal-board2',
    title: 'JOURNAL & WEB',
    motif: 'journal',

    position: [8, 0, 1],
    rotation: [0, 0.12, 0],

    interactionDistance: 6,

    projectIds: [
      'iqra',
      'heart',
      'exgen',
    ],
  },
]

export function getBoardProjects(board) {
  return board.projectIds
    .map((id) =>
      portfolio.projects.find(
        (project) => project.id === id
      )
    )
    .filter(Boolean)
}