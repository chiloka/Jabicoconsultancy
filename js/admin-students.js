/* =========================================================
   JABICO CONSULTANCY
   ADMIN STUDENT MANAGEMENT JAVASCRIPT

   NOTE:
   This currently uses frontend demo data.

   Later, replace the local/demo operations with API calls,
   for example:

   GET    /api/admin/students
   POST   /api/admin/students
   GET    /api/admin/students/:id
   PUT    /api/admin/students/:id
   PATCH  /api/admin/students/:id/status
   DELETE /api/admin/students/:id

========================================================= */


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =========================================================
   ELEMENTS
========================================================= */

const body = document.body;

const sidebar =
    $("#adminSidebar");

const sidebarOverlay =
    $("#sidebarOverlay");

const mobileMenuBtn =
    $("#mobileMenuBtn");

const themeToggle =
    $("#themeToggle");

const notificationBtn =
    $("#notificationBtn");

const notificationDropdown =
    $("#notificationDropdown");

const markNotificationsRead =
    $("#markNotificationsRead");

const profileButton =
    $("#profileButton");

const profileDropdown =
    $("#profileDropdown");

const studentSearch =
    $("#studentSearch");

const clearStudentSearch =
    $("#clearStudentSearch");

const cohortFilter =
    $("#cohortFilter");

const statusFilter =
    $("#statusFilter");

const sortStudents =
    $("#sortStudents");

const resetFilters =
    $("#resetFilters");

const emptyResetBtn =
    $("#emptyResetBtn");

const studentsEmpty =
    $("#studentsEmpty");

const studentsTableBody =
    $("#studentsTableBody");

const visibleStudentCount =
    $("#visibleStudentCount");

const selectedStudentCount =
    $("#selectedStudentCount");

const selectAllStudents =
    $("#selectAllStudents");

const mobileStudentList =
    $("#mobileStudentList");

const globalSearch =
    $("#globalSearch");

const addStudentBtn =
    $("#addStudentBtn");

const addStudentModal =
    $("#addStudentModal");

const addStudentForm =
    $("#addStudentForm");

const viewStudentModal =
    $("#viewStudentModal");

const deleteStudentModal =
    $("#deleteStudentModal");

const studentActionMenu =
    $("#studentActionMenu");

const adminToast =
    $("#adminToast");

const toastTitle =
    $("#toastTitle");

const toastMessage =
    $("#toastMessage");

const closeToast =
    $("#closeToast");

const deleteStudentName =
    $("#deleteStudentName");

const confirmDeleteStudent =
    $("#confirmDeleteStudent");

const suspendStudentBtn =
    $("#suspendStudentBtn");


/* =========================================================
   APPLICATION STATE

   Later this can be populated by:
   fetch("/api/admin/students")
========================================================= */

const state = {

    students: [],

    selectedStudentId: null,

    actionStudentId: null,

    currentFilters: {

        search: "",

        cohort: "all",

        status: "all",

        sort: "latest"

    }

};


/* =========================================================
   LOAD DEMO STUDENTS FROM HTML

   This makes the frontend easy to replace with API data
   later.
========================================================= */

function loadStudentsFromDOM() {

    const rows =
        $$(".student-row", studentsTableBody);

    state.students =
        rows.map(row => ({

            id:
                row.dataset.id,

            name:
                row.dataset.name,

            email:
                row.dataset.email,

            cohort:
                row.dataset.cohort,

            status:
                row.dataset.status,

            progress:
                Number(row.dataset.progress),

            joined:
                row.dataset.joined,

            element:
                row

        }));

}


/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar() {

    sidebar.classList.add("open");

    sidebarOverlay.classList.add("show");

    mobileMenuBtn.setAttribute(
        "aria-expanded",
        "true"
    );

    body.style.overflow = "hidden";

}


function closeSidebar() {

    sidebar.classList.remove("open");

    sidebarOverlay.classList.remove("show");

    mobileMenuBtn.setAttribute(
        "aria-expanded",
        "false"
    );

    body.style.overflow = "";

}


if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener(
        "click",
        () => {

            if (
                sidebar.classList.contains("open")
            ) {

                closeSidebar();

            } else {

                openSidebar();

            }

        }
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );

}


