const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const PORT = 3001;

app.use(cors());
app.use(express.json());

// === Database ===
const db = mysql.createConnection({
  user: "enovation_admin",
  host: "dedi1155.jnb1.host-h.net",
  password: "U3jGV1120k9861",
  database: "enovault",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// === Ensure Upload Folder Exists ===
const uploadDir = path.join(__dirname, "../uploads/profile_photos");
fs.mkdirSync(uploadDir, { recursive: true });

// === Multer Config ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// === Serve Uploads ===
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// === Logs ===

function logAction(email, action, details = "") {
  db.query(
    "INSERT INTO logs (user_email, action, details) VALUES (?, ?, ?)",
    [email, action, details],
    (err) => {
      if (err) console.error("Failed to log action:", err);
    }
  );
}

app.post("/log", (req, res) => {
  const { email, action, details } = req.body;
  console.log("Log received:", { email, action, details }); // <-- add this

  if (!email || !action) {
    return res.status(400).json({ error: "Missing email or action" });
  }

  db.query(
    "INSERT INTO logs (user_email, action, details) VALUES (?, ?, ?)",
    [email, action, details],
    (err) => {
      if (err) {
        console.error("Failed to log action:", err);
        return res.status(500).json({ error: "Database insert failed" });
      }
      res.status(200).json({ message: "Log saved" });
    }
  );
});

app.post("/logcopy", (req, res) => {
  const { userEmail, passwordLabel } = req.body;
  logAction(userEmail, "PASSWORD_COPIED", `Copied password: ${passwordLabel}`);
  res.send("Copy logged");
});

app.get("/getlogs", (req, res) => {
  db.query("SELECT * FROM logs ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("Error fetching logs:", err);
      return res.status(500).send("Failed to fetch logs");
    }
    res.json(results);
  });
});

app.post("/loglogout", (req, res) => {
  const { userEmail } = req.body;
  if (!userEmail) {
    return res.status(400).send("Email is required");
  }

  logAction(userEmail, "LOGOUT", `${userEmail} logged out`);
  res.send("Logout logged");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// === Routes ===

app.get("/", (req, res) => {
  res.send("API is running");
});

app.post("/addpassword", (req, res) => {
  const {
    itemName,
    client,
    username,
    password,
    websiteUrl,
    stagingUrl,
    notes,
    role, // NEW
    createdAt,
    updatedAt,
  } = req.body;

  const query = `
    INSERT INTO passwords 
    (item_name, client, username, password, website_url, staging_url, notes, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    itemName,
    client,
    username,
    password,
    websiteUrl,
    stagingUrl,
    notes,
    role, // NEW
    new Date(createdAt),
    new Date(updatedAt),
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting password:", err);
      res.status(500).send("Failed to add password");
    } else {
      res.send("Password entry added successfully");
    }
  });
});

app.delete("/deletepassword/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM passwords WHERE id = ?", [id]);
    res.status(200).send({ message: "Password deleted" });
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).send({ message: "Delete failed" });
  }
});

app.put("/updatepassword/:id", async (req, res) => {
  const { id } = req.params;
  const {
    client,
    item_name,
    username,
    password,
    website_url,
    staging_url,
    notes,
  } = req.body;

  try {
    await db.query(
      `UPDATE passwords
       SET client = ?, item_name = ?, username = ?, password = ?, website_url = ?, staging_url = ?, notes = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        client,
        item_name,
        username,
        password,
        website_url,
        staging_url,
        notes,
        id,
      ]
    );

    res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).send({ message: "Update failed" });
  }
});

app.get("/getpasswords", (req, res) => {
  const { role } = req.query;

  let query = "";
  let values = [];

  if (role === "Admin" || role === "Super Admin") {
    // Full access
    query = "SELECT * FROM passwords";
  } else {
    // Restricted access
    query = "SELECT * FROM passwords WHERE role = ?";
    values = [role];
  }

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error fetching passwords:", err);
      res.status(500).send("Failed to fetch passwords");
    } else {
      res.json(result);
    }
  });
});

