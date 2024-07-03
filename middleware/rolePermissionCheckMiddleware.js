const db = require('../models')

const checkRoleOrPermission = (roles = [], permissions = []) => {
  return async (req, res, next) => {
    const user = req.user

    if (
      !user ||
      !Array.isArray(user.roles) ||
      !Array.isArray(user.permissions)
    ) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    let hasRole = false
    let hasPermission = false

    // Check if user has any of the required roles
    if (roles.length > 0) {
      hasRole = user.roles.some((role) => roles.includes(role.name))
    } else {
      hasRole = true // No specific roles required
    }

    // Check if user has any of the required permissions
    if (permissions.length > 0) {
      hasPermission = user.permissions.some((permission) =>
        permissions.includes(permission.name),
      )
    } else {
      hasPermission = true // No specific permissions required
    }

    if (hasRole && hasPermission) {
      next() // User has required roles and permissions, proceed to controller
    } else {
      return res.status(403).json({ message: 'Forbidden' })
    }
  }
}

module.exports = checkRoleOrPermission