$$(".admin-nav-item").forEach(link => {

    link.addEventListener(
        "click",
        () => {

            if (
                window.innerWidth <= 900
            ) {

                closeSidebar();

            }

        }
    );

});


/* =========================================================
   DARK MODE
========================================================= */

function updateThemeIcon() {

    if (!themeToggle) return;

    const icon =
        $("i", themeToggle);

    if (
        body.classList.contains("dark-mode")
    ) {

        icon.className =
            "fas fa-sun";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

    } else {

        icon.className =
            "fas fa-moon";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

    }

}


function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "jabico-admin-theme"
        );

    if (
        savedTheme === "dark"
    ) {

        body.classList.add(
            "dark-mode"
        );

    }

    updateThemeIcon();

}


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            body.classList.toggle(
                "dark-mode"
            );

            const isDark =
                body.classList.contains(
                    "dark-mode"
                );

            localStorage.setItem(
                "jabico-admin-theme",
                isDark
                    ? "dark"
                    : "light"
            );

            updateThemeIcon();

        }
    );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function closeNotificationDropdown() {

    if (!notificationDropdown) return;

    notificationDropdown.classList.remove(
        "show"
    );

    notificationBtn?.setAttribute(
        "aria-expanded",
        "false"
    );

}


if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            const isOpen =
                notificationDropdown.classList.contains(
                    "show"
                );

            closeProfileDropdown();

            if (isOpen) {

                closeNotificationDropdown();

            } else {

                notificationDropdown.classList.add(
                    "show"
                );

                notificationBtn.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        }
    );

}


if (markNotificationsRead) {

    markNotificationsRead.addEventListener(
        "click",
        () => {

            const dot =
                $(".notification-dot");

            if (dot) {

                dot.style.display =
                    "none";

            }

            showToast(
                "Notifications",
                "All notifications have been marked as read."
            );

            closeNotificationDropdown();

        }
    );

}


/* =========================================================
   PROFILE DROPDOWN
========================================================= */

function closeProfileDropdown() {

    if (!profileDropdown) return;

    profileDropdown.hidden = true;

}


if (profileButton) {

    profileButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            closeNotificationDropdown();

            profileDropdown.hidden =
                !profileDropdown.hidden;

        }
    );

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

if (globalSearch) {

    globalSearch.addEventListener(
        "input",
        event => {

            const value =
                event.target.value.trim();

            if (
                value.length > 0
            ) {

                studentSearch.value =
                    value;

                state.currentFilters.search =
                    value.toLowerCase();

                filterStudents();

            }

        }
    );

}


/* =========================================================
   STUDENT SEARCH
========================================================= */

if (studentSearch) {

    studentSearch.addEventListener(
        "input",
        event => {

            state.currentFilters.search =
                event.target.value
                    .trim()
                    .toLowerCase();

            clearStudentSearch.hidden =
                state.currentFilters.search.length === 0;

            filterStudents();

        }
    );

}


if (clearStudentSearch) {

    clearStudentSearch.addEventListener(
        "click",
        () => {

            studentSearch.value = "";

            state.currentFilters.search =
                "";

            clearStudentSearch.hidden =
                true;

            filterStudents();

            studentSearch.focus();

        }
    );

}


/* =========================================================
   FILTERS
========================================================= */

if (cohortFilter) {

    cohortFilter.addEventListener(
        "change",
        event => {

            state.currentFilters.cohort =
                event.target.value;

            filterStudents();

        }
    );

}


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        event => {

            state.currentFilters.status =
                event.target.value;

            filterStudents();

        }
    );

}


if (sortStudents) {

    sortStudents.addEventListener(
        "change",
        event => {

            state.currentFilters.sort =
                event.target.value;

            filterStudents();

        }
    );

}


/* =========================================================
   FILTER STUDENTS
========================================================= */

