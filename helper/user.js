const db = require('../models')
const User = db.User
const Role = db.Role
const Permission = db.Permission

const associateRolesAndPermissions = async (userRecord, roles, permissions) => {
  const rolesToAssociate = await Role.findAll({ where: { name: roles } })
  const permissionsToAssociate = await Permission.findAll({
    where: { name: permissions },
  })

  if (
    rolesToAssociate.length !== roles.length ||
    permissionsToAssociate.length !== permissions.length
  ) {
    logger.error('One or more Role or Permission not found')
    throw new Error('One or more Role or Permission not found')
  }

  const user = await User.findByPk(userRecord.id)
  if (user) {
    if (roles.length > 0) {
      await user.addRoles(rolesToAssociate)
    }
    if (permissions.length > 0) {
      await user.addPermission(permissionsToAssociate)
    }
  } else {
    console.log('User not found')
  }
}

/**
 * Checks if a specific user is active based on their mstatus.
 *
 * @param {number} userId - The ID of the user to check.
 * @returns {Promise<boolean|null>} Returns `true` if the user is active, `false` if inactive, and `null` if the user does not exist.
 */
const checkUserIsActive = async (userId) => {
  try {
    const user = await User.findByPk(userId)
    if (user) {
      return user.mstatus === 1
    } else {
      console.log('User not found.')
      return null
    }
  } catch (error) {
    console.error('Error fetching user status:', error)
    throw error // Rethrow the error after logging
  }
}

module.exports = { checkUserIsActive, associateRolesAndPermissions }
