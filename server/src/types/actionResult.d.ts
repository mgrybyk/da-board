interface ActionResult<T = unknown> {
  success: boolean
  message?: string
  data?: T
}