function filterStudents() {

    const {

        search,
        cohort,
        status,
        sort

    } = state.currentFilters;


    let filtered =
        [...state.students];


    /* SEARCH */

    if (search) {

        filtered =
            filtered.filter(student => {

                const searchable =
                    `${student.name} ${student.email}`
                        .toLowerCase();

                return searchable.includes(
                    search
                );

            });

    }


    /* COHORT */

    if (
        cohort !== "all"
    ) {

        filtered =
            filtered.filter(student =>
                student.cohort === cohort
            );

    }


    /* STATUS */

    if (
        status !== "all"
    ) {

        filtered =
            filtered.filter(student =>
                student.status === status
            );

    }


    /* SORT */

    if (
        sort === "name"
    ) {

        filtered.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }


    if (
        sort === "progress"
    ) {

        filtered.sort(
            (a, b) =>
                b.progress - a.progress
        );

    }


    if (
        sort === "latest"
    ) {

        filtered.sort(
            (a, b) =>
                new Date(b.joined) -
                new Date(a.joined)
        );

    }


    if (
        sort === "oldest"
    ) {

        filtered.sort(
            (a, b) =>
                new Date(a.joined) -
                new Date(b.joined)
        );

    }


    renderFilteredStudents(
        filtered
    );

}


/* =========================================================
   RENDER FILTERED STUDENTS
========================================================= */

function renderFilteredStudents(
    students
) {

    state.students.forEach(student => {

        student.element.style.display =
            "none";

    });


    students.forEach(student => {

        student.element.style.display =
            "";

    });


    visibleStudentCount.textContent =
        students.length;


    if (
        students.length === 0
    ) {

        studentsEmpty.hidden =
            false;

        mobileStudentList.innerHTML =
            "";

    } else {

        studentsEmpty.hidden =
            true;

        renderMobileStudents(
            students
        );

    }

}


/* =========================================================
   MOBILE STUDENT CARDS
========================================================= */

function renderMobileStudents(
    students
) {

    if (!mobileStudentList) return;


    mobileStudentList.innerHTML =
        students.map(student => {

            const initials =
                getInitials(
                    student.name
                );

            const avatarClass =
                getAvatarClass(
                    student.id
                );

            const statusLabel =
                capitalize(
                    student.status
                );


            return `

                <article
                    class="mobile-student-card"
                    data-id="${student.id}"
                >

                    <div class="mobile-student-top">

                        <div
                            class="student-avatar ${avatarClass}"
                        >
                            ${initials}
                        </div>


                        <div class="mobile-student-main">

                            <strong>
                                ${escapeHTML(student.name)}
                            </strong>

                            <span>
                                ${escapeHTML(student.email)}
                            </span>

                        </div>


                        <button
                            type="button"
                            class="mobile-student-more"
                            data-mobile-action
                            data-id="${student.id}"
                            aria-label="Student actions"
                        >

                            <i class="fas fa-ellipsis"></i>

                        </button>

                    </div>


                    <div class="mobile-student-meta">

                        <div class="mobile-meta-item">

                            <span>
                                Cohort
                            </span>

                            <strong>
                                ${formatCohort(student.cohort)}
                            </strong>

                        </div>


                        <div class="mobile-meta-item">

                            <span>
                                Status
                            </span>

                            <strong>

                                <span
                                    class="status-badge ${student.status}"
                                >

                                    <i class="fas fa-circle"></i>

                                    ${statusLabel}

                                </span>

                            </strong>

                        </div>

                    </div>


                    <div class="mobile-progress">

                        <div class="mobile-progress-header">

                            <span>
                                Learning Progress
                            </span>

                            <strong>
                                ${student.progress}%
                            </strong>

                        </div>


                        <div class="progress-bar">

                            <span
                                style="width:${student.progress}%"
                            ></span>

                        </div>

                    </div>

                </article>

            `;

        }).join("");


    $$(
        "[data-mobile-action]",
        mobileStudentList
    ).forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const studentId =
                    button.dataset.id;

                openActionMenu(
                    button,
                    studentId
                );

            }
        );

    });

}


/* =========================================================
   ACTION MENUS
========================================================= */

$$("[data-action-menu]").forEach(
    button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const row =
                    button.closest(
                        ".student-row"
                    );

                if (!row) return;

                openActionMenu(
                    button,
                    row.dataset.id
                );

            }
        );

    }
);


function openActionMenu(
    button,
    studentId
) {

    const rect =
        button.getBoundingClientRect();


    state.actionStudentId =
        studentId;


    studentActionMenu.hidden =
        false;


    const menuWidth =
        180;


    let left =
        rect.right -
        menuWidth;


    let top =
        rect.bottom +
        6;


    if (
        left < 10
    ) {

        left = 10;

    }


    if (
        left + menuWidth >
        window.innerWidth - 10
    ) {

        left =
            window.innerWidth -
            menuWidth -
            10;

    }


    if (
        top + 180 >
        window.innerHeight
    ) {

        top =
            rect.top -
            186;

    }


    studentActionMenu.style.left =
        `${left}px`;

    studentActionMenu.style.top =
        `${top}px`;

}