app.post("/register", async (req, res) => {
  const { email, password, role = "user" } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
    [email, hashedPassword, role],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error registering user");
      } else {
        res.send("User registered");
      }
    }
  );
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("DB error during login:", err);
        return res.status(500).send("Server error");
      }

      if (results.length === 0) {
        return res.json({ success: false, message: "User not found" });
      }

      const user = results[0];
      try {
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res.json({ success: false, message: "Wrong password" });
        }

        const userData = {
          id: user.id,
          name: `${user.first_name} ${user.surname}`,
          email: user.email,
          role: user.role,
          profile_photo_url: user.profile_photo_url,
        };

        logAction(user.email, "LOGIN", `${userData.name} logged in`);

        res.json({
          success: true,
          token: "dummy-token", // 🔑 Replace with JWT if needed
          user: userData,
        });
      } catch (bcryptError) {
        console.error("Error comparing passwords:", bcryptError);
        res.status(500).send("Error during authentication");
      }
    }
  );
});

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("DB SELECT error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.json({
        message: "If the email exists, a reset link will be sent",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    db.query(
      "UPDATE users SET reset_token = ?, token_expires_at = ? WHERE email = ?",
      [token, expiresAt, email],
      (err, result) => {
        if (err) {
          console.error("DB UPDATE error:", err);
          return res.status(500).json({ message: "Error saving token" });
        }

        const resetLink = `http://localhost:3000/reset-password?token=${token}`;
        const transporter = nodemailer.createTransport({
          host: "smtp.vault.enovation.co.za",
          port: 465,
          secure: true,
          auth: {
            user: "security@vault.enovation.co.za",
            pass: "Lf72c097246Q5O",
          },
          // requireTLS: true,
          logger: true,
          debug: true,
        });

        const mailOptions = {
          from: "security@vault.enovation.co.za",
          to: email,
          subject: "Password Reset Request",
          html: `Click the link below to reset your password:<br><a href="${resetLink}">${resetLink}</a>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Email send error:", err.message);
            if (err.response) console.error("SMTP response:", err.response);
            if (err.stack) console.error(err.stack);

            return res.status(500).json({ message: "Email failed to send" });
          }

          console.log("Reset email sent:", info.response);
          res.json({
            message: "If the email exists, a reset link has been sent",
          });
        });
      }
    );
  });
});

app.post("/reset-password", (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Invalid request." });
  }

  db.query(
    "SELECT email, token_expires_at FROM users WHERE reset_token = ?",
    [token],
    async (err, results) => {
      if (err) {
        console.error("DB error during token lookup:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }

      const { email, token_expires_at } = results[0];
      const now = new Date();

      if (new Date(token_expires_at) < now) {
        return res.status(400).json({ message: "Token has expired." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      db.query(
        "UPDATE users SET password = ?, reset_token = NULL, token_expires_at = NULL WHERE email = ?",
        [hashedPassword, email],
        (err) => {
          if (err) {
            console.error("Password update error:", err);
            return res
              .status(500)
              .json({ message: "Error updating password." });
          }

          res.json({ message: "Password updated successfully!" });
        }
      );
    }
  );
});

app.get("/getusers", (req, res) => {
  db.query(
    "SELECT id, email, role, profile_photo_url, name, surname, location, phone FROM users",
    (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).send("Failed to fetch users");
      }
      res.json(results);
    }
  );
});

app.get("/user/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/adduser", upload.single("profilePhoto"), async (req, res) => {
  const {
    firstName,
    surname,
    userRole,
    email,
    password,
    location,
    phoneNumber,
  } = req.body;

  let profilePhotoUrl = null;
  if (req.file) {
    profilePhotoUrl = `/uploads/profile_photos/${req.file.filename}`;
  }

  const teamsLink = `https://teams.microsoft.com/l/chat/0/0?users=${email}`;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users 
        (name, surname, role, email, password, location, phone, teams_link, profile_photo_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        firstName,
        surname,
        userRole,
        email,
        hashedPassword,
        location,
        phoneNumber,
        teamsLink,
        profilePhotoUrl,
      ],
      (err, result) => {
        if (err) {
          console.error("Error adding user:", err);
          return res.status(500).send("Failed to add user");
        }
        res.send("User added successfully");
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).send("Error processing password");
  }
});

app.delete("/deleteuser/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Failed to delete user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  });
});

