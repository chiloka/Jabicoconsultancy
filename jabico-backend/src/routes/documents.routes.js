const express = require("express");
const router = express.Router();

const db = require("../lib/db");

/* =========================================================
   GET /api/documents

   Matches js/documents.js. Mounted separately from
   /api/student/* because that's the exact path used
   in the existing frontend code.
========================================================= */

router.get("/", (req, res) => {
    const data = db.read();

    const documents = data.documents.filter(
        d => d.studentId === req.student.sub
    );

    return res.json({ success: true, count: documents.length, documents });
});

module.exports = router;