/* =========================================================
   ACTION MENU BUTTONS
========================================================= */

$$(
    "[data-student-action]",
    studentActionMenu
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const action =
                button.dataset.studentAction;

            const student =
                findStudent(
                    state.actionStudentId
                );


            closeActionMenu();


            if (!student) return;


            if (
                action === "view"
            ) {

                openViewStudent(
                    student
                );

            }


            if (
                action === "edit"
            ) {

                openEditStudent(
                    student
                );

            }


            if (
                action === "message"
            ) {

                showToast(
                    "Message",
                    `Message composer for ${student.name} will be connected to the backend later.`
                );

            }


            if (
                action === "delete"
            ) {

                openDeleteStudent(
                    student
                );

            }

        }
    );

});


function closeActionMenu() {

    studentActionMenu.hidden =
        true;

    state.actionStudentId =
        null;

}


/* =========================================================
   CLOSE FLOATING UI
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".student-action-menu"
            ) &&
            !event.target.closest(
                "[data-action-menu]"
            ) &&
            !event.target.closest(
                "[data-mobile-action]"
            )
        ) {

            closeActionMenu();

        }


        if (
            !event.target.closest(
                ".profile-dropdown"
            ) &&
            !event.target.closest(
                "#profileButton"
            )
        ) {

            closeProfileDropdown();

        }


        if (
            !event.target.closest(
                ".notification-wrapper"
            )
        ) {

            closeNotificationDropdown();

        }

    }
);


/* =========================================================
   VIEW STUDENT
========================================================= */

function openViewStudent(
    student
) {

    if (!viewStudentModal) return;


    $("#viewStudentAvatar").textContent =
        getInitials(student.name);

    $("#viewStudentName").textContent =
        student.name;

    $("#viewStudentEmail").textContent =
        student.email;

    $("#viewStudentProgress").textContent =
        `${student.progress}%`;

    $("#viewStudentId").textContent =
        student.id;

    $("#viewStudentCohort").textContent =
        formatCohort(
            student.cohort
        );

    $("#viewStudentJoined").textContent =
        formatDate(
            student.joined
        );


    const statusElement =
        $("#viewStudentStatus");


    statusElement.className =
        `status-badge ${student.status}`;


    statusElement.innerHTML = `

        <i class="fas fa-circle"></i>

        ${capitalize(student.status)}

    `;


    state.selectedStudentId =
        student.id;


    openModal(
        viewStudentModal
    );

}


/* =========================================================
   ADD STUDENT
========================================================= */

if (addStudentBtn) {

    addStudentBtn.addEventListener(
        "click",
        () => {

            openModal(
                addStudentModal
            );

            setTimeout(
                () => {

                    $("#studentFirstName")?.focus();

                },
                200
            );

        }
    );

}


if (addStudentForm) {

    addStudentForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const formData =
                new FormData(
                    addStudentForm
                );


            const firstName =
                formData.get(
                    "firstName"
                ).trim();

            const lastName =
                formData.get(
                    "lastName"
                ).trim();

            const email =
                formData.get(
                    "email"
                ).trim();

            const cohort =
                formData.get(
                    "cohort"
                );

            const status =
                formData.get(
                    "status"
                );


            if (
                !firstName ||
                !lastName ||
                !email ||
                !cohort
            ) {

                showToast(
                    "Missing Information",
                    "Please complete all required fields.",
                    "error"
                );

                return;

            }


            /*
                FUTURE BACKEND:

                fetch("/api/admin/students", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        cohort,
                        status
                    })
                });
            */


            const newStudent = {

                id:
                    `STU-${String(
                        state.students.length + 1
                    ).padStart(3, "0")}`,

                name:
                    `${firstName} ${lastName}`,

                email,

                cohort,

                status,

                progress: 0,

                joined:
                    new Date()
                        .toISOString()
                        .split("T")[0],

                element:
                    null

            };


            state.students.unshift(
                newStudent
            );


            closeModal(
                addStudentModal
            );


            addStudentForm.reset();


            showToast(
                "Student Created",
                `${newStudent.name} has been added successfully.`
            );


            /*
                In the final backend version,
                renderStudents() will be replaced
                by server data.
            */

        }
    );

}