app.post("/updateprofile", upload.single("profilePhoto"), (req, res) => {
  const { email, name, surname, phone, userRole, location } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required to update profile." });
  }

  const sql = `
    UPDATE users 
    SET name = ?, surname = ?, phone = ?, location = ?, role = ? 
    WHERE email = ?
  `;
  const values = [name, surname, phone, location, userRole, email];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("MySQL error:", err);
      return res.status(500).json({ error: "Database update failed" });
    }

    if (req.file) {
      const profilePhotoPath = "/uploads/profile_photos/" + req.file.filename;
      const updatePhotoSql = `UPDATE users SET profile_photo_url = ? WHERE email = ?`;

      db.query(
        updatePhotoSql,
        [profilePhotoPath, email],
        (photoErr, photoResult) => {
          if (photoErr) {
            console.error("Profile photo update error:", photoErr);
            return res.status(500).json({ error: "Photo update failed" });
          }

          res.json({
            message: "Profile updated successfully with photo",
            updatedUser: {
              name,
              surname,
              phone: phone,
              location,
              role: userRole,
              email,
              profile_photo_url: profilePhotoPath,
            },
          });
        }
      );
    } else {
      res.json({
        message: "Profile updated successfully",
        updatedUser: {
          name,
          surname,
          phone: phone,
          location,
          role: userRole,
          email,
        },
      });
    }
  });
});

app.post("/updatepassword", (req, res) => {
  const { id, newPassword, email } = req.body;

  db.query(
    "SELECT password FROM passwords WHERE id = ?",
    [id],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(500).send("Password not found");
      }

      db.query(
        "UPDATE passwords SET password = ?, updated_at = ? WHERE id = ?",
        [newPassword, new Date(), id],
        (err2) => {
          if (err2) {
            return res.status(500).send("Failed to update password");
          }

          logAction(email, "PASSWORD_UPDATED", `Password ID ${id} updated`);
          res.send("Password updated and logged");
        }
      );
    }
  );
});

app.get("/userprofile", (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Email required" });

  db.query(
    "SELECT name, surname, phone, location, role, email, profile_photo_url FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(results[0]);
    }
  );
});

app.get("/users/logged-in", (req, res) => {
  const query = `
    SELECT COUNT(*) AS count
    FROM (
      SELECT user_email, MAX(created_at) AS last_action_time
      FROM logs
      WHERE action IN ('LOGIN', 'LOGOUT')
      GROUP BY user_email
    ) AS latest
    JOIN logs l ON l.user_email = latest.user_email AND l.created_at = latest.last_action_time
    WHERE l.action = 'LOGIN'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error counting logged in users:", err);
      return res.status(500).send("Failed to get logged in users");
    }

    res.json({ count: results[0].count });
  });
});

app.get("/passwords/count", (req, res) => {
  db.query("SELECT COUNT(*) AS count FROM passwords", (err, results) => {
    if (err) {
      console.error("Error counting passwords:", err);
      return res.status(500).send("Failed to get password count");
    }

    res.json({ count: results[0].count });
  });
});

app.get("/users/count", (req, res) => {
  db.query(
    `SELECT COUNT(*) AS count FROM users 
     WHERE role IN ('Admin', 'Digital Marketer', 'Account Manager', 'Copywriter', 'Designer')`,
    (err, results) => {
      if (err) {
        console.error("Error counting team members:", err);
        return res.status(500).send("Failed to get team member count");
      }
      res.json({ count: results[0].count });
    }
  );
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
