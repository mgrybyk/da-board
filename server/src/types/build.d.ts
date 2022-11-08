interface IBuild {
  number?: string
  package?: string
  integration: string
  timestamp: number
}
interface IBuildRecord extends IBuild, DbRecord {}