/* =========================================================
   EDIT STUDENT
========================================================= */

function openEditStudent(
    student
) {

    /*
        For now we use the Add Student form
        as the foundation for editing.

        Later this should become a dedicated
        PUT/PATCH request.
    */

    $("#studentFirstName").value =
        student.name.split(" ")[0] || "";

    $("#studentLastName").value =
        student.name
            .split(" ")
            .slice(1)
            .join(" ") || "";

    $("#studentEmail").value =
        student.email;

    $("#studentCohort").value =
        student.cohort;

    $("#studentStatus").value =
        student.status;


    state.selectedStudentId =
        student.id;


    openModal(
        addStudentModal
    );


    const title =
        $("#addStudentTitle");

    title.textContent =
        "Edit Student";


    const submitButton =
        $("button[type='submit']", addStudentForm);

    submitButton.innerHTML = `

        <i class="fas fa-save"></i>

        Save Changes

    `;


    addStudentForm.dataset.mode =
        "edit";


}


/* =========================================================
   EDIT FORM MODE
========================================================= */

if (addStudentForm) {

    addStudentForm.addEventListener(
        "submit",
        event => {

            if (
                addStudentForm.dataset.mode !==
                "edit"
            ) {

                return;

            }


            event.preventDefault();


            const student =
                findStudent(
                    state.selectedStudentId
                );


            if (!student) return;


            student.name =
                `${$("#studentFirstName").value.trim()}
                 ${$("#studentLastName").value.trim()}`
                    .replace(/\s+/g, " ");

            student.email =
                $("#studentEmail").value.trim();

            student.cohort =
                $("#studentCohort").value;

            student.status =
                $("#studentStatus").value;


            /*
                FUTURE BACKEND:

                fetch(`/api/admin/students/${student.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(student)
                });
            */


            closeModal(
                addStudentModal
            );


            resetStudentFormMode();


            filterStudents();


            showToast(
                "Student Updated",
                `${student.name}'s information has been updated.`
            );

        }
    );

}


function resetStudentFormMode() {

    addStudentForm.dataset.mode =
        "create";

    $("#addStudentTitle").textContent =
        "Add New Student";


    const submitButton =
        $("button[type='submit']", addStudentForm);


    submitButton.innerHTML = `

        <i class="fas fa-user-plus"></i>

        Create Student

    `;

}


/* =========================================================
   EDIT FROM VIEW MODAL
========================================================= */

const editStudentFromView =
    $("#editStudentFromView");


if (editStudentFromView) {

    editStudentFromView.addEventListener(
        "click",
        () => {

            const student =
                findStudent(
                    state.selectedStudentId
                );

            if (!student) return;


            closeModal(
                viewStudentModal
            );


            setTimeout(
                () => {

                    openEditStudent(
                        student
                    );

                },
                150
            );

        }
    );

}


/* =========================================================
   SUSPEND / ACTIVATE
========================================================= */

if (suspendStudentBtn) {

    suspendStudentBtn.addEventListener(
        "click",
        () => {

            const student =
                findStudent(
                    state.selectedStudentId
                );

            if (!student) return;


            if (
                student.status ===
                "suspended"
            ) {

                student.status =
                    "active";

            } else {

                student.status =
                    "suspended";

            }


            /*
                FUTURE BACKEND:

                PATCH
                /api/admin/students/:id/status
            */


            filterStudents();


            openViewStudent(
                student
            );


            showToast(
                "Status Updated",
                `${student.name} is now ${student.status}.`
            );

        }
    );

}


/* =========================================================
   DELETE STUDENT
========================================================= */

function openDeleteStudent(
    student
) {

    state.selectedStudentId =
        student.id;

    deleteStudentName.textContent =
        student.name;

    openModal(
        deleteStudentModal
    );

}


