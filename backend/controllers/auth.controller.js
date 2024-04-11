const User = require("../models/user");
const { verifyPassword, encryptPassword } = require("../common/utils");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const randomString = require("randomstring");
const Token = require("../models/token");

//login Endpoint
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    });
    //check if user exists
    if (!user) {
      return res.status(400).json({
        message: "e-mail ou mot de passe incorrecte",
      });
    }
    //check if passwords is correct
    const isCorrectPassword = await verifyPassword(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).json({
        message: "e-mail ou mot de passe incorrecte",
      });
    }
    // creat token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token,", token);
    return res.json({
      token,
      message: `Bienvenue ${user.firstName}`,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
      });
    }
    const token = randomString.generate(30);
    await Token.create({
      token: token,
      idUser: user._id,
    });

    //send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL, //sender gmail adress
        pass: process.env.APP_PASSWORD, // app password from Gmail account
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Réinitialisation du mot de passe",
      html: `<b> Le lien de réinitialisation de votre mot de passe est prêt </b>
      <br/>
      <a href='http://localhost:3000/reset-password/${token}'> réinitialiser le mot de passe </a>`,
    });
    res.json({ message: "Merci de vérifier votre boite mail " });
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.params.token });
    if (!token) {
      res.status(404).json({ message: "token expired" });
    } else {
      const user = await User.findById(token.idUser);
      if (!user) {
        res.status(404).json({ message: "user not found" });
      } else {
        const hash = await encryptPassword(req.body.password);
        await User.findByIdAndUpdate(
          token.idUser,
          { password: hash },
          { new: true }
        );
        await Token.findByIdAndDelete(token._id);
        //Envoi un email de succès
        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // Use `true` for port 465, `false` for all other ports
          auth: {
            user: process.env.EMAIL, //sender gmail adress
            pass: process.env.APP_PASSWORD, // app password from Gmail account
          },
        });
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: user.email,
          subject: "Réinitialisation du mot de passe",
          html: " Votre mot de passe a été réinitialisé avec succès",
        });
        res.json({
          message: " Votre mot de passe a été réinitialisé avec succès",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "Déconnecté avec succès." });
  });
};
