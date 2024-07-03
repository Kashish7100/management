const db = require('../models')
const logger = require('../config/logger')
var nodemailer = require('nodemailer')
const fs = require('fs');
const bcrypt = require('bcrypt');
var generateOTP = require('gen-otp')
var jwt = require('jsonwebtoken')
const User = db.User
const Role = db.Role
const Profile = db.Profile
const Permission = db.Permission
const Op = db.Sequelize.Op
const associateRolesAndPermissions = require('../helper/role-permission-assignment')

exports.getalluser = async (req, res) => {
  const username = req.query.username?.toLowerCase() // Lowercase username for case-insensitive search
  const condition = username
    ? {
        username: {
          [Op.like]: `%${username}%`,
        },
      }
    : {} // Empty condition object if no username provided

  try {
    const users = await User.findAll({
      where: condition,
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] }, // Exclude join table attributes
          attributes: ['name'],
        },
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }, // Exclude join table attributes
          attributes: ['name'],
        },
      ],
    })

    if (users.length > 0) {
      const result = users.map((user) => ({
        ...user.toJSON(),
        roles: user.roles.map((role) => role.name),
        permissions: user.permissions.map((permission) => permission.name),
      }))

      res.status(200).send({
        message: 'List',
        result: result,
      })
    } else {
      res.status(200).send({ message: 'No Records Found.' }) // Simpler message
    }
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send({ message: 'Internal server error. Please try again later.' })
  }
}

// login check
exports.loginCheck = async (req, res) => {
  const authCheck = {
    emailId: req.body.email_id,
    password: req.body.password,
  }
  try {
    const user = await User.login(authCheck.emailId, authCheck.password)
    const token = jwt.sign(authCheck, '12345')
    fdata = user.toJSON()
    fdata.roles = fdata.roles.map((role) => role.name)
    fdata.permissions = fdata.permissions.map((permission) => permission.name)
    res.status(200).send({
      message: 'User Found',
      result: fdata,
      accessToken: 'Bearer ' + token,
    })
  } catch (error) {
    res.status(400).send({
      message: 'username or password is incorrect',
    })
  }
}

//register
exports.register = async (req, res) => {
  // Check for empty email and username
  if (!req.body.email_id || !req.body.username) {
    res.status(400).send({
      message: 'Sila berikan emel dan nama pengguna!',
    })
    return
  }

  try {
    // Check for existing email or username in a single query
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { emailId: req.body.email_id },
          { username: req.body.username },
        ],
      },
    })

    if (existingUser) {
      // Conflict found, check if it's username or email
      if (existingUser.emailId === req.body.email_id) {
        res.status(409).send({
          message: 'Alamat emel sudah wujud. Sila cuba yang lain.',
        })
      } else {
        res.status(409).send({
          message: 'Nama pengguna sudah digunakan. Sila pilih yang lain.',
        })
      }
      return
    }

    // No conflicts found, proceed with registration
    const userObj = {
      fullname: req.body.fullname,
      username: req.body.username,
      emailId: req.body.email_id,
      password: req.body.password,
    }
    const newUser = await User.create(userObj)

    // Create profile object from request body
    const profileObj = {
      userId: newUser.id, // Use the newly created user's ID
      age: req.body.age, // Assuming age is provided in the request body
      address: req.body.address,
      phoneNo: req.body.phoneNo,
      religion: req.body.religion,
      sex: req.body.sex,
      occupation: req.body.occupation,
    }

    // Create profile associated with the user
    await newUser.createProfile(profileObj)

    try {
      await associateRolesAndPermissions(newUser, ['user'], [])
      res.status(200).send({
        message: 'Registered Successfully',
        result: [req.body],
      })
    } catch (error) {
      logger.error(error.message)
      res.status(400).json({
        message: 'Registration Fails',
      })
    }
  } catch (err) {
    logger.error(err.message)
    res.status(500).send({
      message: err.message || 'Some error occurred.',
    })
  }
}