if (confirmDeleteStudent) {

    confirmDeleteStudent.addEventListener(
        "click",
        () => {

            const student =
                findStudent(
                    state.selectedStudentId
                );

            if (!student) return;


            /*
                FUTURE BACKEND:

                fetch(
                    `/api/admin/students/${student.id}`,
                    {
                        method: "DELETE"
                    }
                );
            */


            state.students =
                state.students.filter(
                    item =>
                        item.id !==
                        student.id
                );


            if (student.element) {

                student.element.remove();

            }


            closeModal(
                deleteStudentModal
            );


            filterStudents();


            showToast(
                "Student Deleted",
                `${student.name} has been removed.`
            );


            state.selectedStudentId =
                null;

        }
    );

}


/* =========================================================
   MODAL HELPERS
========================================================= */

function openModal(
    modal
) {

    if (!modal) return;


    modal.classList.add(
        "show"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    body.style.overflow =
        "hidden";

}


function closeModal(
    modal
) {

    if (!modal) return;


    modal.classList.remove(
        "show"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    if (
        !$(".modal.show")
    ) {

        body.style.overflow =
            "";

    }

}


$$("[data-close-modal]").forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const modal =
                    button.closest(
                        ".modal"
                    );

                closeModal(
                    modal
                );


                if (
                    modal ===
                    addStudentModal
                ) {

                    resetStudentFormMode();

                    addStudentForm.reset();

                }

            }
        );

    }
);


$$(".modal-overlay").forEach(
    overlay => {

        overlay.addEventListener(
            "click",
            () => {

                const modal =
                    overlay.closest(
                        ".modal"
                    );

                closeModal(
                    modal
                );

            }
        );

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        closeActionMenu();

        closeNotificationDropdown();

        closeProfileDropdown();


        $$(".modal.show").forEach(
            modal => {

                closeModal(
                    modal
                );

            }
        );

    }
);


/* =========================================================
   RESET FILTERS
========================================================= */

function resetAllFilters() {

    state.currentFilters = {

        search: "",

        cohort: "all",

        status: "all",

        sort: "latest"

    };


    studentSearch.value = "";

    cohortFilter.value =
        "all";

    statusFilter.value =
        "all";

    sortStudents.value =
        "latest";


    if (globalSearch) {

        globalSearch.value =
            "";

    }


    clearStudentSearch.hidden =
        true;


    filterStudents();

}


if (resetFilters) {

    resetFilters.addEventListener(
        "click",
        resetAllFilters
    );

}


if (emptyResetBtn) {

    emptyResetBtn.addEventListener(
        "click",
        resetAllFilters
    );

}


/* =========================================================
   SELECT ALL STUDENTS
========================================================= */

if (selectAllStudents) {

    selectAllStudents.addEventListener(
        "change",
        event => {

            const visibleRows =
                state.students
                    .filter(student =>
                        student.element.style.display !==
                        "none"
                    );


            visibleRows.forEach(
                student => {

                    const checkbox =
                        $(".student-checkbox", student.element);

                    if (checkbox) {

                        checkbox.checked =
                            event.target.checked;

                    }

                }
            );


            updateSelectedCount();

        }
    );

}


/* =========================================================
   INDIVIDUAL CHECKBOXES
========================================================= */

function attachCheckboxListeners() {

    $$(".student-checkbox").forEach(
        checkbox => {

            checkbox.addEventListener(
                "change",
                updateSelectedCount
            );

        }
    );

}


function updateSelectedCount() {

    const selected =
        $$(".student-checkbox:checked");

    selectedStudentCount.textContent =
        selected.length;


    if (
        selectAllStudents
    ) {

        const visibleCheckboxes =
            state.students
                .filter(student =>
                    student.element.style.display !==
                    "none"
                )
                .map(student =>
                    $(".student-checkbox", student.element)
                )
                .filter(Boolean);


        selectAllStudents.checked =
            visibleCheckboxes.length > 0 &&
            visibleCheckboxes.every(
                checkbox =>
                    checkbox.checked
            );

    }

}


/* =========================================================
   EXPORT
========================================================= */

const exportStudentsBtn =
    $("#exportStudentsBtn");


