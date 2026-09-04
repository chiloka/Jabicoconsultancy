const express = require("express");
const router = express.Router();
const db = require("../lib/db");

function toApplication(student, extra = {}) {
    return {
        id: student.id,
        name: student.fullName || `${student.firstName || ""} ${student.lastName || ""}`.trim(),
        firstName: student.firstName,
        lastName: student.lastName,
        fullName: student.fullName,
        email: student.email,
        cohort: student.cohort || null,
        status: student.status,
        appliedAt: student.registeredAt,
        approvedAt: student.approvedAt || null,
        rejectedAt: student.rejectedAt || null,
        ...extra
    };
}

function ensureRejectedStore(data) {
    if (!Array.isArray(data.rejectedApplications)) data.rejectedApplications = [];
    return data.rejectedApplications;
}

router.get("/", (req, res) => {
    const { status = "pending", search = "", cohort = "all", sort = "latest" } = req.query;
    const data = db.read();
    const rejected = ensureRejectedStore(data);
    let records = [];

    if (status === "rejected") {
        records = rejected.map(item => ({ ...item, status: "rejected" }));
    } else {
        const activeStudents = data.students.filter(s => s.status === "pending" || s.status === "active");
        records = activeStudents.map(s => toApplication(s));
        if (status !== "all") {
            const wanted = status === "approved" ? "active" : status;
            records = records.filter(s => s.status === wanted);
        }
        if (status === "all") records = [...records, ...rejected.map(item => ({ ...item, status: "rejected" }))];
    }

    const term = String(search).trim().toLowerCase();
    if (term) records = records.filter(s => `${s.name || ""} ${s.email || ""} ${s.id || ""}`.toLowerCase().includes(term));
    if (cohort !== "all") records = records.filter(s => s.cohort === cohort);

    records.sort((a, b) => {
        if (sort === "name") return String(a.name).localeCompare(String(b.name));
        const dateA = new Date(a.appliedAt || 0).getTime();
        const dateB = new Date(b.appliedAt || 0).getTime();
        return sort === "oldest" ? dateA - dateB : dateB - dateA;
    });

    return res.json({ success: true, count: records.length, applications: records });
});

router.get("/:id", (req, res) => {
    const data = db.read();
    const student = data.students.find(s => s.id === req.params.id);
    if (student) return res.json({ success: true, application: toApplication(student) });
    const rejected = ensureRejectedStore(data).find(s => s.id === req.params.id);
    if (rejected) return res.json({ success: true, application: { ...rejected, status: "rejected" } });
    return res.status(404).json({ success: false, message: "Application not found." });
});

router.post("/:id/approve", (req, res) => {
    const data = db.read();
    const student = data.students.find(s => s.id === req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "Application not found." });
    if (student.status !== "pending") return res.status(409).json({ success: false, message: "This application has already been processed." });

    student.status = "active";
    student.approvedAt = new Date().toISOString();
    if (req.body && req.body.cohort) student.cohort = req.body.cohort;
    db.write(data);
    return res.json({ success: true, message: `${student.fullName}'s application has been approved.`, application: toApplication(student) });
});

function rejectApplication(req, res) {
    const data = db.read();
    const index = data.students.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: "Application not found." });

    const student = data.students[index];
    if (student.status !== "pending") return res.status(409).json({ success: false, message: "This application has already been processed." });

    const rejectedAt = new Date().toISOString();
    const rejectedRecord = toApplication(student, { rejectedAt });
    ensureRejectedStore(data).push(rejectedRecord);
    data.students.splice(index, 1);
    db.write(data);
    return res.json({ success: true, message: `${student.fullName}'s application has been rejected.`, application: { ...rejectedRecord, status: "rejected" } });
}

router.post("/:id/reject", rejectApplication);
router.delete("/:id", rejectApplication);

module.exports = router;