exports.forgotpassword = async (req, res) => {
  const emailId = req.body.email_id

  if (!emailId) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
    return
  }

  // Replace with logic to generate a password reset token/link
  const resetUrl = 'your_logic_to_generate_token'

  // Read the logo image file and convert it to Base64
  const logoPath = './images/icon_felda.png';  // Replace with your logo file path
  const logoData = fs.readFileSync(logoPath);
  const logoBase64 = logoData.toString('base64');
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  const user = await User.findOne({
    where: { emailId: emailId },
  })

  if (!user) {
    return res.status(404).send({ message: 'User not found.' })
  }

  const fullName = user.fullname;
  const capitalizedFullName = fullName.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });

  const mailOptions = {
    from: 'mailtrap@demomailtrap.com',
    to: emailId,
    subject: '[FeLink] Set Semula Kata Laluan',
    text: `Click here to reset your password: ${resetUrl}`, // Include reset token in the message
    html: `
      <div style="text-align: center;">
        <img src="${logoSrc}" alt="Company Logo" style="width: 80; height: auto; margin-bottom: 20px;">
      </div>
      <p>Assalamualaikum dan Salam Sejahtera</p>
      <p>${capitalizedFullName}</p>
      <br>
      <p>Dimaklumkan bahawa Tuan/Puan telah melakukan permohonan untuk set semula kata laluan FELINK. Sia klik butang dibawah untuk meneruskan aktiviti set semula kata laluan.</p>
      <a id="resetButton" href="${resetUrl}" style="background-color: #C65127; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 10px;">SET SEMULA KATA LALUAN</a>
      <p>Pautan hanya sah selama 3 minit.</p>
      <br>
      <p>Sila berhati-hati apabila berkongsi butiran log masuk ini dengan orang lain.</p>
      <p>Tidak meminta kata laluan baharu atau ingat kata laluan lama anda?</p>
      <p>Tiada masalah! Kata laluan lama anda masih sah.</p>
      <br>
      <p>Terima Kasih,</p>
      <p>Pentadbir FeLink</p>
    `, 
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Use environment variable for host
      port: process.env.EMAIL_PORT, // Use environment variable for port
      auth: {
        user: process.env.EMAIL_USER, // Use environment variable for username
        pass: process.env.EMAIL_PASSWORD, // Use environment variable for password
      },
    })

    const info = await transporter.sendMail(mailOptions)

    if (info.accepted.length > 0) {
      res.status(200).send({
        message: 'Password reset link sent successfully!',
      })
    } else {
      res.status(400).send({
        message: 'Failed to send password reset link.',
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send({
      message: 'Internal server error. Please try again later.',
    })
  }
}

// changepassword
exports.changepassword = async (req, res) => {
  // Check for required fields
  if (!req.body.id || !req.body.password || !req.body.confirmpassword) {
    res.status(400).send({
      message:
        'Please provide all required fields: id, password, confirmpassword!',
    })
    return
  }

  try {
    // Find user by ID
    const user = await User.findOne({ where: { id: req.body.id } })

    // Check if user exists
    if (!user) {
      return res.status(401).send({ message: 'Invalid user ID or password.' })
    }

    // Compare hashed passwords (assuming password is hashed in the database)
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password,
    )

    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid user ID or password.' })
    }

    // Update user password with hashing (assuming bcrypt is used)
    const hashedPassword = await bcrypt.hash(req.body.confirmpassword, 10)
    await User.update(
      { password: hashedPassword },
      { where: { id: req.body.id } },
    )

    res.status(200).send({ message: 'User password updated successfully' })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send({ message: 'Internal server error. Please try again later.' })
  }
}

exports.getUserDetails = async (req, res) => {
  const userId = req.params.userId // Assuming userId is passed as a route parameter

  if (!userId) {
    return res.status(400).send({ message: 'Please provide a valid user ID.' })
  }

  try {
    const user = await User.findOne({
      where: { id: userId },
      include: {
        model: Profile, // Include the Profile model
        as: 'profile', // Define the alias for the association (optional)
      },
    })

    if (!user) {
      return res.status(404).send({ message: 'User not found.' })
    }

    res.status(200).send({
      message: 'User details retrieved successfully',
      user: user.toJSON(), // Convert user object to plain JSON
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send({ message: 'Internal server error. Please try again later.' })
  }
}

//editprofile
exports.updateUser = async (req, res) => {
  const userId = req.params.userId // Assuming userId is a route parameter

  if (!userId) {
    return res.status(400).send({ message: 'Please provide a valid user ID.' })
  }

  try {
    const [updatedCount, [updatedUser]] = await User.update(
      { ...req.body }, // Update user attributes based on request body
      { where: { id: userId }, returning: true }, // Return the updated user
    )

    if (updatedCount === 0) {
      return res.status(404).send({ message: 'User not found.' })
    }

    // Update profile if profile data is provided
    if (
      req.body.age ||
      req.body.address ||
      req.body.phoneNo ||
      req.body.religion ||
      req.body.sex ||
      req.body.occupation
    ) {
      const profileUpdates = {
        age: req.body.age,
        address: req.body.address,
        phoneNo: req.body.phoneNo,
        religion: req.body.religion,
        sex: req.body.sex,
        occupation: req.body.occupation,
      }

      await updatedUser.profile.update(profileUpdates) // Update the associated profile
    }

    res.status(200).send({
      message: 'User details updated successfully',
      user: updatedUser.toJSON(), // Return updated user details
    })
  } catch (error) {
    console.error(error.message)
    res
      .status(500)
      .send({ message: 'Internal server error. Please try again later.' })
  }
}

//email exist
exports.emailCheck = async (req, res) => {
  const authCheck = {
    email_id: req.body.email_id,
  }
  let fdata = await User.findOne({
    where: authCheck,
  })
    .then((data) => {
      if (data == null) {
        res.status(200).send({
          message: 'Proceed to Register',
        })
      } else {
        res.status(208).send({
          message: 'Email Exist',
        })
      }
    })
    .catch((err) => {
      logger.error(err.message)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving user details',
      })
    })
}

// Update user status
exports.updateUserStatus = async (req, res) => {
  const userId = req.body.user_id
  const newStatus = req.body.status // Assuming 'status' refers to the new 'isActive' value

  try {
    // Update user isActive using Sequelize.update
    const [updatedCount] = await User.update(
      { isActive: newStatus }, // Update the 'isActive' field
      { where: { id: userId } }, // Update where ID matches
    )

    if (updatedCount === 0) {
      return res.status(404).send({ message: 'User not found.' })
    }

    res.status(200).send({ message: 'User status updated successfully.' })
  } catch (error) {
    console.error(error.message)
    res.status(500).send({
      message: err.message || 'Some error occurred while updating user status.',
    })
  }
}

//ic number
exports.icnumberCheck = async (req, res) => {
  // console.log("j");
  // console.log(req.body.icnumber);
  const authCheck = {
    icnumber: req.body.icnumber,
  }
  let fdata = await User.findOne({
    where: authCheck,
  })
    .then((data) => {
      if (data == null) {
        res.status(200).send({
          message: 'Proceed to Register',
        })
      } else {
        res.status(208).send({
          message: 'ic number Exist',
        })
      }
    })
    .catch((err) => {
      logger.error(err.message)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving user details',
      })
    })
}
