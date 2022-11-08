interface IHomeLink {
  name: string
  link?: string
  details?: string
  group?: string
  timestamp: number
}

interface IHomeLinkRecord extends IHomeLink, DbRecord {}
