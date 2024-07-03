const checkUserIdMatch = (bypassRoles = []) => {
  return (req, res, next) => {
    const user = req.user
    const userId = req.params.userId

    if (!user || !user.id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Check if user has any of the bypass roles
    const hasBypassRole = user.roles.some((role) =>
      bypassRoles.includes(role.name),
    )

    if (hasBypassRole || user.id === userId) {
      next() // User is authorized to access this route
    } else {
      return res.status(403).json({ message: 'Forbidden' })
    }
  }
}

module.exports = checkUserIdMatch
