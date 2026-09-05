
/* =========================================
   JABICO CONSULTANCY
   MY COURSES JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================
       ELEMENTS
    ====================================== */

    const coursesGrid =
        document.getElementById("coursesGrid");

    const emptyState =
        document.getElementById("emptyState");

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const courseCount =
        document.getElementById("courseCount");

    const refreshButton =
        document.getElementById("refreshButton");

    const clearSearch =
        document.getElementById("clearSearch");


    /* MODAL */

    const courseModal =
        document.getElementById("courseModal");

    const modalClose =
        document.getElementById("modalClose");

    const modalOverlay =
        document.querySelector(".modal-overlay");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalDescription =
        document.getElementById("modalDescription");

    const modalCategory =
        document.getElementById("modalCategory");

    const modalInstructor =
        document.getElementById("modalInstructor");

    const modalModules =
        document.getElementById("modalModules");

    const modalDuration =
        document.getElementById("modalDuration");

    const modalProgress =
        document.getElementById("modalProgress");

    const modalProgressBar =
        document.getElementById("modalProgressBar");

    const modalContinue =
        document.getElementById("modalContinue");


    /* SIDEBAR */

    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");


    /* =====================================
       STUDENT NAME
    ====================================== */

    const firstName =
        localStorage.getItem("jabicoFirstName");

    const lastName =
        localStorage.getItem("jabicoLastName");

    const studentName =
        document.getElementById("studentName");


    if (firstName || lastName) {

        studentName.textContent =
            `${firstName || ""} ${lastName || ""}`.trim();

    }


    /* =====================================
       YEAR
    ====================================== */

    document.getElementById("currentYear")
        .textContent =
        new Date().getFullYear();


    /* =====================================
       COURSE DATA
       
       TEMPORARY DEMO DATA

       Your backend can later return
       exactly this structure.
    ====================================== */

    let courses = [

        {
            id: 1,

            title:
                "Introduction to Material Science",

            description:
                "Learn the fundamentals of materials, their properties, structures and applications.",

            category:
                "Materials Engineering",

            instructor:
                "Jabico Academy",

            modules:
                8,

            completedModules:
                5,

            duration:
                "6 Weeks",

            status:
                "in-progress",

            progress:
                63,

            courseUrl:
                "course.html?id=1"

        },


        {
            id: 2,

            title:
                "Engineering Mathematics",

            description:
                "Build your understanding of mathematical principles required for engineering studies.",

            category:
                "Engineering",

            instructor:
                "Jabico Academy",

            modules:
                10,

            completedModules:
                10,

            duration:
                "8 Weeks",

            status:
                "completed",

            progress:
                100,

            courseUrl:
                "course.html?id=2"

        },


        {
            id: 3,

            title:
                "Technical Communication",

            description:
                "Develop effective communication, writing and presentation skills for technical environments.",

            category:
                "Professional Skills",

            instructor:
                "Jabico Academy",

            modules:
                6,

            completedModules:
                2,

            duration:
                "4 Weeks",

            status:
                "in-progress",

            progress:
                33,

            courseUrl:
                "course.html?id=3"

        },


        {
            id: 4,

            title:
                "Foundry Technology",

            description:
                "Explore casting processes, mould preparation, melting operations and foundry practices.",

            category:
                "Manufacturing",

            instructor:
                "Jabico Academy",

            modules:
                9,

            completedModules:
                0,

            duration:
                "7 Weeks",

            status:
                "not-started",

            progress:
                0,

            courseUrl:
                "course.html?id=4"

        },


        {
            id: 5,

            title:
                "Materials Characterization",

            description:
                "Study methods used to analyze and understand the structure and properties of materials.",

            category:
                "Materials Engineering",

            instructor:
                "Jabico Academy",

            modules:
                7,

            completedModules:
                4,

            duration:
                "5 Weeks",

            status:
                "in-progress",

            progress:
                57,

            courseUrl:
                "course.html?id=5"

        },


        {
            id: 6,

            title:
                "Professional Development",

            description:
                "Improve your career readiness, teamwork, problem solving and professional skills.",

            category:
                "Professional Skills",

            instructor:
                "Jabico Academy",

            modules:
                5,

            completedModules:
                5,

            duration:
                "3 Weeks",

            status:
                "completed",

            progress:
                100,

            courseUrl:
                "course.html?id=6"

        }

    ];


    /* =====================================
       STATUS LABEL
    ====================================== */

    function getStatusLabel(status) {

        switch (status) {

            case "completed":
                return "Completed";

            case "in-progress":
                return "In Progress";

            case "not-started":
                return "Not Started";

            default:
                return "Unknown";

        }

    }


    /* =====================================
       COURSE ICON
    ====================================== */

    function getCourseIcon(category) {

        const value =
            (category || "").toLowerCase();


        if (
            value.includes("engineering")
        ) {

            return "fa-gears";

        }


        if (
            value.includes("professional")
        ) {

            return "fa-user-tie";

        }


        if (
            value.includes("manufacturing")
        ) {

            return "fa-industry";

        }


        if (
            value.includes("material")
        ) {

            return "fa-cubes";

        }


        return "fa-graduation-cap";

    }


    /* =====================================
       ESCAPE HTML
    ====================================== */

    function escapeHTML(value) {

        const element =
            document.createElement("div");

        element.textContent =
            String(value ?? "");

        return element.innerHTML;

    }


    /* =====================================
       ESCAPE ATTRIBUTE
    ====================================== */

    function escapeAttribute(value) {

        return String(value ?? "")

            .replace(/&/g, "&amp;")

            .replace(/"/g, "&quot;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;");

    }


    /* =====================================
       UPDATE STATISTICS
    ====================================== */

    function updateStatistics() {

        const total =
            courses.length;


        const completed =
            courses.filter(
                course =>
                    course.status === "completed"
            ).length;


        const active =
            courses.filter(
                course =>
                    course.status === "in-progress"
            ).length;


        let average = 0;


        if (total > 0) {

            average =
                Math.round(

                    courses.reduce(
                        (sum, course) =>
                            sum +
                            Number(course.progress || 0),

                        0
                    ) / total

                );

        }


        document.getElementById(
            "totalCourses"
        ).textContent = total;


        document.getElementById(
            "completedCourses"
        ).textContent = completed;


        document.getElementById(
            "averageProgress"
        ).textContent = `${average}%`;


        document.getElementById(
            "activeCourses"
        ).textContent = active;

    }


    /* =====================================
       RENDER COURSES
    ====================================== */

    function renderCourses(list) {


        coursesGrid.innerHTML = "";


        if (!list.length) {

            coursesGrid.style.display =
                "none";

            emptyState.hidden =
                false;

            courseCount.textContent =
                "No courses found";

            return;

        }


        coursesGrid.style.display =
            "grid";

        emptyState.hidden =
            true;


        courseCount.textContent =
            `${list.length} course${list.length === 1 ? "" : "s"} available`;


        list.forEach(course => {


            const card =
                document.createElement("article");


            card.className =
                "course-card";


            const statusClass =

                course.status === "completed"

                    ? "status-completed"

                    : course.status === "in-progress"

                        ? "status-progress"

                        : "status-not-started";


            const buttonText =

                course.status === "completed"

                    ? "Review Course"

                    : course.status === "not-started"

                        ? "Start Course"

                        : "Continue Learning";


            card.innerHTML = `

                <div class="course-card-header">

                    <span class="course-category">
                        ${escapeHTML(course.category)}
                    </span>

                    <div class="course-card-icon">

                        <i class="fa-solid ${getCourseIcon(course.category)}"></i>

                    </div>

                </div>


                <div class="course-card-body">


                    <h3>
                        ${escapeHTML(course.title)}
                    </h3>


                    <p class="course-description">
                        ${escapeHTML(course.description)}
                    </p>


                    <div class="course-instructor">

                        <div class="instructor-avatar">

                            <i class="fa-solid fa-user-tie"></i>

                        </div>


                        <div class="instructor-info">

                            <span>
                                Instructor
                            </span>

                            <strong>
                                ${escapeHTML(course.instructor)}
                            </strong>

                        </div>

                    </div>


                    <div class="progress-heading">

                        <span>
                            Course Progress
                        </span>

                        <strong>
                            ${Number(course.progress || 0)}%
                        </strong>

                    </div>


                    <div class="progress-track">

                        <div
                            class="progress-fill"
                            style="width: ${Math.min(
                                100,
                                Math.max(
                                    0,
                                    Number(course.progress || 0)
                                )
                            )}%"
                        ></div>

                    </div>


                    <div class="course-info">

                        <div class="course-info-item">

                            <i class="fa-solid fa-layer-group"></i>

                            ${Number(course.completedModules || 0)}/${Number(course.modules || 0)}
                            modules

                        </div>


                        <div class="course-info-item">

                            <i class="fa-regular fa-clock"></i>

                            ${escapeHTML(course.duration)}

                        </div>

                    </div>


                    <div class="course-status ${statusClass}">

                        ${getStatusLabel(course.status)}

                    </div>


                    <button
                        type="button"
                        class="course-button"
                        data-course-id="${escapeAttribute(course.id)}"
                    >

                        ${buttonText}

                        <i class="fa-solid fa-arrow-right"></i>

                    </button>


                </div>

            `;


            coursesGrid.appendChild(card);

        });


        attachCourseButtons();

    }


    /* =====================================
       COURSE BUTTONS
    ====================================== */

    function attachCourseButtons() {

        const buttons =
            document.querySelectorAll(
                ".course-button"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const courseId =
                        Number(
                            button.dataset.courseId
                        );


                    const course =
                        courses.find(
                            item =>
                                item.id === courseId
                        );


                    if (course) {

                        openCourseModal(course);

                    }

                }
            );

        });

    }


    /* =====================================
       OPEN COURSE MODAL
    ====================================== */

    function openCourseModal(course) {


        modalTitle.textContent =
            course.title;


        modalDescription.textContent =
            course.description;


        modalCategory.textContent =
            course.category;


        modalInstructor.textContent =
            course.instructor;


        modalModules.textContent =
            course.modules;


        modalDuration.textContent =
            course.duration;


        modalProgress.textContent =
            `${course.progress}%`;


        modalProgressBar.style.width =
            `${Math.min(
                100,
                Math.max(
                    0,
                    Number(course.progress)
                )
            )}%`;


        modalContinue.href =
            course.courseUrl || "#";


        courseModal.hidden =
            false;


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================
       CLOSE MODAL
    ====================================== */

    function closeCourseModal() {

        courseModal.hidden =
            true;

        document.body.style.overflow =
            "";

    }


    modalClose.addEventListener(
        "click",
        closeCourseModal
    );


    modalOverlay.addEventListener(
        "click",
        closeCourseModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                !courseModal.hidden
            ) {

                closeCourseModal();

            }

        }
    );


    /* =====================================
       SEARCH + FILTER
    ====================================== */

    function filterCourses() {


        const searchTerm =
            searchInput.value
                .trim()
                .toLowerCase();


        const selectedStatus =
            statusFilter.value;


        const filtered =
            courses.filter(course => {


                const matchesSearch =

                    course.title
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    course.description
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    course.category
                        .toLowerCase()
                        .includes(searchTerm);


                const matchesStatus =

                    selectedStatus === "all"

                    ||

                    course.status === selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            });


        renderCourses(filtered);

    }


    searchInput.addEventListener(
        "input",
        filterCourses
    );


    statusFilter.addEventListener(
        "change",
        filterCourses
    );


    /* =====================================
       CLEAR SEARCH
    ====================================== */

    clearSearch.addEventListener(
        "click",
        () => {

            searchInput.value =
                "";

            statusFilter.value =
                "all";

            renderCourses(courses);

        }
    );


    /* =====================================
       BACKEND-READY LOADER
       
       Replace the demo section later
       with an API request.
    ====================================== */

    async function loadCourses() {


        refreshButton.classList.add(
            "loading"
        );


        try {


            /*
             * =================================
             * FUTURE BACKEND
             * =================================
             *
             * Example:
             *
             * const response =
             *     await fetch("/api/student/courses");
             *
             * if (!response.ok) {
             *     throw new Error(
             *         "Failed to load courses"
             *     );
             * }
             *
             * const data =
             *     await response.json();
             *
             * courses =
             *     data.courses;
             *
             * updateStatistics();
             *
             * renderCourses(courses);
             *
             * =================================
             */


            /*
             * Temporary delay to simulate
             * server communication.
             */

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        400
                    )
            );


            updateStatistics();

            renderCourses(courses);

        }

        catch (error) {

            console.error(
                "Unable to load courses:",
                error
            );


            coursesGrid.innerHTML =
                "";


            coursesGrid.style.display =
                "none";


            emptyState.hidden =
                false;


            courseCount.textContent =
                "Unable to load courses.";

        }

        finally {

            refreshButton.classList.remove(
                "loading"
            );

        }

    }


    refreshButton.addEventListener(
        "click",
        loadCourses
    );


    /* =====================================
       MOBILE SIDEBAR
    ====================================== */

    function closeSidebar() {

        sidebar.classList.remove(
            "open"
        );

        sidebarOverlay.classList.remove(
            "active"
        );

    }


    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

            sidebarOverlay.classList.toggle(
                "active"
            );

        }
    );


    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );


    /* =====================================
       INITIALIZE
    ====================================== */

    loadCourses();

});