if (exportStudentsBtn) {

    exportStudentsBtn.addEventListener(
        "click",
        () => {

            const visibleStudents =
                state.students.filter(
                    student =>
                        student.element &&
                        student.element.style.display !==
                        "none"
                );


            const headers = [
                "Student ID",
                "Name",
                "Email",
                "Cohort",
                "Progress",
                "Status",
                "Joined"
            ];


            const rows =
                visibleStudents.map(
                    student => [

                        student.id,

                        student.name,

                        student.email,

                        formatCohort(
                            student.cohort
                        ),

                        `${student.progress}%`,

                        capitalize(
                            student.status
                        ),

                        student.joined

                    ]
                );


            const csv =
                [
                    headers,
                    ...rows
                ]
                    .map(row =>
                        row.map(
                            value =>
                                `"${String(value)
                                    .replace(
                                        /"/g,
                                        '""'
                                    )}"`
                        ).join(",")
                    )
                    .join("\n");


            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                            "text/csv;charset=utf-8;"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;

            link.download =
                "jabico-students.csv";


            document.body.appendChild(
                link
            );

            link.click();

            link.remove();


            URL.revokeObjectURL(
                url
            );


            showToast(
                "Export Complete",
                "Student data has been exported successfully."
            );

        }
    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(
    title,
    message,
    type = "success"
) {

    if (!adminToast) return;


    toastTitle.textContent =
        title;

    toastMessage.textContent =
        message;


    const icon =
        $(".toast-icon i", adminToast);


    if (
        type === "error"
    ) {

        icon.className =
            "fas fa-circle-exclamation";

        $(".toast-icon", adminToast)
            .style.background =
            "var(--danger-light)";

        $(".toast-icon", adminToast)
            .style.color =
            "var(--danger)";

    } else {

        icon.className =
            "fas fa-check";

        $(".toast-icon", adminToast)
            .style.background =
            "var(--success-light)";

        $(".toast-icon", adminToast)
            .style.color =
            "var(--success)";

    }


    adminToast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                adminToast.classList.remove(
                    "show"
                );

            },
            3500
        );

}


if (closeToast) {

    closeToast.addEventListener(
        "click",
        () => {

            adminToast.classList.remove(
                "show"
            );

        }
    );

}


/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function findStudent(
    id
) {

    return state.students.find(
        student =>
            student.id === id
    );

}


function getInitials(
    name
) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
            word =>
                word[0].toUpperCase()
        )
        .join("");

}


function getAvatarClass(
    id
) {

    const classes = [
        "blue",
        "purple",
        "green",
        "orange",
        "red",
        "teal",
        "pink"
    ];


    const numeric =
        parseInt(
            String(id).replace(
                /\D/g,
                ""
            ),
            10
        ) || 0;


    return classes[
        numeric % classes.length
    ];

}


function formatCohort(
    cohort
) {

    const map = {

        "cohort-01":
            "Cohort 01",

        "cohort-02":
            "Cohort 02",

        "cohort-03":
            "Cohort 03"

    };


    return map[cohort] ||
        cohort;

}


function capitalize(
    value
) {

    if (!value) return "";

    return value.charAt(0).toUpperCase() +
        value.slice(1);

}


function formatDate(
    dateString
) {

    const date =
        new Date(
            dateString
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeStudentPage() {

    loadTheme();

    loadStudentsFromDOM();

    attachCheckboxListeners();

    filterStudents();

    updateSelectedCount();

}


document.addEventListener(
    "DOMContentLoaded",
    initializeStudentPage
);


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 900
        ) {

            closeSidebar();

        }

    }
);


/* =========================================================
   FUTURE BACKEND API PLACEHOLDER

   When we build the backend, this is where we can centralize
   all student API communication.

========================================================= */

/*

async function fetchStudentsFromAPI() {

    try {

        const response =
            await fetch(
                "/api/admin/students",
                {
                    method: "GET",
                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${adminToken}`
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to fetch students"
            );

        }


        const data =
            await response.json();


        state.students =
            data.students;


        renderStudentsFromAPI();


    } catch (error) {

        console.error(
            error
        );


        showToast(
            "Error",
            "Unable to load students.",
            "error"
        );

    }

}


async function createStudentAPI(student) {

    const response =
        await fetch(
            "/api/admin/students",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(student)
            }
        );


    return response.json();

}


async function updateStudentAPI(
    id,
    student
) {

    const response =
        await fetch(
            `/api/admin/students/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(student)
            }
        );


    return response.json();

}


async function deleteStudentAPI(
    id
) {

    const response =
        await fetch(
            `/api/admin/students/${id}`,
            {
                method: "DELETE"
            }
        );


    return response.json();

}

*/
